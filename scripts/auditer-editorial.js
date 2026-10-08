'use strict';
const fs = require('node:fs');
const catalogue = require('../src/data');
const elements = [...catalogue.fiches, ...catalogue.bibliotheque, ...catalogue.ateliers, ...catalogue.erreurs, ...catalogue.projets];
const normaliser = texte => String(texte || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const rapports = new Map(elements.map(e => [`${e.type}/${e.id}`, { id: e.id, type: e.type, maturite: e.maturiteEditoriale, alertes: [] }]));
const ajouter = (e, code, detail) => rapports.get(`${e.type}/${e.id}`).alertes.push({ code, detail });
const familles = { texte: new Map(), analogie: new Map(), exercice: new Map() };
const jargon = ['runtime', 'callback', 'middleware', 'payload', 'closure', 'hoisting', 'memoization'];
for (const e of elements) {
  const sections = e.sections || [];
  const textes = [...sections.filter(s => s.type === 'texte').map(s => s.contenu), ...(e.article || []), e.definition].filter(Boolean);
  const contenu = textes.join(' ');
  if (!e.sources?.length) ajouter(e, 'source-absente', 'Aucune source explicite ; une association n’est pas une source.');
  if (e.maturiteEditoriale === 'draft') ajouter(e, 'notice-a-rediger', 'Couverture conservée, explication non publiée.');
  else if (normaliser(contenu).split(' ').length < 70) ajouter(e, 'explication-courte', 'Relire la couverture du besoin ; la longueur seule ne suffit pas.');
  if (e.niveauPedagogique >= 4 && !e.prerequis.length) ajouter(e, 'avance-sans-prerequis', 'Confirmer les prérequis avant de proposer ce contenu avancé.');
  const nomsConnus = new Set((e.termesNouveaux || []).map(t => normaliser(t.terme)));
  for (const mot of jargon) if (new RegExp('\\b' + mot + '\\b', 'i').test(contenu) && !nomsConnus.has(mot)) ajouter(e, 'jargon-a-relire', mot + ' : vérifier la définition en contexte ou dans les prérequis.');
  const terme = normaliser(e.terme || e.titre);
  if (normaliser(e.definition) === terme || (terme && normaliser(e.definition) === terme + ' est un ' + terme)) ajouter(e, 'definition-circulaire', 'La définition répète le terme.');
  const exercice = sections.find(s => s.type === 'exercice')?.contenu || e.exercice?.objectif;
  const correction = sections.find(s => s.type === 'solution')?.contenu;
  if (exercice && correction && normaliser(exercice) === normaliser(correction)) ajouter(e, 'correction-identique', 'La correction répète la consigne.');
  const enregistrer = (famille, texte) => {
    if (!texte) return;
    const signature = normaliser(texte).replaceAll(terme, '<notion>');
    if (signature.length < 80) return;
    if (!familles[famille].has(signature)) familles[famille].set(signature, []);
    familles[famille].get(signature).push(e);
  };
  textes.forEach(t => enregistrer('texte', t));
  enregistrer('analogie', sections.find(s => /modèle mental|représenter/i.test(s.titre))?.contenu);
  enregistrer('exercice', exercice);
  if (['reviewed', 'verified'].includes(e.maturiteEditoriale)) {
    if (!e.revue?.auteur || !e.revue?.date) ajouter(e, 'revue-non-attestee', 'Une revue explicite est obligatoire.');
    if (!e.sources?.length || !e.prerequis || !textes.length) ajouter(e, 'complet-sans-profondeur', 'Le statut ne correspond pas aux preuves disponibles.');
  }
}
for (const [famille, groupes] of Object.entries(familles)) for (const groupe of groupes.values()) {
  if (new Set(groupe.map(e => `${e.type}/${e.id}`)).size >= 3) for (const e of groupe) ajouter(e, `${famille}-repete`, `Texte partagé par ${groupe.length} contenus : revue nécessaire.`);
}
const details = [...rapports.values()].filter(r => r.alertes.length);
const comptages = {};
for (const r of details) for (const a of r.alertes) comptages[a.code] = (comptages[a.code] || 0) + 1;
const rapport = { version: catalogue.meta.version, avertissement: 'Signaux de revue, pas mesure automatique de qualité ni validation humaine.', comptages, details };
fs.writeFileSync('docs/qualite-editoriale.json', JSON.stringify(rapport, null, 2) + '\n');
console.log(JSON.stringify({ contenus: elements.length, alertes: comptages, rapport: 'docs/qualite-editoriale.json' }, null, 2));
if (details.some(r => ['verified', 'reviewed'].includes(r.maturite))) process.exitCode = 1;
