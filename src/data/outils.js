'use strict';

const profilsDomaine = require('./profils');

function creerSessions(sections, titre, domaine) {
  const indicesCode = sections.map((section, index) => section.type === 'code' ? index : -1).filter((index) => index >= 0);
  const dernierIndex = Math.max(0, sections.length - 1);
  const premierCode = indicesCode.length ? indicesCode[0] : Math.min(1, dernierIndex);
  const profil = profilsDomaine[domaine] || profilsDomaine.javascript;
  return [
    { id: 'comprendre', titre: 'Comprendre l’idée', duree: '10 min', objectif: `Identifier l’idée centrale de « ${titre} » et la reformuler avec vos mots.`, concepts: profil.concepts.slice(0, 2), activite: 'Lire la définition, puis expliquer le problème que cette notion résout.', scenario: profil.scenarios[0][0], sections: [0] },
    { id: 'vocabulaire', titre: 'Installer le vocabulaire', duree: '15 min', objectif: 'Relier les mots importants à une observation concrète dans le code ou l’interface.', concepts: profil.concepts, activite: 'Surligner les concepts et écrire un exemple très simple pour chacun.', scenario: profil.scenarios[1][0], sections: [Math.min(1, dernierIndex)] },
    { id: 'construire', titre: 'Construire pas à pas', duree: '25 min', objectif: 'Modifier un exemple, provoquer un résultat visible et vérifier chaque hypothèse.', concepts: ['entrée', 'transformation', 'résultat'], activite: 'Copier le mini-exemple, changer une seule chose à la fois et noter ce qui change.', scenario: 'Cas nominal', sections: [premierCode] },
    { id: 'decider', titre: 'Choisir selon le scénario', duree: '20 min', objectif: 'Comparer plusieurs solutions et justifier celle qui convient à votre infrastructure.', concepts: ['coût', 'complexité', 'évolutivité'], activite: 'Lire la grille de scénarios et écrire la décision que vous prendriez pour votre projet.', scenario: profil.scenarios[2][0], sections: [Math.max(0, sections.length - 3)] },
    { id: 'verifier', titre: 'Vérifier et transférer', duree: '15 min', objectif: 'Relire les pièges, tester un cas limite et formuler une règle réutilisable.', concepts: ['cas limite', 'diagnostic', 'transfert'], activite: 'Répondre à la question de contrôle puis appliquer la notion à un autre petit exemple.', scenario: 'Entrée vide, lente ou invalide', sections: [dernierIndex] }
  ];
}

const reperesDomaine = {
  html: 'Revenez au sens du document : une structure lisible par une personne et une technologie d’assistance est plus solide qu’un empilement de div.',
  css: 'Testez le composant dans une largeur étroite, une largeur large et avec le clavier : la mise en forme doit rester une conséquence de la structure.',
  javascript: 'Séparez la donnée, la transformation et l’effet visible. Cette séparation rend les erreurs plus faciles à localiser et les fonctions plus faciles à tester.',
  dom: 'Décrivez d’abord l’état attendu de l’interface, puis rendez le DOM cohérent avec cet état après chaque interaction.',
  node: 'Vérifiez toujours le chemin courant, les erreurs système et la fin réelle de l’opération avant de considérer un script terminé.',
  npm: 'Une commande reproductible et un lockfile relu valent mieux qu’une installation globale impossible à expliquer quelques semaines plus tard.',
  http: 'Observez méthode, statut, en-têtes et corps séparément : chacun porte une information différente dans le contrat réseau.',
  express: 'Gardez les routes minces : parsez, validez, appelez le métier puis traduisez clairement le résultat en réponse HTTP.',
  shell: 'Travaillez dans un dossier explicite, affichez les chemins avant les actions et préférez les commandes composables aux commandes opaques.',
  typescript: 'Utilisez les types pour rendre les états impossibles à confondre, mais validez tout ce qui franchit la frontière de votre programme.',
  react: 'Un rendu doit rester prévisible : l’état décrit l’interface actuelle et les effets servent uniquement à synchroniser un système extérieur.',
  nextjs: 'Décidez où une donnée doit être lue et où elle doit être rendue avant d’ajouter un composant client ou une requête supplémentaire.',
  vue: 'Gardez la réactivité proche de la logique qui la modifie et retournez une API de composable assez petite pour rester testable.',
  angular: 'Séparez présentation, navigation et accès aux données ; un composant clair devient plus facile à tester et à faire évoluer.',
  'css-outils': 'Les classes utilitaires accélèrent l’itération, mais les tokens, les états de focus et la structure sémantique restent des décisions de conception.'
};

function fiche({ id, domaine, categorie, titre, resume, tags = [], niveau = 'Fondamental', sections, sessions, associes = [] }) {
  const profil = profilsDomaine[domaine] || profilsDomaine.javascript;
  const sectionsEnrichies = [
    ...sections,
    texte('Explication approfondie', profil.explication),
    liste('Concepts à retenir', profil.concepts.map((concept) => `${concept} : cherchez où ce concept apparaît dans cette fiche avant de continuer.`)),
    comparaison('Scénarios et décisions', ['Scénario', 'Décision conseillée', 'Pourquoi'], profil.scenarios),
    code('Mini-exercice guidé', profil.langage, profil.code, profil.legende),
    texte('Exercice de transfert (20 min)', `Reprenez l’idée de « ${titre} » dans un petit dossier isolé. Testez un cas normal, une entrée vide ou invalide et une entrée plus grande que prévu. Notez l’observation, la décision prise et ce que vous changeriez si le projet passait en production.`),
    texte('Mise en situation', reperesDomaine[domaine] || 'Reliez cette notion à un petit cas d’usage concret avant de passer à la suivante.'),
    alerte('retenir', 'Question de contrôle', `Pouvez-vous expliquer ce qui change si l’entrée est vide, invalide ou beaucoup plus grande dans « ${titre} » ?`)
  ];
  return { id, domaine, categorie, titre, resume, tags, niveau, sections: sectionsEnrichies, sessions: sessions || creerSessions(sectionsEnrichies, titre, domaine), associes };
}

function texte(titre, contenu) { return { type: 'texte', titre, contenu }; }
function code(titre, langage, contenu, legende = '') { return { type: 'code', titre, langage, contenu, legende }; }
function liste(titre, contenu) { return { type: 'liste', titre, contenu }; }
function decomposition(titre, elements) { return { type: 'decomposition', titre, elements }; }
function alerte(variante, titre, contenu) { return { type: 'alerte', variante, titre, contenu }; }
function comparaison(titre, colonnes, lignes) { return { type: 'comparaison', titre, colonnes, lignes }; }
function liens(...elements) { return { type: 'liens', titre: 'Documentation officielle', elements }; }

module.exports = { fiche, texte, code, liste, decomposition, alerte, comparaison, liens };
