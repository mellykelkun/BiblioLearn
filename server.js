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

app.get(['/catalogue/*', '/modules/*'], (request, response) => {
  response.status(404).json({ erreur: 'Ressource absente' });
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
  const { lireCatalogueDistant } = require('./src/catalogue-distant');
  return lireCatalogueDistant({ local: documentationLocale, url: supabaseUrl, cle: supabaseKey });
}
