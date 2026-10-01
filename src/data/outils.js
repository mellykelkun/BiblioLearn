'use strict';

function creerSessions(sections, titre) {
  const indicesCode = sections.map((section, index) => section.type === 'code' ? index : -1).filter((index) => index >= 0);
  const dernierIndex = Math.max(0, sections.length - 1);
  const pratique = indicesCode.length ? [indicesCode[0]] : [Math.min(1, dernierIndex)];
  return [
    { id: 'comprendre', titre: 'Comprendre', duree: '10 min', objectif: `Identifier l’idée centrale de « ${titre} ».`, sections: [0] },
    { id: 'pratiquer', titre: 'Mettre en pratique', duree: '15 min', objectif: 'Lire un exemple, le modifier et observer son résultat.', sections: pratique },
    { id: 'verifier', titre: 'Vérifier', duree: '10 min', objectif: 'Relire les pièges et formuler une règle que vous pourrez réutiliser.', sections: [dernierIndex] }
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
  const sectionsEnrichies = [
    ...sections,
    texte('Mise en situation', reperesDomaine[domaine] || 'Reliez cette notion à un petit cas d’usage concret avant de passer à la suivante.'),
    alerte('retenir', 'Question de contrôle', `Pouvez-vous expliquer ce qui change si l’entrée est vide, invalide ou beaucoup plus grande dans « ${titre} » ?`)
  ];
  return { id, domaine, categorie, titre, resume, tags, niveau, sections: sectionsEnrichies, sessions: sessions || creerSessions(sectionsEnrichies, titre), associes };
}

function texte(titre, contenu) { return { type: 'texte', titre, contenu }; }
function code(titre, langage, contenu, legende = '') { return { type: 'code', titre, langage, contenu, legende }; }
function liste(titre, contenu) { return { type: 'liste', titre, contenu }; }
function decomposition(titre, elements) { return { type: 'decomposition', titre, elements }; }
function alerte(variante, titre, contenu) { return { type: 'alerte', variante, titre, contenu }; }
function comparaison(titre, colonnes, lignes) { return { type: 'comparaison', titre, colonnes, lignes }; }
function liens(...elements) { return { type: 'liens', titre: 'Documentation officielle', elements }; }

module.exports = { fiche, texte, code, liste, decomposition, alerte, comparaison, liens };
