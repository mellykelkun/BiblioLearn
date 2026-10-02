 'use strict';

const path = require('node:path');
const express = require('express');
const documentationLocale = require('./src/data');

const app = express();
const port = Number(process.env.PORT) || 3000;
const dossierPublic = path.join(__dirname, 'public');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let documentationDistante;

app.disable('x-powered-by');

app.use((requete, reponse, suivant) => {
  reponse.setHeader('X-Content-Type-Options', 'nosniff');
  reponse.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  suivant();
});

app.use(express.static(dossierPublic, {
  extensions: ['html'],
  // Le contenu change pendant les itérations de la documentation ;
  // on laisse Vercel revalider les fichiers à chaque nouvelle version.
  maxAge: 0
}));

app.get('/api/sante', async (requete, reponse) => {
  const documentation = await chargerDocumentation();
  reponse.json({ statut: 'ok', fiches: documentation.statistiques.nombreFiches, ateliers: documentation.statistiques.nombreAteliers, source: documentation === documentationLocale ? 'local' : 'supabase' });
});

app.get('/api/documentation', async (request, response) => {
  response.json(await chargerDocumentation());
});

app.get('*', (request, response) => {
  response.sendFile(path.join(dossierPublic, 'index.html'));
});

const serveur = app.listen(port, () => {
  console.log(`\n  Bibliolearn est prêt sur http://localhost:${port}\n`);
});

function arreterProprement() {
  serveur.close(() => process.exit(0));
}

process.on('SIGINT', arreterProprement);
process.on('SIGTERM', arreterProprement);

async function chargerDocumentation() {
  if (!supabaseUrl || !supabaseKey) return documentationLocale;
  if (!documentationDistante) documentationDistante = chargerDepuisSupabase().catch((erreur) => {
    console.warn(`  Supabase indisponible, fallback local : ${erreur.message}`);
    return documentationLocale;
  });
  return documentationDistante;
}

async function chargerDepuisSupabase() {
  const [domaines, fiches, ateliers, bibliotheque] = await Promise.all([
    requeteSupabase('bibliolearn_domains', 'id,name,group_name,icon,description,sort_order'),
    requeteSupabase('bibliolearn_lessons', 'id,domain_id,category,title,summary,tags,level,sections,sessions,related_ids,sort_order'),
    requeteSupabase('bibliolearn_workshops', 'id,domain_id,title,objective,level,duration,tools,prerequisites,file_structure,steps,validation,hint,related_ids,sort_order'),
    requeteSupabase('bibliolearn_library_entries', 'id,term,category,family,level,aliases,summary,definition,article,roles,why_use,avoid_when,warnings,scenarios,code_structure,data_types,data_cycle,examples,exercise,related_ids,links,sort_order')
  ]);
  if (!domaines.length || !fiches.length || !ateliers.length) throw new Error('les tables Bibliolearn sont vides');
  const resultat = {
    meta: { version: 2, miseAJour: '2026-10-01', source: 'supabase' },
    domaines: domaines.map((domaine) => ({ id: domaine.id, nom: domaine.name, groupe: domaine.group_name, icone: domaine.icon, description: domaine.description })),
    fiches: fiches.map((fiche) => ({ id: fiche.id, domaine: fiche.domain_id, categorie: fiche.category, titre: fiche.title, resume: fiche.summary, tags: fiche.tags, niveau: fiche.level, sections: fiche.sections, sessions: fiche.sessions, associes: fiche.related_ids })),
    ateliers: ateliers.map((atelier) => ({ id: atelier.id, domaine: atelier.domain_id, titre: atelier.title, objectif: atelier.objective, niveau: atelier.level, duree: atelier.duration, outils: atelier.tools, prerequis: atelier.prerequisites, structure: atelier.file_structure, etapes: atelier.steps, validation: atelier.validation, indice: atelier.hint, associes: atelier.related_ids })),
    bibliotheque: bibliotheque.map((entree) => ({ id: entree.id, terme: entree.term, categorie: entree.category, famille: entree.family, niveau: entree.level, aliases: entree.aliases, resume: entree.summary, definition: entree.definition, article: entree.article || [], roles: entree.roles, pourquoiUtiliser: entree.why_use, nePasUtiliser: entree.avoid_when, avertissements: entree.warnings, scenarios: entree.scenarios, structure: entree.code_structure, typesDonnees: entree.data_types, cycleDonnees: entree.data_cycle, exemples: entree.examples, exercice: entree.exercise, associes: entree.related_ids, liens: entree.links }))
  };
  resultat.statistiques = {
    nombreFiches: resultat.fiches.length,
    nombreDomaines: resultat.domaines.length,
    nombreAteliers: resultat.ateliers.length,
    nombreExemples: resultat.fiches.reduce((total, fiche) => total + fiche.sections.filter((section) => section.type === 'code').length, 0),
    nombreBibliotheque: resultat.bibliotheque.length
  };
  return resultat;
}

async function requeteSupabase(table, select) {
  const lignes = [];
  const taillePage = 1000;
  for (let offset = 0; ; offset += taillePage) {
    const url = new URL(`/rest/v1/${table}`, supabaseUrl);
    url.searchParams.set('select', select);
    url.searchParams.set('order', 'sort_order.asc');
    url.searchParams.set('limit', String(taillePage));
    url.searchParams.set('offset', String(offset));
    const resultat = await fetch(url, { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } });
    if (!resultat.ok) throw new Error(`${table}: HTTP ${resultat.status}`);
    const page = await resultat.json();
    if (!Array.isArray(page)) throw new Error(`${table}: réponse Supabase invalide`);
    lignes.push(...page);
    if (page.length < taillePage) return lignes;
  }
}
