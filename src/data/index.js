'use strict';

const fondamentaux = require('./fiches-fondamentaux');
const javascriptDom = require('./fiches-javascript-dom');
const backend = require('./fiches-backend');
const frontend = require('./fiches-frontend');
const shell = require('./fiches-shell');
const approfondissement = require('./fiches-approfondissement');
const complementaires = require('./fiches-complementaires');
const ecosystemes = require('./fiches-ecosystemes');
const ateliers = require('./ateliers');
const ateliersPlus = require('./ateliers-plus');
const bibliothequeBase = require('./bibliotheque');
const bibliothequePlus = require('./bibliotheque-plus');
const nouveauxParcours = require('./construire-nouveaux-parcours');
const fichesEnvironnement = require('./fiches-environnement');
const bibliothequeNouveaux = require('./bibliotheque-nouveaux');
const environnements = require('./environnements');
const { normaliserConnaissance, migrerReference, construireGraphe, parcours, niveaux } = require('../pedagogie/modele');

const niveauZero = require('../pedagogie/niveau-zero');
const asynchronisme = require('../pedagogie/asynchronisme');
const { creerAmorces } = require('../pedagogie/amorces-ateliers');
const zeroPratique = require('../pedagogie/zero-pratique');
const complementsModules = require('../pedagogie/complements-modules');
const profondeurLangages = require('../pedagogie/profondeur-langages');
const profondeurInterfaces = require('../pedagogie/profondeur-interfaces');
const sqlPratique = require('../pedagogie/sql-pratique');
const sqlAteliers = require('../pedagogie/sql-ateliers');
const domaines = [
  { id: 'niveau-zero', nom: 'Niveau zéro', groupe: 'Premiers repères', icone: '0', description: 'Fichiers, programmes, Web et premiers diagnostics' },
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
  { id: 'css-outils', nom: 'Tailwind & Bootstrap', groupe: 'Écosystème frontend', icone: 'UI', description: 'Outils CSS et conséquences pratiques' },
  { id: 'python', nom: 'Python', groupe: 'Autres langages', icone: 'Py', description: 'Scripts, données, fichiers et tests' },
  { id: 'java', nom: 'Java', groupe: 'Autres langages', icone: 'Jv', description: 'JDK, types, objets et collections' },
  { id: 'springboot', nom: 'Spring Boot', groupe: 'Autres langages', icone: 'Sp', description: 'API Java, validation et services' },
  { id: 'cpp', nom: 'C++', groupe: 'Autres langages', icone: 'C+', description: 'Compilation, types et mémoire' },
  { id: 'csharp', nom: 'C# & .NET', groupe: 'Autres langages', icone: 'C#', description: 'SDK, objets, async et JSON' },
  { id: 'php', nom: 'PHP', groupe: 'Autres langages', icone: 'PHP', description: 'Scripts serveur, formulaires et données' },
  { id: 'sql', nom: 'SQL & SQLite', groupe: 'Données', icone: 'DB', description: 'Schémas, requêtes, relations et transactions' }
];

const fichesInitiales = [...fondamentaux, ...javascriptDom, ...backend, ...frontend, ...shell, ...approfondissement, ...complementaires, ...ecosystemes, ...fichesEnvironnement, ...nouveauxParcours.fiches, ...niveauZero.map(zeroPratique.enrichirZero), ...zeroPratique.nouvelles, ...complementsModules, ...profondeurLangages.lecons, ...profondeurInterfaces.lecons, ...sqlPratique.lecons, ...asynchronisme.nouvelles].map(f => normaliserConnaissance(asynchronisme.remplacements[f.id] || f, 'fiche'));
const tousLesAteliers = [...ateliers, ...ateliersPlus, ...nouveauxParcours.ateliers, ...sqlAteliers.ateliers].map(a => creerAmorces(normaliserConnaissance(a, 'atelier')));
const fiches = require('../pedagogie/variantes-lecons').enrichir(fichesInitiales, tousLesAteliers);
const referencesRedigees = require('../pedagogie/references-redigees');
const referencesPratiques = require('../pedagogie/references-pratiques');
const referencesHtml = require('../pedagogie/references-html-redigees');
const referencesCss = require('../pedagogie/references-css-redigees');
const referencesHttp = require('../pedagogie/references-http-redigees');
const referencesSql = require('../pedagogie/references-sql-redigees');
const bibliotheque = [...bibliothequeBase.map(e => migrerReference({ ...e, ...referencesRedigees[e.id] }, false)), ...bibliothequePlus.map(e => {
  const redaction = referencesHtml.rediger(e) || referencesCss.rediger(e) || referencesHttp.rediger(e) || referencesSql.rediger(e);
  return migrerReference(redaction || e, !redaction);
}), ...bibliothequeNouveaux.map(e => migrerReference(e, false)), ...referencesPratiques.map(e => normaliserConnaissance(e, 'reference')), ...[...profondeurLangages.references, ...profondeurInterfaces.references, ...sqlPratique.references].map(e => normaliserConnaissance(e, 'reference'))];
const erreurs = require('../pedagogie/erreurs').map(e => normaliserConnaissance(e, 'erreur'));
const projets = require('../pedagogie/projets').map(e => normaliserConnaissance(e, 'projet'));
construireGraphe([...fiches, ...tousLesAteliers, ...bibliotheque, ...erreurs, ...projets]);

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

  const bibliothequeIds = new Set();
  for (const entree of bibliotheque) {
    if (!entree.id || !entree.terme || (entree.maturiteEditoriale !== 'draft' && (!entree.definition || !entree.exemples?.length || !entree.exercice?.etapes?.length))) {
      throw new Error(`Entrée de bibliothèque incomplète : ${entree.id || entree.terme || 'sans identifiant'}`);
    }
    if (bibliothequeIds.has(entree.id)) throw new Error(`Identifiant de bibliothèque dupliqué : ${entree.id}`);
    bibliothequeIds.add(entree.id);
    for (const lien of entree.associes) {
      if (!bibliothequeIds.has(lien) && !bibliotheque.some((element) => element.id === lien)) {
        throw new Error(`Association inconnue dans la bibliothèque ${entree.id} : ${lien}`);
      }
    }
  }

  const fichesConnues = new Set(fiches.map((fiche) => fiche.id));
  for (const element of tousLesAteliers) {
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
  nombreAteliers: tousLesAteliers.length,
  nombreExemples: fiches.reduce((total, element) => total + element.sections.filter((section) => section.type === 'code').length, 0),
  nombreBibliotheque: bibliotheque.length
};

module.exports = {
  meta: { version: 5, miseAJour: '2026-10-08' },
  domaines,
  parcours,
  niveaux,
  fiches,
  ateliers: tousLesAteliers,
  bibliotheque,
  environnements,
  erreurs,
  projets,
  statistiques
};
