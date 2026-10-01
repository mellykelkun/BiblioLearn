'use strict';

const profilsDomaine = require('./profils');

function creerSessions(sections, titre, domaine) {
  const indicesCode = sections.map((section, index) => section.type === 'code' ? index : -1).filter((index) => index >= 0);
  const dernierIndex = Math.max(0, sections.length - 1);
  const premierCode = indicesCode.length ? indicesCode[0] : Math.min(1, dernierIndex);
  const profil = profilsDomaine[domaine] || profilsDomaine.javascript;
  const sectionIndex = (titreSection, remplacement = dernierIndex) => {
    const index = sections.findIndex((section) => section.titre === titreSection);
    return index >= 0 ? index : remplacement;
  };
  const indexScenarios = sectionIndex('Formats, transport et sécurité', sectionIndex('Scénarios et décisions'));
  const indexDonnee = sectionIndex('Mini-exercice : produire et transmettre', premierCode);
  return [
    { id: 'comprendre', titre: 'Comprendre l’idée', duree: '10 min', objectif: `Identifier l’idée centrale de « ${titre} » et la reformuler avec vos mots.`, concepts: profil.concepts.slice(0, 2), activite: 'Lire la définition, puis expliquer le problème que cette notion résout.', scenario: profil.scenarios[0][0], sections: [0] },
    { id: 'vocabulaire', titre: 'Installer le vocabulaire', duree: '15 min', objectif: 'Relier les mots importants à une observation concrète dans le code ou l’interface.', concepts: ['source', 'type', 'contrat'], activite: 'Identifier la source, le type attendu et la forme transmise.', scenario: profil.flux.scenarios[0][0], sections: [Math.min(1, dernierIndex)] },
    { id: 'construire', titre: 'Construire pas à pas', duree: '25 min', objectif: 'Demander, valider, transformer et transmettre une donnée sans perdre son sens.', concepts: ['demander', 'valider', 'transformer'], activite: 'Copier l’exemple, changer une entrée, observer la sortie et traiter l’erreur.', scenario: 'Cas nominal', sections: [indexDonnee] },
    { id: 'decider', titre: 'Choisir selon le scénario', duree: '20 min', objectif: 'Comparer type, transport, stockage et niveau de sécurité selon votre infrastructure.', concepts: ['type', 'transport', 'sécurité'], activite: 'Lire la grille et écrire qui produit, qui reçoit et qui a le droit de lire.', scenario: profil.flux.scenarios[1][0], sections: [indexScenarios] },
    { id: 'verifier', titre: 'Vérifier et transférer', duree: '15 min', objectif: 'Tester une donnée absente, invalide ou trop grande et formuler une règle réutilisable.', concepts: ['stockage', 'erreur', 'transfert'], activite: 'Répondre à la question de contrôle puis dessiner le trajet de la donnée dans un autre projet.', scenario: 'Entrée vide, lente ou invalide', sections: [dernierIndex] }
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
    code('Mini-exercice de logique', profil.langage, profil.code, profil.legende),
    texte('Savoir transmettre la donnée', profil.flux.transmettre),
    decomposition('Cycle de la donnée', profil.flux.cycle),
    comparaison('Formats, transport et sécurité', ['Scénario', 'Type de donnée', 'Transmission', 'Contrôle'], profil.flux.scenarios),
    code('Mini-exercice : produire et transmettre', profil.flux.langage, profil.flux.code, profil.flux.legende),
    liste('Questions avant de transmettre', [
      'Quelle donnée est réellement nécessaire, et quelle donnée peut être supprimée ?',
      'Qui produit la donnée, qui la reçoit et qui a le droit de la lire ou de la modifier ?',
      'Quel type, format, encodage et taille maximale le contrat impose-t-il ?',
      'À quelle frontière faut-il valider, convertir, journaliser ou refuser ?',
      'Comment signaler succès, absence, erreur, donnée périmée ou accès interdit ?'
    ]),
    texte('Exercice de transfert (25 min)', `Reprenez l’idée de « ${titre} » dans un petit dossier isolé. Dessinez le trajet de la donnée : source, type reçu, validation, transformation, transport, stockage éventuel, réponse et affichage. Testez un cas normal, une entrée vide ou invalide et une entrée plus grande que prévu. Notez l’observation, la décision prise et ce que vous changeriez si le projet passait en production.`),
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
