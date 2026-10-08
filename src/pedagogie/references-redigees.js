'use strict';
module.exports = {
  'promises-js': {
    definition: 'Une opération peut être encore en cours quand votre programme continue. Une Promise est un objet qui permet de traiter son issue : une valeur obtenue ou un échec.',
    resume: 'Utiliser le résultat d’une opération et traiter son échec sans le confondre avec la promesse elle-même.',
    prerequis: ['js-fonctions', 'js-callbacks', 'js-synchronisme', 'js-erreurs'],
    signature: 'promesse.then(onFulfilled, onRejected) → nouvelle Promise',
    parametres: 'onFulfilled reçoit la valeur de réussite ; onRejected reçoit la raison de l’échec. Ces fonctions sont facultatives. catch(onRejected) rend souvent le chemin d’erreur plus lisible.',
    retour: 'Une nouvelle promesse adoptant l’issue du traitement. Une valeur retournée devient sa réussite ; une exception devient son rejet ; une promesse retournée est suivie jusqu’à son issue.',
    article: ['Pending désigne l’attente, fulfilled une réussite et rejected un échec. Les fonctions enregistrées par then sont exécutées après le travail synchrone courant, même si la promesse est déjà terminée.', 'Une fonction async retourne une promesse. await attend son issue dans un contexte autorisé et permet de traiter un rejet avec try/catch. Cette attente suspend la fonction concernée, pas toute la page.'],
    exemples: [{ titre: 'Prédire une chaîne', langage: 'JavaScript', contenu: 'Promise.resolve(3)\n  .then(nombre => nombre * 2)\n  .then(resultat => console.log(resultat))\n  .catch(erreur => console.error(erreur.message));', explication: 'La première fonction reçoit 3 et renvoie 6. La suivante reçoit 6. Le gestionnaire final traite un rejet de la chaîne.' }],
    pourquoiUtiliser: ['Composer des opérations dont l’issue arrive plus tard.', 'Rendre le chemin de réussite et le chemin d’échec explicites.'],
    nePasUtiliser: ['Ne pas envelopper un calcul immédiat dans une promesse sans besoin d’interface asynchrone.', 'Ne pas utiliser un délai arbitraire pour deviner quand une opération sera terminée.'],
    avertissements: ['Retournez ou attendez l’opération lancée dans un gestionnaire, sinon la suite ne l’attend pas.', 'Une promesse ne fournit pas à elle seule de mécanisme d’annulation.', 'La réussite de fetch ne garantit pas un statut HTTP 2xx : inspectez la réponse.'],
    liens: [{ label: 'MDN : Promise', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' }],
    termesNouveaux: [{ terme: 'Promise', definition: 'Objet permettant de suivre une opération en attente, réussie ou échouée.' }],
    maturiteEditoriale: 'enriched', provenance: 'redaction-specifique'
  },
  'map-filter-reduce': {
    definition: 'Pour transformer chaque élément, utilisez map. Pour garder seulement certains éléments, utilisez filter. Pour construire une valeur d’ensemble, utilisez reduce.',
    resume: 'Choisir une transformation selon la forme de sortie attendue.',
    prerequis: ['js-tableaux', 'js-fonctions', 'js-callbacks'],
    signature: 'tableau.map(callback)\ntableau.filter(predicate)\ntableau.reduce(reducteur, valeurInitiale)',
    parametres: 'map et filter appellent leur fonction avec la valeur, l’index et le tableau. reduce fournit l’accumulateur, la valeur courante, l’index et le tableau. Le prédicat de filter est une fonction dont le résultat décide de conserver l’élément.',
    retour: 'map renvoie un nouveau tableau de même longueur ; filter un nouveau tableau contenant les éléments retenus ; reduce la valeur accumulée, dont le type dépend de votre choix.',
    article: ['Un tableau est une collection ordonnée. Pour map, dessinez une sortie par entrée. Pour filter, posez une question dont la réponse détermine si l’entrée est gardée. Pour reduce, nommez d’abord le résultat accumulé et son état initial.', 'Ces méthodes ne modifient pas directement le tableau source, mais votre fonction peut le faire ou modifier les objets qu’il contient. Un nouveau tableau n’est pas une copie profonde de tous les objets. map et filter ignorent les emplacements absents d’un tableau creux ; map conserve ces trous.'],
    exemples: [{ titre: 'Comparer les résultats', langage: 'JavaScript', contenu: 'const prix = [10, 20, 30];\nconst doubles = prix.map(prix => prix * 2); // [20, 40, 60]\nconst petits = prix.filter(prix => prix < 25); // [10, 20]\nconst total = prix.reduce((somme, prix) => somme + prix, 0); // 60', explication: 'Les trois choix répondent à trois besoins : transformer, sélectionner et totaliser.' }],
    pourquoiUtiliser: ['map : produire des titres à partir d’objets.', 'filter : sélectionner les lectures terminées.', 'reduce : totaliser un ensemble avec une valeur initiale explicite.'],
    nePasUtiliser: ['Évitez map pour effectuer seulement des effets dont vous ignorez le tableau résultant ; une boucle est souvent plus claire.', 'Ne choisissez pas reduce si une boucle plus lisible exprime le même besoin.'],
    avertissements: ['Avec une fonction fléchée utilisant des accolades, écrivez return si vous voulez renvoyer une valeur.', 'Sans valeur initiale, reduce échoue sur un tableau vide.', 'map avec une fonction async renvoie un tableau de promesses, pas leurs résultats.'],
    liens: [{ label: 'MDN : map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map' }, { label: 'MDN : filter', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter' }, { label: 'MDN : reduce', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' }],
    termesNouveaux: [{ terme: 'accumulateur', definition: 'Valeur construite étape après étape par reduce.' }],
    maturiteEditoriale: 'enriched', provenance: 'redaction-specifique'
  }
};
