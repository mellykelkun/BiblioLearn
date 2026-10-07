'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const catalogue = require('../src/data');
const publicPath = path.join(__dirname, '..', 'public');
const serialise = JSON.stringify(catalogue);
const version = createHash('sha256').update(serialise).digest('hex').slice(0, 16);
const racine = path.join(publicPath, 'catalogue');
fs.mkdirSync(racine, { recursive: true });
for (const nom of fs.readdirSync(racine)) if (/^[a-f0-9]{16}$/.test(nom)) fs.rmSync(path.join(racine, nom), { recursive: true });
const destination = path.join(racine, version);
const fichiers = [];
function ecrire(nom, valeur) {
  const cible = path.join(destination, nom);
  fs.mkdirSync(path.dirname(cible), { recursive: true });
  fs.writeFileSync(cible, JSON.stringify(valeur));
  fichiers.push(nom);
}
function resume(e, type, fichier) {
  return Object.fromEntries(Object.entries({
    id: e.id, type, titre: e.titre, terme: e.terme, resume: e.resume || e.objectif,
    domaine: e.domaine, famille: e.famille, categorie: e.categorie,
    niveau: e.niveau, niveauPedagogique: e.niveauPedagogique,
    aliases: e.aliases || e.tags || [], maturiteEditoriale: e.maturiteEditoriale,
    tempsEstime: e.tempsEstime, format: e.format, duree: e.duree, fichier
  }).filter(([, v]) => v !== undefined));
}
function extraireCode(e) {
  if (e.maturiteEditoriale === 'draft') return '';
  const code = [...(e.sections || []), ...(e.exemples || []), ...(e.etapes || [])]
    .filter(s => s.type === 'code' || s.code || s.langage).map(s => s.code || s.contenu || '').join(' ');
  return [...new Set(code.match(/[A-Za-z_$][A-Za-z0-9_$.-]*/g) || [])].slice(0, 45).join(' ');
}
const index = [];
const fiches = catalogue.fiches.map(e => {
  const fichier = `fiches/${e.id}.json`;
  ecrire(fichier, e);
  const r = resume(e, 'fiche', fichier);
  index.push({ ...r, contexte: (e.tags || []).join(' '), code: extraireCode(e) });
  return { ...r, prerequis: e.prerequis, parcours: e.parcours };
});
for (const [collection, type] of [['ateliers', 'atelier'], ['erreurs', 'erreur'], ['projets', 'projet']]) {
  for (const e of catalogue[collection] || []) {
    const fichier = `${collection}/${e.id}.json`;
    ecrire(fichier, e);
    index.push({ ...resume(e, type, fichier), contexte: (e.tags || e.outils || []).join(' '), code: extraireCode(e) });
  }
}
const groupes = new Map();
for (const e of catalogue.bibliotheque) {
  const famille = e.famille.replace(/[^a-z0-9-]/gi, '-');
  if (!groupes.has(famille)) groupes.set(famille, []);
  groupes.get(famille).push(e);
  index.push({ ...resume(e, 'reference', `references/${famille}.json`), code: extraireCode(e) });
}
for (const [famille, references] of groupes) ecrire(`references/${famille}.json`, references);
ecrire('index-recherche.json', index);
ecrire('environnements.json', catalogue.environnements);
const meta = { meta: { ...catalogue.meta, empreinte: version }, base: `/catalogue/${version}`, domaines: catalogue.domaines,
  statistiques: catalogue.statistiques, parcours: catalogue.parcours, niveaux: catalogue.niveaux, fiches };
ecrire('meta.json', meta);
ecrire('hors-ligne.json', fichiers.slice());
fs.writeFileSync(path.join(racine, 'meta.json'), JSON.stringify(meta));
fs.writeFileSync(path.join(publicPath, 'documentation.json'), serialise);
console.log(`Catalogue ${version} : accueil ${Buffer.byteLength(JSON.stringify(meta))} octets, index ${Buffer.byteLength(JSON.stringify(index))} octets, ${fichiers.length} fragments.`);
