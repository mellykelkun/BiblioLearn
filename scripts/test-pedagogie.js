'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalogue = require('../src/data');
const defis = require('../src/data/ateliers-defis');
const guides = require('../src/data/pedagogie');

assert.equal(catalogue.fiches.length, 113);
assert.equal(catalogue.ateliers.length, 129);
assert.equal(Object.keys(guides).length, catalogue.fiches.length);
assert.equal(Object.values(defis).flat().length, 120);

for (const champ of ['modele', 'scenario', 'exercice', 'correction']) {
  const valeurs = catalogue.fiches.map((fiche) => guides[fiche.id]?.[champ]);
  assert.ok(valeurs.every((valeur) => typeof valeur === 'string' && valeur.length >= 80), `Champ pédagogique incomplet : ${champ}`);
  assert.equal(new Set(valeurs).size, valeurs.length, `Répétition pédagogique : ${champ}`);
}

for (const fiche of catalogue.fiches) {
  assert.equal(fiche.sections.filter((section) => section.type === 'exercice').length, 1, `Exercice absent : ${fiche.id}`);
  assert.equal(fiche.sections.filter((section) => section.type === 'solution').length, 1, `Corrigé absent : ${fiche.id}`);
  assert.equal(fiche.sessions.length, 5, `Parcours incomplet : ${fiche.id}`);
  const cibles = fiche.sessions.map((session) => session.sections[0]);
  assert.equal(new Set(cibles).size, 5, `Sessions identiques : ${fiche.id}`);
  assert.ok(cibles.every((index) => index >= 0 && index < fiche.sections.length), `Session hors fiche : ${fiche.id}`);
}

const ateliersGuides = catalogue.ateliers.filter((atelier) => atelier.id.startsWith('atelier-plus-'));
assert.equal(ateliersGuides.length, 120);
assert.equal(new Set(ateliersGuides.map((atelier) => atelier.etapes[1].code)).size, 120, 'Les codes des ateliers doivent être propres à chaque thème');
assert.equal(new Set(ateliersGuides.map((atelier) => atelier.validation[0])).size, 120, 'Les critères des ateliers doivent être propres à chaque thème');
for (const atelier of ateliersGuides) {
  assert.equal(atelier.etapes.length, 4);
  assert.ok(atelier.validation[0].length >= 25, `Validation trop vague : ${atelier.id}`);
  if (atelier.domaine === 'html' || atelier.domaine === 'css') {
    assert.ok(!atelier.etapes.some((etape) => etape.code.includes('node --check index.js')), `Contrôle JS dans un atelier ${atelier.domaine} : ${atelier.id}`);
  }
}

const statique = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'documentation.json'), 'utf8'));
assert.equal(statique.meta.version, catalogue.meta.version, 'Catalogue statique non reconstruit');
assert.deepEqual(statique.statistiques, catalogue.statistiques, 'Statistiques statiques divergentes');
assert.equal(statique.fiches[0].sections[0].titre, 'Le modèle mental', 'Ancienne version statique des fiches');
assert.equal(statique.ateliers[10].etapes[1].code, catalogue.ateliers[10].etapes[1].code, 'Ancienne version statique des ateliers');

const manifeste = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'manifest.webmanifest'), 'utf8'));
assert.equal(manifeste.display, 'standalone');
for (const icone of manifeste.icons) assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', icone.src.slice(1))), `Icône manquante : ${icone.src}`);
assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', 'sw.js')));

console.log('Pédagogie, ateliers spécifiques, catalogue statique et fichiers PWA vérifiés.');
