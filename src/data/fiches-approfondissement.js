'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'html-dialog-details', domaine: 'html', categorie: 'Sémantique', titre: 'details, summary et dialog',
    resume: 'Construire des zones dépliables et des dialogues natifs sans recréer le comportement au JavaScript.',
    tags: ['details', 'summary', 'dialog', 'modal', 'HTML natif', 'accessibilité'],
    sections: [
      texte('Deux comportements natifs', 'details et summary forment un accordéon accessible par défaut : le navigateur gère l’ouverture, le clavier et l’état open. dialog représente une boîte de dialogue ; showModal() la place au premier plan et crée un arrière-plan modal.'),
      code('Accordéon et dialogue', 'HTML', '<details>\n  <summary>Voir l’explication</summary>\n  <p>Le contenu reste dans le document et peut être ouvert au clavier.</p>\n</details>\n\n<dialog id="confirmation">\n  <form method="dialog">\n    <p>Supprimer cette note ?</p>\n    <button value="cancel">Annuler</button>\n    <button value="confirm">Confirmer</button>\n  </form>\n</dialog>'),
      code('Ouvrir sans piège', 'JavaScript', 'const dialogue = document.querySelector("#confirmation");\n\ndocument.querySelector("#supprimer").addEventListener("click", () => {\n  dialogue.showModal();\n});\n\ndialogue.addEventListener("close", () => {\n  console.log("Choix :", dialogue.returnValue);\n});'),
      alerte('bonne-pratique', 'Choisir le bon outil', 'Ne transformez pas un simple contenu secondaire en modal : une boîte de dialogue interrompt le parcours. Utilisez details pour une information optionnelle et dialog pour une décision ou une interaction courte.'),
      liens({ label: 'MDN — dialog', url: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/dialog' }, { label: 'MDN — details', url: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/details' })
    ], associes: ['html-semantique', 'html-formulaires', 'dom-evenements']
  }),
  fiche({
    id: 'css-container-queries', domaine: 'css', categorie: 'Mise en page', titre: 'Container queries',
    resume: 'Adapter un composant à la largeur de son conteneur plutôt qu’à celle de la fenêtre.',
    tags: ['container-type', 'container', 'container query', 'responsive', 'composant'],
    sections: [
      texte('Pourquoi changer de repère ?', 'Une media query observe la fenêtre. Un composant peut pourtant être placé dans une colonne, une sidebar ou une grille. Une container query permet au composant de réagir à l’espace réellement disponible et le rend plus réutilisable.'),
      code('Déclarer le conteneur', 'CSS', '.dashboard-card-list {\n  container-type: inline-size;\n  container-name: cards;\n}\n\n.card { display: grid; gap: 1rem; }\n\n@container cards (min-width: 32rem) {\n  .card {\n    grid-template-columns: 8rem 1fr;\n    align-items: center;\n  }\n}'),
      decomposition('À lire dans l’exemple', [
        { terme: 'container-type', explication: 'indique que la taille sur l’axe inline peut être interrogée.' },
        { terme: 'container-name', explication: 'donne un nom optionnel pour cibler le bon conteneur.' },
        { terme: '@container', explication: 'applique des règles lorsque la condition du conteneur est satisfaite.' }
      ]),
      alerte('erreur', 'Le conteneur doit exister', 'Une @container ne regarde pas automatiquement un parent quelconque. Déclarez container-type sur l’ancêtre dont la largeur doit piloter le composant, puis vérifiez la hiérarchie dans DevTools.'),
      liens({ label: 'MDN — CSS container queries', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries' })
    ], associes: ['css-grid', 'css-responsive', 'css-variables']
  }),
  fiche({
    id: 'js-destructuration-avancee', domaine: 'javascript', categorie: 'Syntaxe moderne', titre: 'Destructuration, rest et spread',
    resume: 'Extraire des valeurs, renommer des propriétés et composer des objets sans perdre l’intention du code.',
    tags: ['destructuring', 'rest', 'spread', 'paramètres', 'objet', 'tableau'],
    sections: [
      texte('Extraire sans répéter', 'La destructuration crée des liaisons à partir d’un tableau ou d’un objet. Elle améliore la lisibilité lorsque l’objet est déjà le vocabulaire naturel de la fonction.'),
      code('Objets et tableaux', 'JavaScript', 'const profil = { nom: "Ada", ville: "Londres", role: "ingénieure" };\nconst { nom, role: metier = "développeuse" } = profil;\n\nconst couleurs = ["vert", "bleu", "orange"];\nconst [primaire, secondaire, ...autres] = couleurs;\n\nconst copie = { ...profil, actif: true };\nconst sansVille = (({ ville, ...reste }) => reste)(profil);'),
      comparaison('Choisir une forme', ['Syntaxe', 'Produit', 'Attention'], [
        ['{ nom } = objet', 'Valeur d’une propriété', 'Le nom doit correspondre ou être renommé'],
        ['[premier] = tableau', 'Valeur par position', 'Une position absente donne undefined'],
        ['{ ...objet }', 'Copie superficielle', 'Les objets imbriqués restent partagés'],
        ['(...valeurs)', 'Paramètres rest', 'Doit être le dernier paramètre']
      ]),
      alerte('erreur', 'Valeur par défaut', 'Une valeur par défaut est utilisée pour undefined, pas pour null. Si null est possible, validez explicitement la donnée avant de la destructurer comme si elle existait.'),
      liens({ label: 'MDN — Destructuring assignment', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment' })
    ], associes: ['js-variables', 'js-objets', 'js-fonctions']
  }),
  fiche({
    id: 'js-regexp-pratique', domaine: 'javascript', categorie: 'Texte', titre: 'Expressions régulières sans magie',
    resume: 'Rechercher un motif, extraire une information et valider une forme sans transformer une regex en boîte noire.',
    tags: ['regex', 'regexp', 'match', 'test', 'replace', 'validation'], niveau: 'Intermédiaire',
    sections: [
      texte('Un langage de motifs', 'Une expression régulière décrit une forme de texte. Elle est utile pour repérer ou extraire, mais elle ne remplace pas une vraie analyse de format complexe. Commencez par un motif petit et testez ses cas limites.'),
      code('Rechercher et extraire', 'JavaScript', 'const texte = "Contact : ada@example.com ou grace@example.org";\nconst email = /[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w+/g;\n\ntexte.match(email); // ["ada@example.com", "grace@example.org"]\n/^#[0-9a-f]{6}$/i.test("#0f766e"); // true\n\nconst date = "2026-10-01".replace(/^(\\\\d{4})-(\\\\d{2})-(\\\\d{2})$/, "$3/$2/$1");'),
      decomposition('Quelques symboles', [
        { terme: '^ et $', explication: 'ancrent le motif au début et à la fin de la chaîne.' },
        { terme: '\\\\d et \\\\w', explication: 'représentent un chiffre et un caractère de mot ; vérifiez les besoins Unicode.' },
        { terme: '* + ?', explication: 'indiquent des quantités ; ? rend notamment la répétition non-gourmande.' },
        { terme: '(...)', explication: 'capture un groupe, utile pour extraire ou réutiliser une partie.' }
      ]),
      alerte('bonne-pratique', 'Validation côté serveur', 'Une regex dans le navigateur améliore le confort, pas la sécurité. Toute donnée provenant du client doit être validée et normalisée côté serveur avant d’être utilisée.'),
      liens({ label: 'MDN — RegExp', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/RegExp' })
    ], associes: ['js-types', 'js-erreurs', 'js-objets']
  }),
  fiche({
    id: 'dom-mutation-observer', domaine: 'dom', categorie: 'Observation', titre: 'Observer les changements du DOM',
    resume: 'Réagir à l’ajout, la suppression ou la modification d’un nœud avec MutationObserver.',
    tags: ['MutationObserver', 'DOM', 'observer', 'asynchrone', 'attribut'], niveau: 'Intermédiaire',
    sections: [
      texte('Observer plutôt que deviner', 'MutationObserver reçoit un lot de changements après la mise à jour du DOM. Il est utile lorsqu’un autre code modifie une zone que vous ne contrôlez pas, mais il ne doit pas remplacer un événement explicite quand celui-ci existe.'),
      code('Surveiller une liste', 'JavaScript', 'const liste = document.querySelector("#notifications");\nconst observer = new MutationObserver((mutations) => {\n  console.log(String(mutations.length) + " mutation(s)");\n});\n\nobserver.observe(liste, {\n  childList: true,\n  subtree: true,\n  attributes: true\n});\n\n// À appeler lorsque le composant est démonté.\n// observer.disconnect();'),
      liste('Options utiles', ['childList observe l’ajout et la suppression d’enfants.', 'subtree inclut tous les descendants.', 'attributes observe les attributs.', 'attributeFilter limite les attributs suivis et évite du travail inutile.']),
      alerte('attention', 'Éviter la boucle', 'Si le callback modifie la même zone qu’il observe, il peut provoquer de nouvelles mutations. Comparez l’état avant d’écrire et déconnectez l’observateur lors de la destruction du composant.'),
      liens({ label: 'MDN — MutationObserver', url: 'https://developer.mozilla.org/fr/docs/Web/API/MutationObserver' })
    ], associes: ['dom-selection', 'dom-modification', 'dom-evenements']
  }),
  fiche({
    id: 'node-streams', domaine: 'node', categorie: 'Asynchrone', titre: 'Lire de gros fichiers avec les streams',
    resume: 'Traiter un flux par morceaux pour éviter de charger toute une donnée en mémoire.',
    tags: ['stream', 'createReadStream', 'pipe', 'backpressure', 'fichier'], niveau: 'Intermédiaire',
    sections: [
      texte('Un flux au lieu d’un bloc', 'readFile charge tout le contenu avant de rendre la main. Un Readable transmet des morceaux au fur et à mesure. Le consommateur peut ralentir la production : cette coordination est la backpressure.'),
      code('Compter les lignes progressivement', 'Node.js', 'const { createReadStream } = require("node:fs");\nconst { createInterface } = require("node:readline");\n\nconst entree = createReadStream("./journal.log", { encoding: "utf8" });\nconst lignes = createInterface({ input: entree, crlfDelay: Infinity });\nlet total = 0;\n\nlignes.on("line", (ligne) => {\n  if (ligne.includes("ERROR")) total += 1;\n});\nlignes.on("close", () => console.log(String(total) + " erreur(s)"));'),
      code('Relier deux flux', 'Node.js', 'const { createReadStream, createWriteStream } = require("node:fs");\n\ncreateReadStream("./source.txt")\n  .pipe(createWriteStream("./copie.txt"))\n  .on("finish", () => console.log("Copie terminée"));'),
      alerte('erreur', 'Ne pas ignorer les erreurs', 'Un pipe mal surveillé peut échouer silencieusement. Ajoutez des écouteurs error ou utilisez pipeline() pour propager proprement les erreurs et fermer les flux liés.'),
      liens({ label: 'Node.js — Streams', url: 'https://nodejs.org/api/stream.html' }, { label: 'Node.js — stream.pipeline', url: 'https://nodejs.org/api/stream.html#streampipeline' })
    ], associes: ['node-fs', 'node-events', 'js-promises']
  }),
  fiche({
    id: 'http-cache-etag', domaine: 'http', categorie: 'Performance', titre: 'Cache-Control et ETag',
    resume: 'Réduire les transferts en demandant au client de réutiliser ou revalider une représentation.',
    tags: ['cache', 'cache-control', 'etag', 'if-none-match', '304', 'http'], niveau: 'Intermédiaire',
    sections: [
      texte('Deux décisions différentes', 'Cache-Control indique combien de temps une réponse peut être réutilisée. ETag identifie une version de la représentation : le client peut la revalider avec If-None-Match et recevoir 304 Not Modified sans nouveau corps.'),
      code('Réponse cacheable', 'HTTP', 'HTTP/1.1 200 OK\nCache-Control: public, max-age=300\nETag: "livres-v7"\nContent-Type: application/json\n\n[{"id":1,"titre":"Le Web"}]\n\nGET /api/livres HTTP/1.1\nIf-None-Match: "livres-v7"\n\nHTTP/1.1 304 Not Modified'),
      comparaison('Choisir une directive', ['Directive', 'Effet', 'Cas courant'], [
        ['max-age=300', 'Réutiliser pendant 5 minutes', 'Donnée acceptablement fraîche'],
        ['no-cache', 'Revalider avant réutilisation', 'Donnée dynamique'],
        ['no-store', 'Ne rien conserver', 'Réponse sensible'],
        ['immutable', 'Ne pas revalider pendant la durée', 'Fichier versionné par hash']
      ]),
      alerte('attention', 'Vary compte', 'Si la réponse dépend de Accept-Encoding, Authorization ou d’une autre requête, Vary doit le signaler aux caches. Un cache mal configuré peut servir la réponse d’un autre contexte.'),
      liens({ label: 'MDN — HTTP caching', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching' })
    ], associes: ['http-requete-reponse', 'http-headers-cors', 'http-status']
  }),
  fiche({
    id: 'typescript-types-utilitaires', domaine: 'typescript', categorie: 'Types avancés', titre: 'Types utilitaires TypeScript',
    resume: 'Construire une variante d’un type avec Partial, Pick, Omit et Record sans recopier sa définition.',
    tags: ['Partial', 'Pick', 'Omit', 'Record', 'TypeScript', 'types'], niveau: 'Intermédiaire',
    sections: [
      texte('Réutiliser la forme, changer l’intention', 'Les types utilitaires transforment un type existant. Ils sont utiles pour distinguer une donnée complète, une mise à jour partielle et une projection destinée à l’interface.'),
      code('Quatre transformations', 'TypeScript', 'type Utilisateur = {\n  id: string;\n  nom: string;\n  email: string;\n  actif: boolean;\n};\n\ntype MiseAJour = Partial<Utilisateur>;\ntype ProfilPublic = Pick<Utilisateur, "nom" | "actif">;\ntype SansEmail = Omit<Utilisateur, "email">;\ntype Libelles = Record<"nom" | "email", string>;'),
      comparaison('Quand les utiliser', ['Type', 'Résultat'], [['Partial<T>', 'Toutes les propriétés deviennent optionnelles'], ['Pick<T, K>', 'Garde uniquement les clés K'], ['Omit<T, K>', 'Retire les clés K'], ['Record<K, V>', 'Associe chaque clé K à une valeur V']]),
      alerte('erreur', 'TypeScript ne valide pas le JSON à l’exécution', 'Les types disparaissent au runtime. Une API externe peut encore envoyer une chaîne là où le type annonce un nombre : gardez une validation d’exécution à la frontière.'),
      liens({ label: 'TypeScript — Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' })
    ], associes: ['typescript-types', 'typescript-narrowing', 'typescript-generiques']
  })
];
