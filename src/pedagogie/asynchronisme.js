'use strict';
const { fiche, texte, code, liste, liens } = require('../data/outils');
function lecon(data, prerequis, vocabulaire, questions) {
  return { ...fiche({ ...data, domaine: 'javascript', categorie: 'Comprendre l’attente', niveau: 'Fondations' }), prerequis,
    niveauPedagogique: 1, maturiteEditoriale: 'enriched', provenance: 'redaction-specifique', tempsEstime: 25,
    competences: [data.resume], termesNouveaux: vocabulaire.map(([terme, definition]) => ({ terme, definition })),
    ...(questions ? { evaluation: { version: 1, questions } } : {}) };
}
const callbacks = lecon({
  id: 'js-callbacks', titre: 'Confier une action à une autre fonction', resume: 'Distinguer une fonction transmise de son résultat et reconnaître un callback.', tags: ['callback', 'fonction', 'rappel'], associes: ['js-fonctions', 'js-synchronisme'],
  guide: { modele: 'Vous voulez saluer plusieurs personnes avec une règle qui peut changer. Une fonction peut recevoir une autre fonction comme valeur, puis choisir quand l’appeler. C’est comme confier une recette à quelqu’un : la recette et le plat déjà préparé ne sont pas la même chose. Une fonction passée pour être appelée par une autre partie du code se nomme callback, ou fonction de rappel.',
    scenario: 'Un outil de tri reçoit une fonction de comparaison ; un bouton reçoit une action à déclencher. Le contrat de l’outil précise le moment et les arguments de cet appel. Le mot callback ne signifie pas forcément que l’action attendra.',
    exercice: 'Écrivez une fonction utiliser qui reçoit une action et l’appelle avec le nombre 4. Passez-lui une fonction qui affiche le double. Prédisez le résultat avant l’essai.',
    indice: 'Transmettez le nom de la fonction sans parenthèses ; les parenthèses déclenchent un appel.',
    correction: 'function utiliser(action) { action(4); } puis utiliser(nombre => console.log(nombre * 2)); affiche 8. utiliser reçoit bien une fonction, puis l’appelle avec 4. Passer console.log(8) exécuterait déjà l’affichage et transmettrait sa valeur de retour undefined.' },
  sections: [texte('Définir le contrat', 'Un paramètre est un nom recevant une valeur lors d’un appel. Ici action doit recevoir une fonction. Le code qui la reçoit décide de l’appeler immédiatement avec un nom.'),
    code('Passer puis appeler', 'JavaScript', 'function saluer(nom) {\n  console.log("Bonjour " + nom);\n}\nfunction executer(action) {\n  action("Awa");\n}\nexecuter(saluer);'),
    liste('Suivre l’exécution', ['saluer désigne une fonction, sans l’exécuter.', 'executer reçoit cette fonction dans action.', 'action("Awa") appelle saluer avec Awa.', 'La console affiche Bonjour Awa avant la fin de executer.']),
    texte('Éviter un appel trop tôt', 'executer(saluer("Awa")) affiche d’abord le message, puis transmet undefined car saluer ne renvoie rien. action n’est alors pas une fonction. Le bon argument est saluer.'),
    texte('Retenir maintenant', 'Une fonction est une valeur que l’on peut transmettre. Le callback peut être appelé immédiatement ou plus tard : lisez le contrat de la fonction qui le reçoit.'),
    liens({ label: 'MDN : fonction de rappel', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Callback_function' })]
}, ['js-fonctions'], [['callback', 'Fonction transmise pour être appelée par une autre partie du programme.'], ['paramètre', 'Nom qui reçoit une valeur fournie lors de l’appel d’une fonction.']]);
const synchronisme = lecon({
  id: 'js-synchronisme', titre: 'Prévoir ce qui se passe pendant une attente', resume: 'Distinguer l’ordre du code de l’ordre des actions reportées.', tags: ['synchrone', 'asynchrone', 'attente'], associes: ['js-callbacks', 'js-promises'],
  guide: { modele: 'Vous lancez un minuteur puis continuez à préparer le repas. Programmer le signal ne signifie pas qu’il a déjà sonné. De même, une opération peut être lancée maintenant et signaler son résultat plus tard, pendant que le programme poursuit son travail. On appelle cela un fonctionnement asynchrone. Synchrone désigne ici les appels exécutés avant de passer à l’instruction suivante.',
    scenario: 'Une page lance une demande de données et affiche un état de chargement. Le message final ne doit apparaître que lorsque la réponse a été traitée, pas simplement après la ligne qui lance la demande.',
    exercice: 'Prédisez les trois affichages du code, puis essayez avec un délai de 1000 à la place de 0. Expliquez ce qui change et ce qui reste identique.',
    indice: 'Programmer le rappel et exécuter le rappel sont deux moments différents.',
    correction: 'Le résultat est début, fin, rappel. Avec 1000, le rappel est programmé pour ne pas être prêt avant environ une seconde ; il peut arriver plus tard si le programme est occupé. début et fin restent dans cet ordre. Un délai de 0 ne fait pas passer le rappel avant la fin du travail courant.' },
  sections: [code('Programmer un rappel', 'JavaScript', 'console.log("début");\nsetTimeout(() => console.log("rappel"), 0);\nconsole.log("fin");'),
    texte('Lire les pièces', 'setTimeout demande à l’environnement de programmer un appel après un délai en millisecondes. () => console.log("rappel") est une fonction sans paramètre. 0 est le délai demandé, pas une promesse d’exécution immédiate.'),
    liste('Suivre les événements', ['Le premier affichage écrit début.', 'Le minuteur programme une fonction et rend la main.', 'La dernière ligne affiche fin.', 'Le rappel peut ensuite afficher rappel lorsque son exécution est possible.']),
    texte('Diagnostiquer un résultat absent', 'Lire une valeur juste après avoir programmé sa modification ne garantit pas que la modification ait eu lieu. Utilisez le mécanisme prévu pour recevoir la fin de l’opération.'),
    texte('Retenir et différer', 'Asynchrone ne signifie pas automatiquement exécuter votre JavaScript en parallèle. Les détails de la boucle d’événements viendront après les promesses.'),
    liens({ label: 'MDN : introduction à JavaScript asynchrone', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing' })]
}, ['js-callbacks'], [['synchrone', 'Appel terminé avant que le programme passe à l’instruction suivante.'], ['asynchrone', 'Opération dont le résultat peut arriver après la poursuite du programme.'], ['milliseconde', 'Un millième de seconde.']]);
const promesse = lecon({
  id: 'js-promises', titre: 'Recevoir un résultat qui n’est pas encore prêt', resume: 'Suivre une opération en attente, utiliser son résultat et traiter son échec.', tags: ['Promise', 'then', 'catch', 'async', 'await'], associes: ['js-synchronisme', 'js-erreurs', 'js-fetch', 'js-event-loop'],
  guide: { modele: 'Vous commandez un livre encore en préparation. Un reçu vous permet de suivre la commande, mais ce reçu n’est pas le livre. Dans un programme, une Promise est un objet qui permet de suivre l’issue d’une opération : encore en attente, terminée avec une valeur ou terminée par un échec. L’objet et son futur résultat sont différents.',
    scenario: 'Une interface attend une liste de livres. Pendant l’attente elle affiche un chargement ; en cas de réussite elle utilise la liste ; en cas d’échec elle propose de réessayer. La promesse représente l’issue de l’opération, pas l’état visuel de l’écran.',
    exercice: 'Prédisez l’ordre des trois affichages. Remplacez ensuite Promise.resolve(12) par Promise.reject(new Error("indisponible")) et expliquez quel gestionnaire est exécuté.',
    indice: 'Le gestionnaire de réussite reçoit une valeur ; le gestionnaire d’échec reçoit une erreur. Ils ne s’exécutent pas avant la fin du code courant.',
    correction: 'Avec resolve, la console affiche départ, suite, 24. La fonction de then reçoit 12 et le multiplie par deux. Avec reject, elle affiche départ, suite, puis indisponible via catch ; le gestionnaire de réussite est sauté. Le code de suite n’attend pas la promesse.' },
  sections: [texte('Nommer les trois états', 'Pending signifie en attente ; fulfilled signifie réussie avec une valeur ; rejected signifie échouée avec une raison. Une promesse devenue réussie ou échouée ne change plus d’issue. La valeur transportée peut toutefois être un objet mutable.'),
    code('Utiliser une valeur future', 'JavaScript', 'console.log("départ");\nconst resultat = Promise.resolve(12);\nresultat\n  .then(valeur => console.log(valeur * 2))\n  .catch(erreur => console.log(erreur.message));\nconsole.log("suite");'),
    texte('Lire la syntaxe', 'Promise.resolve(12) fournit ici une promesse déjà réussie avec 12. then reçoit une fonction qui utilisera la valeur. catch reçoit une fonction appelée si la chaîne échoue. Chaque then retourne une nouvelle promesse : renvoyez la valeur ou l’opération que la suite doit attendre.'),
    liste('Suivre l’exécution', ['départ est affiché.', 'resultat reçoit la promesse ; ce n’est pas le nombre 12.', 'Les fonctions de traitement sont enregistrées.', 'suite est affiché.', 'La fonction de réussite reçoit 12 et affiche 24.']),
    texte('Éviter une fausse attente', 'console.log(resultat * 2) ne lit pas le nombre futur. Multipliez la valeur reçue par then, ou utilisez await dans une fonction async. await suspend cette fonction jusqu’à l’issue ; il ne bloque pas à lui seul tout le navigateur.'),
    code('Écrire la même attente avec async/await', 'JavaScript', 'async function afficher() {\n  try {\n    const valeur = await Promise.resolve(12);\n    console.log(valeur * 2);\n  } catch (erreur) {\n    console.log(erreur.message);\n  }\n}\nafficher();'),
    texte('Diagnostiquer une chaîne interrompue', 'Si une étape lance une opération sans la retourner ni l’attendre, la suite peut démarrer trop tôt. Vérifiez le return de chaque gestionnaire avant d’ajouter un délai arbitraire.'),
    texte('Retenir maintenant', 'La promesse est le suivi d’une issue. Utilisez la valeur dans then ou après await et prévoyez le chemin d’échec. Les fonctions de then sont appelées après le travail synchrone courant.'),
    liens({ label: 'MDN : Promise', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' })]
}, ['js-fonctions', 'js-callbacks', 'js-synchronisme', 'js-erreurs'], [['Promise', 'Objet représentant l’issue d’une opération, en attente, réussie ou échouée.'], ['then', 'Méthode qui enregistre un traitement de l’issue et renvoie une nouvelle promesse.'], ['async', 'Mot-clé déclarant une fonction qui retourne une promesse.'], ['await', 'Expression qui attend l’issue d’une promesse dans le contexte autorisé.']], [
  { id: 'ordre', question: 'Dans le premier exemple, quel est l’ordre des affichages ?', choix: ['départ, 24, suite', 'départ, suite, 24'], correct: 1, explication: 'Le traitement de then est différé après le travail synchrone courant.' },
  { id: 'objet', question: 'Que contient resultat dans cet exemple ?', choix: ['Le nombre 12', 'Un objet Promise'], correct: 1, explication: 'La valeur future est reçue par le gestionnaire ; la variable contient la promesse.' }
]);
promesse.sections.forEach(s => { if (s.titre.includes('async/await') || s.titre.includes('chaîne')) s.profondeur = 2; });
module.exports = { nouvelles: [callbacks, synchronisme], remplacements: { 'js-promises': promesse } };
