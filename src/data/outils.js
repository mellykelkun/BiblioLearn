'use strict';

const guides = require('./pedagogie');

function creerSessions(sections, indices, guide) {
  return [
    { id: 'comprendre', titre: 'Comprendre le problème', duree: '10 min', objectif: guide.modele, activite: 'Lisez le modèle mental puis reformulez-le avec vos mots.', sections: [indices.modele] },
    { id: 'observer', titre: 'Observer et essayer le code', duree: '15 min', objectif: 'Relier la cause au résultat.', activite: 'Lisez les explications, testez le code et changez une seule entrée.', sections: [indices.code] },
    { id: 'decider', titre: 'Décider en situation', duree: '10 min', objectif: guide.scenario, activite: 'Comparez le cas concret à votre propre projet : que garderiez-vous ?', sections: [indices.scenario] },
    { id: 'pratiquer', titre: 'Faire le défi', duree: '20 min', objectif: guide.exercice, activite: 'Réalisez la consigne avant d’ouvrir le corrigé.', sections: [indices.exercice] },
    { id: 'verifier', titre: 'Vérifier et retenir', duree: '10 min', objectif: guide.correction, activite: 'Ouvrez le corrigé et comparez votre raisonnement au résultat attendu.', sections: [indices.solution] }
  ];
}

function fiche({ id, domaine, categorie, titre, resume, tags = [], niveau = 'Fondamental', sections, sessions, associes = [], guide: guideSpecifique }) {
  const guide = guideSpecifique || guides[id];
  if (!guide) throw new Error(`Guide pédagogique manquant : ${id}`);
  const contenu = sections.filter((section) => section.type !== 'liens');
  const liensOfficiels = sections.filter((section) => section.type === 'liens');
  const indices = {
    modele: 0,
    scenario: contenu.length + 1,
    exercice: contenu.length + 2,
    solution: contenu.length + 3,
    code: contenu.findIndex((section) => section.type === 'code') + 1
  };
  if (indices.code === 0) indices.code = 1;
  const sectionsEnrichies = [
    texte('Le modèle mental', guide.modele),
    ...contenu,
    texte('Dans un projet réel', guide.scenario),
    { type: 'exercice', titre: 'À vous de jouer', contenu: guide.exercice, indice: guide.indice },
    { type: 'solution', titre: 'Corrigé raisonné', contenu: guide.correction },
    ...liensOfficiels
  ];
  return { id, domaine, categorie, titre, resume, tags, niveau, sections: sectionsEnrichies, sessions: sessions || creerSessions(sectionsEnrichies, indices, guide), associes };
}

function texte(titre, contenu) { return { type: 'texte', titre, contenu }; }
function code(titre, langage, contenu, legende = '') { return { type: 'code', titre, langage, contenu, legende }; }
function liste(titre, contenu) { return { type: 'liste', titre, contenu }; }
function decomposition(titre, elements) { return { type: 'decomposition', titre, elements }; }
function alerte(variante, titre, contenu) { return { type: 'alerte', variante, titre, contenu }; }
function comparaison(titre, colonnes, lignes) { return { type: 'comparaison', titre, colonnes, lignes }; }
function liens(...elements) { return { type: 'liens', titre: 'Documentation officielle', elements }; }

module.exports = { fiche, texte, code, liste, decomposition, alerte, comparaison, liens };
