'use strict';

const documentation = require('../src/data');

const ids = new Set(documentation.fiches.map((fiche) => fiche.id));
const liensInvalides = [];

for (const fiche of documentation.fiches) {
  for (const section of fiche.sections) {
    if (section.type !== 'liens') continue;
    for (const lien of section.elements) {
      try {
        const url = new URL(lien.url);
        if (url.protocol !== 'https:') liensInvalides.push(`${fiche.id}: ${lien.url}`);
      } catch {
        liensInvalides.push(`${fiche.id}: ${lien.url}`);
      }
    }
  }
  for (const associe of fiche.associes) {
    if (!ids.has(associe)) throw new Error(`Lien associé absent : ${fiche.id} -> ${associe}`);
  }
}

if (liensInvalides.length) throw new Error(`Liens invalides :\n${liensInvalides.join('\n')}`);

console.log(`Catalogue valide : ${documentation.statistiques.nombreFiches} fiches, ${documentation.statistiques.nombreExemples} exemples de code.`);
console.log(`Ateliers valides : ${documentation.statistiques.nombreAteliers}.`);
