'use strict';

const fondamentaux = require('./fiches-fondamentaux');
const javascriptDom = require('./fiches-javascript-dom');
const backend = require('./fiches-backend');
const frontend = require('./fiches-frontend');
const shell = require('./fiches-shell');
const ateliers = require('./ateliers');

const domaines = [
  { id: 'html', nom: 'HTML', groupe: 'Fondations', icone: '<>', description: 'Structure, sémantique et accessibilité' },
  { id: 'css', nom: 'CSS', groupe: 'Fondations', icone: '#', description: 'Mise en page, cascade et responsive' },
  { id: 'javascript', nom: 'JavaScript', groupe: 'Langage', icone: 'JS', description: 'Syntaxe, données et asynchrone' },
  { id: 'dom', nom: 'DOM & Événements', groupe: 'Langage', icone: '◆', description: 'Manipuler la page et ses événements' },
  { id: 'node', nom: 'Node.js', groupe: 'Côté serveur', icone: 'N', description: 'Runtime, fichiers et processus' },
  { id: 'npm', nom: 'npm', groupe: 'Côté serveur', icone: 'npm', description: 'Packages, scripts et versions' },
  { id: 'http', nom: 'HTTP & API REST', groupe: 'Côté serveur', icone: '↔', description: 'Requêtes, réponses et conventions' },
  { id: 'express', nom: 'Express.js', groupe: 'Côté serveur', icone: 'Ex', description: 'Routes, middleware et erreurs' },
  { id: 'shell', nom: 'Terminal & Git', groupe: 'Outils de travail', icone: '$>', description: 'Commandes, fichiers, environnement et versionnement' },
  { id: 'typescript', nom: 'TypeScript', groupe: 'Écosystème frontend', icone: 'TS', description: 'Types statiques pour JavaScript' },
  { id: 'react', nom: 'React', groupe: 'Écosystème frontend', icone: 'Re', description: 'Composants, état et effets' },
  { id: 'nextjs', nom: 'Next.js', groupe: 'Écosystème frontend', icone: 'Nx', description: 'Framework React full-stack' },
  { id: 'vue', nom: 'Vue', groupe: 'Écosystème frontend', icone: 'Vu', description: 'Framework progressif à composants' },
  { id: 'angular', nom: 'Angular', groupe: 'Écosystème frontend', icone: 'Ng', description: 'Framework applicatif structuré' },
  { id: 'css-outils', nom: 'Tailwind & Bootstrap', groupe: 'Écosystème frontend', icone: 'UI', description: 'Outils CSS et conséquences pratiques' }
];

const fiches = [...fondamentaux, ...javascriptDom, ...backend, ...frontend, ...shell];

function validerCatalogue() {
  const ids = new Set();
  const domainesConnus = new Set(domaines.map((domaine) => domaine.id));

  for (const element of fiches) {
    if (!element.id || !element.titre || !element.resume || !element.sections?.length) {
      throw new Error(`Fiche incomplète : ${element.id || element.titre || 'sans identifiant'}`);
    }
    if (ids.has(element.id)) throw new Error(`Identifiant de fiche dupliqué : ${element.id}`);
    if (!domainesConnus.has(element.domaine)) throw new Error(`Domaine inconnu pour ${element.id} : ${element.domaine}`);
    ids.add(element.id);
  }

  const fichesConnues = new Set(fiches.map((fiche) => fiche.id));
  for (const element of ateliers) {
    if (!element.id || !element.titre || !element.objectif || !element.etapes?.length) {
      throw new Error(`Atelier incomplet : ${element.id || element.titre || 'sans identifiant'}`);
    }
    if (!domainesConnus.has(element.domaine)) throw new Error(`Domaine inconnu pour l’atelier ${element.id} : ${element.domaine}`);
    for (const idAssocie of element.associes) {
      if (!fichesConnues.has(idAssocie)) throw new Error(`Association inconnue dans l’atelier ${element.id} : ${idAssocie}`);
    }
  }

  for (const element of fiches) {
    for (const idAssocie of element.associes) {
      if (!ids.has(idAssocie)) throw new Error(`Association inconnue dans ${element.id} : ${idAssocie}`);
    }
  }
}

validerCatalogue();

const statistiques = {
  nombreFiches: fiches.length,
  nombreDomaines: domaines.length,
  nombreAteliers: ateliers.length,
  nombreExemples: fiches.reduce((total, element) => total + element.sections.filter((section) => section.type === 'code').length, 0)
};

module.exports = {
  meta: { version: 1, miseAJour: '2026-09-30' },
  domaines,
  fiches,
  ateliers,
  statistiques
};
