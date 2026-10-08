'use strict';
const fs = require('node:fs');
const path = require('node:path');
const catalogue = require('../src/data');

const domaines = catalogue.domaines.map(domaine => {
  const lecons = catalogue.fiches.filter(f => f.domaine === domaine.id);
  const ateliers = catalogue.ateliers.filter(a => a.domaine === domaine.id);
  const references = catalogue.bibliotheque.filter(r => r.famille === domaine.id);
  return {
    domaine: domaine.id,
    lecons: lecons.length,
    exemplesCode: lecons.reduce((n, f) => n + f.sections.filter(s => s.type === 'code').length, 0),
    leconsAvecUnSeulExemple: lecons.filter(f => f.sections.filter(s => s.type === 'code').length < 2).map(f => f.id),
    ateliers: ateliers.length,
    references: references.length,
    referencesRedigees: references.filter(r => r.maturiteEditoriale === 'enriched').length,
    referencesBrouillon: references.filter(r => r.maturiteEditoriale === 'draft').length
  };
});

const problemes = [];
let fichiersACopier = 0, fichiersGeneres = 0;
for (const atelier of catalogue.ateliers) {
  if (atelier.fichiersDepart.length !== atelier.structure.length) problemes.push(`${atelier.id} : structure différente des amorces`);
  for (let index = 0; index < atelier.structure.length; index += 1) {
    const attendu = atelier.structure[index];
    const fichier = atelier.fichiersDepart[index];
    if (!fichier || fichier.chemin !== attendu) problemes.push(`${atelier.id} : chemin absent ${attendu}`);
    if (fichier?.mode === 'a-ecrire') {
      fichiersACopier += 1;
      if (!fichier.contenu.trim()) problemes.push(`${atelier.id} : contenu vide ${attendu}`);
    } else if (fichier?.mode === 'genere') {
      fichiersGeneres += 1;
      if (!/springboot|csharp|composer|atelier-shell-organiser/.test(atelier.id)) problemes.push(`${atelier.id} : génération non documentée ${attendu}`);
    } else problemes.push(`${atelier.id} : mode inconnu ${attendu}`);
  }
}
for (const domaine of domaines) {
  if (domaine.lecons === 0 || domaine.referencesRedigees === 0) problemes.push(`${domaine.domaine} : leçon ou référence rédigée absente`);
}
const bilan = {
  date: new Date().toISOString().slice(0, 10),
  totaux: { domaines: domaines.length, lecons: catalogue.fiches.length, ateliers: catalogue.ateliers.length,
    references: catalogue.bibliotheque.length, exemplesCode: catalogue.statistiques.nombreExemples,
    fichiersACopier, fichiersGeneres,
    leconsAvecMoinsDeDeuxExemples: domaines.reduce((n, d) => n + d.leconsAvecUnSeulExemple.length, 0),
    referencesBrouillon: catalogue.bibliotheque.filter(r => r.maturiteEditoriale === 'draft').length },
  domaines, problemes
};
const destination = path.join(__dirname, '..', 'docs', 'audit-parcours.json');
fs.writeFileSync(destination, JSON.stringify(bilan, null, 2) + '\n');
console.log(`Audit de ${bilan.totaux.lecons} leçons, ${bilan.totaux.ateliers} ateliers et ${bilan.totaux.references} références : ${problemes.length} rupture(s) structurelle(s).`);
if (problemes.length) { console.error(problemes.slice(0, 20).join('\n')); process.exitCode = 1; }
