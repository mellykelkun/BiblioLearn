'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'js-variables', domaine: 'javascript', categorie: 'Fondamentaux', titre: 'let, const et var',
    resume: 'Déclarer une liaison, comprendre sa portée et exprimer si elle sera réassignée.',
    tags: ['variable', 'let', 'const', 'var', 'scope', 'portée'],
    sections: [
      texte('Définition', 'Une déclaration associe un nom à une valeur. const empêche de réassigner la liaison ; let autorise une réassignation. Les deux ont une portée de bloc. var suit des règles historiques de portée de fonction et de remontée qui favorisent les surprises.'),
      code('Syntaxe recommandée', 'JavaScript', 'const utilisateur = { nom: "Ada" };\nlet tentatives = 0;\n\ntentatives += 1;\nutilisateur.nom = "Grace"; // autorisé : l’objet reste le même'),
      comparaison('Conséquences pratiques', ['Mot-clé', 'Réassignable', 'Portée', 'Usage moderne'], [
        ['const', 'Non', 'Bloc', 'Choix par défaut'],
        ['let', 'Oui', 'Bloc', 'Valeur qui doit changer'],
        ['var', 'Oui', 'Fonction', 'Ancien code uniquement']
      ]),
      alerte('erreur', 'Erreur fréquente', 'const ne rend pas un objet immuable. Il interdit de remplacer la référence, mais ses propriétés peuvent encore changer.'),
      alerte('retenir', 'À retenir', 'Utiliser const par défaut, puis let seulement lorsqu’une réassignation est nécessaire. Cela rend l’intention visible à la lecture.'),
      liens({ label: 'MDN — Grammaire et types', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Grammar_and_types' })
    ], associes: ['js-types', 'js-fonctions', 'js-objets']
  }),
  fiche({
    id: 'js-types', domaine: 'javascript', categorie: 'Fondamentaux', titre: 'Types et typeof',
    resume: 'Distinguer valeurs primitives, objets, null et conversions implicites.',
    tags: ['string', 'number', 'boolean', 'undefined', 'null', 'symbol', 'bigint', 'typeof'],
    sections: [
      liste('Les types primitifs', ['string : texte.', 'number : nombres entiers ou décimaux, avec NaN et Infinity.', 'boolean : true ou false.', 'undefined : absence de valeur généralement non initialisée.', 'null : absence choisie explicitement.', 'bigint : entiers arbitrairement grands.', 'symbol : identifiant unique.']),
      code('Inspection', 'JavaScript', 'typeof "bonjour";       // "string"\ntypeof 42;              // "number"\ntypeof true;            // "boolean"\ntypeof undefined;       // "undefined"\ntypeof 42n;             // "bigint"\ntypeof {};              // "object"\ntypeof null;            // "object" (bizarrerie historique)\nArray.isArray([]);       // true'),
      texte('Valeur et référence', 'Les primitives sont comparées par valeur. Les objets, fonctions et tableaux sont comparés par identité de référence : deux objets au contenu identique restent deux objets distincts.'),
      alerte('erreur', 'Piège historique', 'typeof null renvoie "object" pour des raisons de compatibilité. Pour tester null, utiliser valeur === null. Pour un tableau, utiliser Array.isArray(valeur).'),
      liens({ label: 'MDN — Structures de données', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Data_structures' })
    ], associes: ['js-egalite', 'js-variables', 'js-objets']
  }),
  fiche({
    id: 'js-egalite', domaine: 'javascript', categorie: 'Fondamentaux', titre: '== ou ===',
    resume: 'Comparer sans déclencher de conversions implicites difficiles à prévoir.',
    tags: ['égalité', 'strict equality', 'coercition', 'double égal', 'triple égal'],
    sections: [
      comparaison('Différence', ['Opérateur', 'Conversion', 'Exemple', 'Conseil'], [
        ['===', 'Aucune conversion de type', '"5" === 5 → false', 'À privilégier'],
        ['==', 'Conversion selon des règles complexes', '"5" == 5 → true', 'À reconnaître, rarement nécessaire'],
        ['Object.is()', 'Comparaison SameValue', 'Object.is(NaN, NaN) → true', 'Cas spécialisés']
      ]),
      code('Exemples révélateurs', 'JavaScript', '0 == false;          // true\n"" == false;         // true\nnull == undefined;   // true\n\n0 === false;         // false\n"" === false;        // false\nnull === undefined;  // false'),
      texte('Conséquence pratique', 'Avec ==, une comparaison apparemment innocente peut convertir booléens, chaînes et nombres. Avec ===, une différence de type est immédiatement fausse, ce qui rend le code et le debugging plus prévisibles.'),
      alerte('bonne-pratique', 'Recommandation', 'Employer === et !== par défaut. Convertir explicitement lorsque le type doit changer : Number(valeur), String(valeur) ou Boolean(valeur).'),
      liens({ label: 'MDN — Égalité stricte', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Strict_equality' })
    ], associes: ['js-types', 'js-conditions']
  }),
  fiche({
    id: 'js-conditions', domaine: 'javascript', categorie: 'Contrôle', titre: 'Conditions et valeurs truthy/falsy',
    resume: 'Exécuter une branche selon une expression booléenne sans confondre absence et valeur valide.',
    tags: ['if', 'else', 'switch', 'ternaire', 'truthy', 'falsy', 'nullish'],
    sections: [
      code('Syntaxe', 'JavaScript', 'if (score >= 80) {\n  niveau = "avancé";\n} else if (score >= 50) {\n  niveau = "intermédiaire";\n} else {\n  niveau = "débutant";\n}\n\nconst libelle = actif ? "Activé" : "Désactivé";'),
      liste('Valeurs falsy', ['false', '0 et -0', '0n', 'chaîne vide ""', 'null', 'undefined', 'NaN']),
      texte('?? contre ||', 'L’opérateur || prend la valeur de droite dès que celle de gauche est falsy. ?? ne le fait que pour null ou undefined. Pour une valeur valide comme 0 ou "", ?? préserve généralement mieux l’intention.'),
      code('Valeur par défaut', 'JavaScript', 'const quantite = 0;\n\nquantite || 10; // 10 : le zéro est remplacé\nquantite ?? 10; // 0 : le zéro est conservé'),
      alerte('erreur', 'Erreur fréquente', 'if (tableau.length) est correct pour tester un tableau non vide, mais if (valeur) n’est pas un test universel de présence : 0 peut être une donnée parfaitement valide.'),
      liens({ label: 'MDN — Contrôle du flux', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Control_flow_and_error_handling' })
    ], associes: ['js-egalite', 'js-boucles', 'js-types']
  }),
  fiche({
    id: 'js-boucles', domaine: 'javascript', categorie: 'Contrôle', titre: 'for, for…of et forEach()',
    resume: 'Choisir une itération selon le besoin de contrôle, les valeurs parcourues et l’asynchronisme.',
    tags: ['for', 'for of', 'foreach', 'boucle', 'break', 'continue'],
    sections: [
      comparaison('Choix pratique', ['Forme', 'Force', 'Limite'], [
        ['for classique', 'Contrôle de l’index et du pas', 'Plus verbeux'],
        ['for…of', 'Lit directement les valeurs', 'Index à obtenir séparément'],
        ['forEach()', 'Exprime une action par élément', 'Pas de break ; attend mal async'],
        ['map()', 'Construit un nouveau tableau', 'À éviter pour de simples effets de bord']
      ]),
      code('Même besoin, trois formes', 'JavaScript', 'for (let index = 0; index < noms.length; index += 1) {\n  console.log(index, noms[index]);\n}\n\nfor (const nom of noms) {\n  console.log(nom);\n}\n\nnoms.forEach((nom, index) => {\n  console.log(index, nom);\n});'),
      alerte('attention', 'Asynchrone', 'forEach() n’attend pas les Promises retournées par son callback. Pour traiter séquentiellement avec await, utiliser for…of dans une fonction async. Pour lancer en parallèle, construire des Promises puis utiliser Promise.all().'),
      liens({ label: 'MDN — Boucles et itération', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Loops_and_iteration' })
    ], associes: ['js-map-filter-reduce', 'js-promises', 'js-conditions']
  }),
  fiche({
    id: 'js-fonctions', domaine: 'javascript', categorie: 'Fonctions', titre: 'Fonction classique ou fléchée',
    resume: 'Déclarer un comportement réutilisable et comprendre les différences de this et de construction.',
    tags: ['function', 'arrow function', 'paramètre', 'return', 'this', 'callback'],
    sections: [
      code('Deux syntaxes', 'JavaScript', 'function additionner(a, b = 0) {\n  return a + b;\n}\n\nconst doubler = (nombre) => nombre * 2;\n\nadditionner(4, 3); // 7\ndoubler(5);        // 10'),
      decomposition('Anatomie', [
        { terme: 'additionner', explication: 'nom utilisé pour appeler la fonction et lire les traces d’erreur.' },
        { terme: '(a, b = 0)', explication: 'paramètres ; b possède une valeur par défaut si l’argument est undefined.' },
        { terme: 'return', explication: 'termine l’appel et fournit une valeur au code appelant.' },
        { terme: '(nombre) => nombre * 2', explication: 'fonction fléchée avec retour implicite de l’expression.' }
      ]),
      comparaison('Conséquences', ['Aspect', 'function', '=>'], [
        ['this', 'Dépend de l’appel', 'Capturé lexicalement'],
        ['new', 'Possible si constructible', 'Impossible'],
        ['arguments', 'Objet arguments local', 'Pas d’objet arguments local'],
        ['Callbacks courts', 'Correct', 'Souvent plus lisible']
      ]),
      alerte('erreur', 'Erreur fréquente', 'Une flèche avec accolades ne retourne rien automatiquement : const doubler = n => { n * 2 } renvoie undefined. Ajouter return ou retirer les accolades.'),
      liens({ label: 'MDN — Fonctions', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Functions' })
    ], associes: ['js-variables', 'js-map-filter-reduce', 'dom-evenements']
  }),
  fiche({
    id: 'js-map-filter-reduce', domaine: 'javascript', categorie: 'Tableaux', titre: 'map(), filter() et reduce()',
    resume: 'Transformer, sélectionner ou agréger un tableau sans modifier la source.',
    tags: ['array', 'map', 'filter', 'reduce', 'callback', 'tableau'],
    sections: [
      comparaison('Intention', ['Méthode', 'Question', 'Retour'], [
        ['map()', 'Que devient chaque élément ?', 'Tableau de même longueur'],
        ['filter()', 'Quels éléments conserver ?', 'Nouveau tableau de longueur ≤ source'],
        ['reduce()', 'Comment combiner en une valeur ?', 'Accumulateur final'],
        ['forEach()', 'Quelle action exécuter ?', 'undefined']
      ]),
      code('Exemple concret commenté', 'JavaScript', 'const produits = [\n  { nom: "Clavier", prix: 80, stock: true },\n  { nom: "Écran", prix: 240, stock: false },\n  { nom: "Souris", prix: 35, stock: true }\n];\n\n// 1. On garde seulement les produits disponibles.\nconst disponibles = produits.filter((produit) => produit.stock);\n// 2. On extrait leur prix.\nconst prix = disponibles.map((produit) => produit.prix);\n// 3. On additionne le tableau obtenu, en partant de 0.\nconst totalDisponible = prix.reduce((total, montant) => total + montant, 0);\n\nconsole.log(totalDisponible); // 115'),
      decomposition('Callback de map()', [
        { terme: 'produit', explication: 'élément courant ; seul paramètre généralement nécessaire.' },
        { terme: 'index', explication: 'deuxième paramètre optionnel : position courante.' },
        { terme: 'tableau', explication: 'troisième paramètre optionnel : tableau parcouru.' },
        { terme: 'return', explication: 'valeur placée dans le nouveau tableau.' }
      ]),
      alerte('erreur', 'Pourquoi map() renvoie des undefined', 'Avec .map(element => { element.prix * 2 }), les accolades ouvrent un bloc sans return. Écrire .map(element => element.prix * 2) ou ajouter return.'),
      alerte('bonne-pratique', 'Quand éviter reduce()', 'reduce() est puissant, mais une boucle claire ou map()/filter() est parfois plus lisible. Ne pas condenser plusieurs responsabilités uniquement pour économiser des lignes.'),
      liens({ label: 'MDN — Array.map()', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map' }, { label: 'MDN — Array.reduce()', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' })
    ], associes: ['js-fonctions', 'js-boucles', 'js-tableaux']
  }),
  fiche({
    id: 'js-tableaux', domaine: 'javascript', categorie: 'Tableaux', titre: 'Créer et modifier un tableau',
    resume: 'Manipuler une collection ordonnée et distinguer méthodes mutables et non mutables.',
    tags: ['array', 'push', 'pop', 'slice', 'splice', 'spread', 'includes'],
    sections: [
      code('Opérations courantes', 'JavaScript', 'const langages = ["HTML", "CSS"];\nlangages.push("JavaScript");       // modifie le tableau\n\nconst premiers = langages.slice(0, 2); // nouveau tableau\nconst copie = [...langages];            // copie superficielle\nconst contientCSS = langages.includes("CSS");'),
      comparaison('Méthodes proches', ['Méthode', 'Effet', 'Retour'], [
        ['push(x)', 'Ajoute à la fin, modifie', 'Nouvelle longueur'],
        ['pop()', 'Retire à la fin, modifie', 'Élément retiré'],
        ['slice(a, b)', 'Copie une portion, ne modifie pas', 'Nouveau tableau'],
        ['splice(a, n)', 'Retire/insère, modifie', 'Éléments retirés'],
        ['toSpliced(a, n)', 'Retire/insère, ne modifie pas', 'Nouveau tableau']
      ]),
      alerte('attention', 'Copie superficielle', '[...tableau] copie le conteneur, pas les objets imbriqués. Modifier copie[0].nom modifie aussi l’objet visible depuis le tableau d’origine s’il s’agit de la même référence.'),
      liens({ label: 'MDN — Array', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array' })
    ], associes: ['js-map-filter-reduce', 'js-objets', 'js-types']
  }),
  fiche({
    id: 'js-objets', domaine: 'javascript', categorie: 'Objets', titre: 'Objets, destructuration et spread',
    resume: 'Regrouper des propriétés nommées, extraire des valeurs et créer des copies superficielles.',
    tags: ['object', 'property', 'destructuring', 'spread', 'optional chaining'],
    sections: [
      code('Syntaxe moderne', 'JavaScript', 'const utilisateur = {\n  id: 42,\n  profil: { nom: "Ada", ville: "Londres" }\n};\n\nconst { id, profil: { nom } } = utilisateur;\nconst miseAJour = { ...utilisateur, actif: true };\nconst pays = utilisateur.adresse?.pays ?? "Non renseigné";'),
      decomposition('Opérateurs', [
        { terme: '{ id } = utilisateur', explication: 'extrait la propriété id dans une variable du même nom.' },
        { terme: '{ ...utilisateur }', explication: 'copie superficiellement les propriétés énumérables.' },
        { terme: '?.', explication: 'arrête la lecture et renvoie undefined si la partie précédente est null ou undefined.' },
        { terme: '??', explication: 'utilise la valeur de droite uniquement pour null ou undefined.' }
      ]),
      alerte('erreur', 'Référence partagée', 'Le spread ne clone pas profondément. miseAJour.profil et utilisateur.profil désignent encore le même objet imbriqué.'),
      liens({ label: 'MDN — Travailler avec les objets', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Working_with_objects' })
    ], associes: ['js-types', 'js-tableaux', 'js-json']
  }),
  fiche({
    id: 'js-json', domaine: 'javascript', categorie: 'Données', titre: 'JSON.parse() et JSON.stringify()',
    resume: 'Convertir entre texte JSON et valeurs JavaScript en connaissant les limites du format.',
    tags: ['json', 'parse', 'stringify', 'serialization', 'api'],
    sections: [
      code('Aller-retour', 'JavaScript', 'const texte = \'{"nom":"Ada","actif":true}\';\nconst objet = JSON.parse(texte);\n\nobjet.nom; // "Ada"\n\nconst sortie = JSON.stringify(objet, null, 2);\nconsole.log(sortie);'),
      texte('Paramètres et retours', 'JSON.parse(texte) retourne la valeur représentée ou lève SyntaxError si le texte est invalide. JSON.stringify(valeur, replacer?, espace?) retourne une chaîne JSON, ou undefined pour certaines valeurs non sérialisables prises seules.'),
      liste('Ce que JSON ne représente pas directement', ['undefined, fonctions et Symbol.', 'Date : transformée en chaîne, pas restaurée automatiquement.', 'Map et Set : objets vides sans conversion personnalisée.', 'BigInt : provoque une erreur sans stratégie de sérialisation.', 'Références circulaires : provoquent une TypeError.']),
      alerte('erreur', 'Debugging', 'JSON.parse() peut lever une exception. Lorsque la donnée vient d’un fichier, du stockage ou d’un utilisateur, entourer la conversion d’un try…catch et signaler clairement le format attendu.'),
      liens({ label: 'MDN — JSON', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON' })
    ], associes: ['js-objets', 'js-fetch', 'http-requete-reponse']
  }),
  fiche({
    id: 'js-erreurs', domaine: 'javascript', categorie: 'Debugging', titre: 'try, catch, throw et Error',
    resume: 'Faire remonter une erreur utile, la traiter au bon niveau et conserver son contexte.',
    tags: ['try', 'catch', 'throw', 'error', 'debugging', 'stack'],
    sections: [
      code('Exemple', 'JavaScript', 'function calculerPrix(prix) {\n  if (!Number.isFinite(prix) || prix < 0) {\n    throw new TypeError("Le prix doit être un nombre positif");\n  }\n  return prix * 1.2;\n}\n\ntry {\n  console.log(calculerPrix(-4));\n} catch (erreur) {\n  console.error(erreur.message);\n}'),
      texte('Quand intercepter', 'Une fonction basse peut lancer une erreur lorsqu’elle ne peut pas respecter son contrat. Un niveau plus haut la capture s’il sait réellement réagir : afficher un message, retenter ou transformer la réponse. Capturer puis ignorer masque les bugs.'),
      decomposition('Objet Error', [
        { terme: 'name', explication: 'catégorie, par exemple Error, TypeError ou SyntaxError.' },
        { terme: 'message', explication: 'explication destinée au diagnostic.' },
        { terme: 'stack', explication: 'pile des appels, surtout utile pendant le développement.' },
        { terme: 'cause', explication: 'erreur d’origine facultative lors d’un nouvel Error(message, { cause }).' }
      ]),
      alerte('erreur', 'Mauvais exemple', 'catch (erreur) {} fait disparaître l’information et peut laisser l’application dans un état incohérent. Traiter, journaliser avec contexte ou relancer.'),
      liens({ label: 'MDN — Gestion des exceptions', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Control_flow_and_error_handling' })
    ], associes: ['js-promises', 'js-fetch', 'express-erreurs']
  }),
  fiche({
    id: 'js-promises', domaine: 'javascript', categorie: 'Asynchrone', titre: 'Promise et async/await',
    resume: 'Représenter un résultat futur et écrire un enchaînement asynchrone lisible.',
    tags: ['promise', 'async', 'await', 'then', 'catch', 'asynchrone'],
    sections: [
      texte('Définition', 'Une Promise est un objet représentant une réussite ou un échec futur. Elle passe de pending à fulfilled avec une valeur, ou rejected avec une raison. Une fois réglée, son état ne change plus.'),
      code('Deux écritures équivalentes commentées', 'JavaScript', 'function chargerAvecThen() {\n  // fetch retourne une Promise de Response.\n  return fetch("/api/livres")\n    // json() lit le corps puis retourne une nouvelle Promise.\n    .then((reponse) => reponse.json())\n    // Le résultat final est le nombre de livres.\n    .then((livres) => livres.length);\n}\n\nasync function chargerAvecAwait() {\n  // await rend la succession plus proche d’une lecture ligne par ligne.\n  const reponse = await fetch("/api/livres");\n  const livres = await reponse.json();\n  return livres.length;\n}'),
      decomposition('Ce qui se passe', [
        { terme: 'async', explication: 'garantit que la fonction retourne une Promise.' },
        { terme: 'await', explication: 'suspend cette fonction async jusqu’au règlement de la Promise, sans bloquer le thread.' },
        { terme: 'return', explication: 'résout la Promise retournée avec la valeur.' },
        { terme: 'throw', explication: 'rejette la Promise retournée.' }
      ]),
      alerte('erreur', 'Erreur fréquente', 'Oublier await donne une Promise au lieu de la valeur attendue. console.log(chargerAvecAwait()) affiche une Promise ; il faut await depuis une fonction async ou utiliser .then().'),
      alerte('bonne-pratique', 'Séquentiel ou parallèle', 'Si deux opérations sont indépendantes, démarrer les deux puis await Promise.all([a, b]) évite d’attendre inutilement la première avant de lancer la seconde.'),
      liens({ label: 'MDN — Utiliser les promesses', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Using_promises' })
    ], associes: ['js-fetch', 'js-event-loop', 'js-erreurs']
  }),
  fiche({
    id: 'js-fetch', domaine: 'javascript', categorie: 'Asynchrone', titre: 'fetch()',
    resume: 'Envoyer une requête HTTP dans le navigateur et traiter explicitement réseau, statut et contenu.',
    tags: ['fetch', 'http', 'response', 'json', 'abortcontroller', 'api'],
    sections: [
      code('Exemple robuste', 'JavaScript', 'async function creerLivre(livre, signal) {\n  const reponse = await fetch("/api/livres", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(livre),\n    signal\n  });\n\n  if (!reponse.ok) {\n    throw new Error(`Erreur HTTP ${reponse.status}`);\n  }\n\n  return reponse.json();\n}'),
      decomposition('Paramètres et retour', [
        { terme: 'fetch(url, options)', explication: 'prend une URL et des options facultatives ; retourne immédiatement une Promise.' },
        { terme: 'method', explication: 'méthode HTTP ; GET par défaut.' },
        { terme: 'headers', explication: 'métadonnées de requête ; Content-Type décrit le corps envoyé.' },
        { terme: 'body', explication: 'corps de requête ; un objet doit être sérialisé, souvent avec JSON.stringify().' },
        { terme: 'Response', explication: 'réponse HTTP ; .json(), .text() ou .blob() lisent son corps une fois.' }
      ]),
      alerte('erreur', 'Piège essentiel', 'fetch() ne rejette pas automatiquement pour un statut 404 ou 500. Il rejette surtout pour une panne réseau ou une annulation. Toujours vérifier reponse.ok ou reponse.status.'),
      liens({ label: 'MDN — Fetch API', url: 'https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch' })
    ], associes: ['js-promises', 'http-requete-reponse', 'js-json']
  }),
  fiche({
    id: 'js-modules', domaine: 'javascript', categorie: 'Organisation', titre: 'Modules ES : import et export',
    resume: 'Séparer le code en fichiers avec le système de modules standard de JavaScript.',
    tags: ['module', 'esm', 'import', 'export', 'script type module', 'commonjs'],
    sections: [
      code('Exports nommés', 'JavaScript', '// calculs.js\nexport function additionner(a, b) {\n  return a + b;\n}\nexport const TVA = 0.2;\n\n// app.js\nimport { additionner, TVA } from "./calculs.js";'),
      texte('Fonctionnement', 'Chaque module possède sa propre portée, est évalué une seule fois, et déclare statiquement ses dépendances. Dans le navigateur, utiliser <script type="module" src="/app.js"></script>. Les chemins relatifs exigent généralement leur extension.'),
      comparaison('ES Modules ou CommonJS ?', ['Aspect', 'ES Modules', 'CommonJS'], [
        ['Syntaxe', 'import / export', 'require / module.exports'],
        ['Standard', 'JavaScript', 'Historique Node.js'],
        ['Analyse statique', 'Oui', 'Limitée'],
        ['Navigateur', 'Natif', 'Pas natif sans outil'],
        ['Node.js', 'type: module ou .mjs', 'Défaut historique en .cjs/.js selon package']
      ]),
      alerte('bonne-pratique', 'Choix de projet', 'ES Modules est le standard du langage et le choix courant pour un nouveau projet. Éviter de mélanger require et import dans un même fichier.'),
      liens({ label: 'MDN — Modules JavaScript', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules' }, { label: 'Node.js — ECMAScript modules', url: 'https://nodejs.org/api/esm.html' })
    ], associes: ['node-modules', 'js-fonctions', 'npm-package-json']
  }),
  fiche({
    id: 'js-event-loop', domaine: 'javascript', categorie: 'Asynchrone', titre: 'Event loop, tâches et microtâches',
    resume: 'Comprendre pourquoi Promise.then s’exécute avant setTimeout sans bloquer le thread JavaScript.',
    tags: ['event loop', 'microtask', 'task', 'call stack', 'settimeout', 'promise'], niveau: 'Intermédiaire',
    sections: [
      code('Ordre observable', 'JavaScript', 'console.log("A");\n\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\n\nconsole.log("D");\n\n// A, D, C, B'),
      texte('Fonctionnement interne', 'Le script courant s’exécute sur la pile d’appels. Quand elle devient vide, la file des microtâches, notamment les réactions de Promise, est vidée avant de prendre une nouvelle tâche comme le callback de setTimeout. Le délai zéro signifie “au plus tôt”, jamais “immédiatement”.'),
      alerte('attention', 'Performance', 'Une longue boucle JavaScript bloque rendu et interactions. Découper un travail, utiliser une API asynchrone ou un Worker selon le besoin ; async/await ne rend pas un calcul CPU intensif non bloquant.'),
      liens({ label: 'MDN — Modèle de concurrence', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Execution_model' })
    ], associes: ['js-promises', 'dom-evenements', 'node-runtime']
  }),
  fiche({
    id: 'dom-selection', domaine: 'dom', categorie: 'Sélection', titre: 'getElementById() et querySelector()',
    resume: 'Retrouver un élément du document et traiter correctement le cas où il est absent.',
    tags: ['document', 'getElementById', 'querySelector', 'querySelectorAll', 'null'],
    sections: [
      texte('Définition', 'document représente le document HTML chargé. Les méthodes de sélection parcourent sa structure pour retourner un élément, une collection, ou indiquer qu’aucune correspondance n’existe.'),
      code('Syntaxe commentée', 'JavaScript', '// document représente la page HTML chargée.\nconst titre = document.getElementById("entete");\n\n// querySelector utilise un sélecteur CSS et retourne le premier résultat.\nconst premiereCarte = document.querySelector(".carte");\n\n// querySelectorAll retourne tous les résultats dans une NodeList.\nconst cartes = document.querySelectorAll(".carte");'),
      decomposition('document.getElementById("entete")', [
        { terme: 'document', explication: 'objet racine représentant le document HTML courant.' },
        { terme: '.getElementById', explication: 'méthode spécialisée dans la recherche d’un id exact.' },
        { terme: '("entete")', explication: 'argument : valeur de l’id, sans caractère #.' },
        { terme: 'Retour', explication: 'l’Element correspondant, ou null si aucun élément ne possède cet id.' }
      ]),
      comparaison('Choisir la méthode', ['Méthode', 'Sélecteur', 'Retour'], [
        ['getElementById("x")', 'id exact', 'Element ou null'],
        ['querySelector(".x")', 'sélecteur CSS', 'Premier Element ou null'],
        ['querySelectorAll(".x")', 'sélecteur CSS', 'NodeList statique, possiblement vide']
      ]),
      alerte('erreur', 'Pourquoi ce code ne fonctionne pas ?', 'Si aucun élément ne possède id="entete", titre vaut null. titre.textContent = "Bonjour" provoque alors TypeError car on tente d’utiliser textContent sur null. Vérifier le HTML, l’orthographe et le moment d’exécution du script.'),
      code('Traitement explicite', 'JavaScript', 'const titre = document.getElementById("entete");\n\nif (!titre) {\n  throw new Error("Élément #entete introuvable");\n}\n\ntitre.textContent = "Bonjour";'),
      liens({ label: 'MDN — getElementById()', url: 'https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById' }, { label: 'MDN — querySelector()', url: 'https://developer.mozilla.org/fr/docs/Web/API/Document/querySelector' })
    ], associes: ['dom-modification', 'dom-evenements', 'html-attributs']
  }),
  fiche({
    id: 'dom-modification', domaine: 'dom', categorie: 'Manipulation', titre: 'Créer et modifier des éléments',
    resume: 'Mettre à jour texte, classes et structure sans injecter du HTML non fiable.',
    tags: ['createElement', 'append', 'textContent', 'innerHTML', 'classList'],
    sections: [
      code('Construire un élément', 'JavaScript', 'const liste = document.querySelector("#technologies");\nconst element = document.createElement("li");\n\nelement.classList.add("technologie");\nelement.textContent = "JavaScript";\nelement.dataset.niveau = "fondamental";\n\nliste.append(element);'),
      decomposition('Méthodes utiles', [
        { terme: 'createElement()', explication: 'crée un élément détaché du document.' },
        { terme: 'textContent', explication: 'lit ou remplace le texte ; les chevrons restent du texte.' },
        { terme: 'classList', explication: 'ajoute, retire, bascule ou teste des classes.' },
        { terme: 'append()', explication: 'insère nœuds ou texte à la fin du parent.' },
        { terme: 'remove()', explication: 'retire le nœud du document.' }
      ]),
      alerte('attention', 'innerHTML et sécurité', 'innerHTML interprète une chaîne comme du HTML. Ne jamais y injecter une valeur non fiable : cela peut créer une faille XSS. Préférer textContent et createElement pour le contenu utilisateur.'),
      liens({ label: 'MDN — Introduction au DOM', url: 'https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model/Introduction' })
    ], associes: ['dom-selection', 'dom-evenements', 'dom-delegation']
  }),
  fiche({
    id: 'dom-evenements', domaine: 'dom', categorie: 'Événements', titre: 'addEventListener()',
    resume: 'Enregistrer une fonction qui réagit à un événement du navigateur ou de l’utilisateur.',
    tags: ['event', 'addEventListener', 'click', 'preventDefault', 'target'],
    sections: [
      code('Syntaxe', 'JavaScript', 'const bouton = document.querySelector("#enregistrer");\n\nfunction gererClic(evenement) {\n  console.log(evenement.type);   // "click"\n  console.log(evenement.target); // élément réellement cliqué\n}\n\nbouton.addEventListener("click", gererClic);'),
      decomposition('Paramètres', [
        { terme: '"click"', explication: 'type d’événement, sans préfixe on.' },
        { terme: 'gererClic', explication: 'référence vers la fonction appelée plus tard.' },
        { terme: 'evenement', explication: 'objet fourni par le navigateur avec cible, type et autres informations.' },
        { terme: 'options', explication: 'troisième argument facultatif : once, capture, passive ou signal.' },
        { terme: 'Retour', explication: 'undefined ; l’effet est l’enregistrement de l’écouteur.' }
      ]),
      alerte('erreur', 'Fonction appelée trop tôt', 'addEventListener("click", gererClic()) exécute gererClic immédiatement et transmet son retour. Il faut passer la fonction : gererClic, ou une flèche qui l’appelle.'),
      alerte('bonne-pratique', 'Nettoyage', 'Pour retirer un écouteur avec removeEventListener, conserver la même référence de fonction. Un AbortController permet aussi de retirer un groupe d’écouteurs via l’option signal.'),
      liens({ label: 'MDN — addEventListener()', url: 'https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener' })
    ], associes: ['dom-selection', 'dom-delegation', 'dom-formulaires']
  }),
  fiche({
    id: 'dom-formulaires', domaine: 'dom', categorie: 'Formulaires', titre: 'Lire et valider un formulaire',
    resume: 'Intercepter submit, lire FormData et conserver le comportement accessible du formulaire.',
    tags: ['form', 'submit', 'formdata', 'preventDefault', 'validation'],
    sections: [
      code('Exemple', 'JavaScript', 'const formulaire = document.querySelector("#profil");\n\nformulaire.addEventListener("submit", (evenement) => {\n  evenement.preventDefault();\n\n  if (!formulaire.reportValidity()) return;\n\n  const donnees = new FormData(formulaire);\n  const profil = Object.fromEntries(donnees);\n  console.log(profil);\n});'),
      texte('Pourquoi écouter submit', 'submit couvre le clic sur le bouton et la validation au clavier. Écouter seulement click manque des chemins d’utilisation. preventDefault() bloque l’envoi natif uniquement lorsqu’une logique JavaScript le remplace.'),
      alerte('attention', 'Sécurité', 'La validation côté navigateur guide l’utilisateur ; elle ne protège pas le serveur. Toute donnée reçue doit être validée côté serveur.'),
      liens({ label: 'MDN — FormData', url: 'https://developer.mozilla.org/fr/docs/Web/API/FormData' })
    ], associes: ['html-formulaires', 'dom-evenements', 'js-fetch']
  }),
  fiche({
    id: 'dom-delegation', domaine: 'dom', categorie: 'Événements', titre: 'Délégation d’événements',
    resume: 'Gérer des enfants présents ou futurs avec un seul écouteur placé sur un ancêtre stable.',
    tags: ['event delegation', 'bubbling', 'closest', 'target', 'currentTarget'], niveau: 'Intermédiaire',
    sections: [
      texte('Pourquoi cela fonctionne', 'La plupart des événements remontent depuis la cible à travers ses ancêtres. Un écouteur sur la liste peut donc identifier le bouton réellement cliqué, y compris si ce bouton a été ajouté après l’enregistrement.'),
      code('Exemple', 'JavaScript', 'const liste = document.querySelector("#taches");\n\nliste.addEventListener("click", (evenement) => {\n  const bouton = evenement.target.closest("[data-supprimer]");\n  if (!bouton || !liste.contains(bouton)) return;\n\n  bouton.closest("li")?.remove();\n});'),
      decomposition('target ou currentTarget', [
        { terme: 'event.target', explication: 'élément profond qui a déclenché l’événement.' },
        { terme: 'event.currentTarget', explication: 'élément dont l’écouteur est en train de s’exécuter.' },
        { terme: 'closest()', explication: 'remonte depuis la cible jusqu’au premier ancêtre correspondant.' }
      ]),
      alerte('attention', 'Quand ne pas l’utiliser', 'Tous les événements ne remontent pas de la même manière. La délégation ajoute aussi une logique de filtrage : pour deux boutons fixes, deux écouteurs directs peuvent être plus simples.'),
      liens({ label: 'MDN — Propagation des événements', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/Event_bubbling' })
    ], associes: ['dom-evenements', 'dom-modification', 'dom-selection']
  })
];
