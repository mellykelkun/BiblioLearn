'use strict';

function ajouterDuree(duree, supplement = 15) {
  const correspondance = String(duree || '').match(/(\d+)\s*min/);
  return correspondance ? `${Number(correspondance[1]) + supplement} min` : duree;
}

function enrichirEtapes(etapes) {
  return [...etapes, {
    titre: 'Débrief et transfert',
    explication: 'Après la validation, suivez la donnée de bout en bout : qui la produit, quel type elle a, où elle est validée, comment elle est transformée, où elle est transmise ou stockée et quel message apparaît en cas d’échec. Écrivez ensuite la décision prise, le cas dans lequel elle serait mauvaise et la variante à tester dans votre propre infrastructure.',
    langage: 'Markdown',
    code: '# Contrat de donnée\n- Entrée et type :\n- Validation :\n- Transformation :\n- Sortie et transport :\n- Donnée sensible à exclure :\n- Infrastructure : local / navigateur / serveur / CI\n- Variante à essayer ensuite :'
  }];
}

function atelier({ id, titre, domaine, niveau = 'Débutant', duree, objectif, outils = [], prerequis = [], structure = [], etapes = [], validation = [], indice, associes = [] }) {
  return { id, titre, domaine, niveau, duree: ajouterDuree(duree), objectif, outils, prerequis, structure, etapes: enrichirEtapes(etapes), validation, indice, associes };
}

module.exports = [
  atelier({
    id: 'atelier-carte-html-css', titre: 'Construire une carte de profil accessible', domaine: 'html', duree: '35 min',
    objectif: 'Créer un composant réutilisable avec un HTML sémantique, une image accessible et un CSS responsive.',
    outils: ['Éditeur de code', 'Navigateur', 'DevTools'], prerequis: ['Balises sémantiques', 'class et id', 'Box model et Flexbox'],
    structure: ['card.html', 'card.css', 'images/avatar.svg'],
    etapes: [
      { titre: 'Créer le squelette', explication: 'Commencez par le sens : une carte autonome est un article, son nom est un h2 et le lien décrit l’action.', langage: 'HTML', code: '<article class="profile-card">\n  <img src="images/avatar.svg" alt="Portrait de Samira" width="96" height="96">\n  <div class="profile-card__content">\n    <p class="profile-card__role">Développeuse frontend</p>\n    <h2>Samira Diallo</h2>\n    <p>Je transforme des idées en interfaces lisibles.</p>\n    <a class="profile-card__link" href="mailto:samira@example.com">Contacter Samira</a>\n  </div>\n</article>' },
      { titre: 'Mettre en page sans style inline', explication: 'Utilisez une classe pour pouvoir réutiliser le composant et réduire les surprises de cascade.', langage: 'CSS', code: '.profile-card {\n  display: flex;\n  gap: 1rem;\n  align-items: flex-start;\n  max-width: 32rem;\n  padding: 1.25rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 1rem;\n  background: #ffffff;\n}\n\n.profile-card__link { color: #0f766e; font-weight: 700; }\n.profile-card__link:hover { color: #115e59; }\n\n@media (max-width:  thirtyrem) {\n  .profile-card { flex-direction: column; }\n}' },
      { titre: 'Tester', explication: 'Réduisez la fenêtre, utilisez Tab et vérifiez que le texte alternatif et le focus restent compréhensibles.', langage: 'Bash', code: 'npm run check\n# Puis ouvrez card.html dans le navigateur' }
    ],
    validation: ['La carte reste lisible sous 480 px.', 'Le lien est atteignable au clavier et visible au focus.', 'Aucun style n’est écrit dans les attributs HTML.', 'L’image possède un alt utile.'],
    indice: 'La valeur CSS 30rem est correcte : en CSS, rem s’écrit avec un nombre, pas avec le mot “thirty”. Corrigez la media query en max-width: 30rem.',
    associes: ['html-semantique', 'html-liens-images', 'css-flexbox', 'css-responsive']
  }),
  atelier({
    id: 'atelier-dom-toggle', titre: 'Ajouter un bouton de thème avec le DOM', domaine: 'dom', duree: '30 min',
    objectif: 'Relier un bouton à une classe CSS avec addEventListener et afficher un état compréhensible.',
    outils: ['Éditeur de code', 'Navigateur', 'Console DevTools'], prerequis: ['querySelector', 'classList', 'addEventListener'],
    structure: ['index.html', 'styles.css', 'app.js'],
    etapes: [
      { titre: 'Préparer le HTML', explication: 'Le bouton doit annoncer son action ; aria-pressed expose l’état aux technologies d’assistance.', langage: 'HTML', code: '<button id="theme-toggle" type="button" aria-pressed="false">Activer le contraste</button>\n<article class="card">\n  <h1>Ma première carte interactive</h1>\n  <p>Le JavaScript ne remplace pas la structure HTML.</p>\n</article>' },
      { titre: 'Écrire le comportement', explication: 'On lit l’état actuel, on inverse une classe et on synchronise le texte et aria-pressed.', langage: 'JavaScript', code: 'const bouton = document.querySelector("#theme-toggle");\n\nbouton.addEventListener("click", () => {\n  const actif = document.body.classList.toggle("contraste-eleve");\n  bouton.setAttribute("aria-pressed", String(actif));\n  bouton.textContent = actif ? "Désactiver le contraste" : "Activer le contraste";\n});' },
      { titre: 'Observer', explication: 'Inspectez body après un clic. Vous devez voir la classe apparaître puis disparaître.', langage: 'Bash', code: 'node --check app.js\n# Ouvrir index.html puis cliquer deux fois' }
    ],
    validation: ['Le clic modifie réellement l’apparence.', 'Le texte et aria-pressed indiquent le même état.', 'La console ne montre aucune erreur.', 'Le bouton fonctionne au clavier.'],
    indice: 'classList.toggle renvoie un booléen : true si la classe vient d’être ajoutée, false si elle vient d’être retirée.',
    associes: ['dom-selection', 'dom-evenements', 'css-selecteurs']
  }),
  atelier({
    id: 'atelier-recherche-locale', titre: 'Créer une recherche locale de fiches', domaine: 'javascript', duree: '45 min',
    objectif: 'Filtrer un tableau d’objets et afficher un état vide sans serveur ni base de données.',
    outils: ['Éditeur de code', 'Navigateur', 'DevTools'], prerequis: ['Tableaux', 'filter', 'includes', 'DOM'],
    structure: ['index.html', 'app.js'],
    etapes: [
      { titre: 'Définir les données', explication: 'Un tableau local suffit pour une première version ; chaque objet possède un titre et des tags.', langage: 'JavaScript', code: 'const fiches = [\n  { titre: "Array.prototype.map", tags: "tableau transformation" },\n  { titre: "document.querySelector", tags: "dom selection" },\n  { titre: "npm ci", tags: "node dependances" }\n];' },
      { titre: 'Filtrer sans casser les accents', explication: 'Normalisez la saisie et le texte avant includes. Affichez un message si le filtre ne trouve rien.', langage: 'JavaScript', code: 'function normaliser(texte) {\n  return texte.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();\n}\n\nfunction rechercher(terme) {\n  const recherche = normaliser(terme.trim());\n  return fiches.filter((fiche) =>\n    normaliser(`${fiche.titre} ${fiche.tags}`).includes(recherche)\n  );\n}' },
      { titre: 'Relier à l’interface', explication: 'Écoutez input plutôt que keyup : cela couvre clavier, collage et outils d’accessibilité.', langage: 'JavaScript', code: 'champ.addEventListener("input", (event) => {\n  const resultats = rechercher(event.target.value);\n  liste.innerHTML = resultats.length\n    ? resultats.map((fiche) => `<li>${fiche.titre}</li>`).join("")\n    : "<li>Aucun résultat</li>";\n});' }
    ],
    validation: ['Une recherche sur map trouve la première fiche.', 'Une recherche accentuée fonctionne.', 'Un résultat vide est expliqué.', 'Le rendu est mis à jour sans rechargement.'],
    indice: 'Ne comparez pas seulement fiche.titre : concaténez les champs recherchables puis normalisez une seule fois.',
    associes: ['js-map-filter-reduce', 'dom-selection', 'dom-evenements']
  }),
  atelier({
    id: 'atelier-node-server', titre: 'Lancer un serveur Node et une route de santé', domaine: 'node', duree: '35 min',
    objectif: 'Comprendre le port, la requête et la réponse en créant un endpoint vérifiable avec curl.',
    outils: ['Node.js LTS', 'Terminal', 'curl'], prerequis: ['node --version', 'modules', 'HTTP'],
    structure: ['package.json', 'server.js'],
    etapes: [
      { titre: 'Initialiser le projet', explication: 'Le package.json mémorise les scripts et les dépendances.', langage: 'Bash', code: 'mkdir serveur-sante && cd serveur-sante\nnpm init -y\nnpm install express\nnpm pkg set scripts.start="node server.js"' },
      { titre: 'Créer la route', explication: 'Express transforme une fonction JavaScript en serveur HTTP lisible.', langage: 'JavaScript', code: 'const express = require("express");\nconst app = express();\nconst port = process.env.PORT || 3000;\n\napp.get("/api/sante", (req, res) => {\n  res.json({ statut: "ok", heure: new Date().toISOString() });\n});\n\napp.listen(port, () => {\n  console.log(`Serveur sur http://localhost:${port}`);\n});' },
      { titre: 'Démarrer et vérifier', explication: 'Le terminal qui exécute le serveur reste occupé. Ctrl+C l’arrête.', langage: 'Bash', code: 'npm start\n# Dans un second terminal :\ncurl -i http://localhost:3000/api/sante' }
    ],
    validation: ['La réponse HTTP est 200.', 'Le Content-Type est application/json.', 'Ctrl+C arrête le processus.', 'Le port peut être changé avec PORT=3100 npm start.'],
    indice: 'Si curl reçoit ECONNREFUSED, le serveur n’est pas démarré ou le port demandé n’est pas celui affiché dans le premier terminal.',
    associes: ['node-runtime', 'express-routes', 'http-requete-reponse', 'shell-curl']
  }),
  atelier({
    id: 'atelier-express-json', titre: 'Créer une API JSON avec validation minimale', domaine: 'express', duree: '50 min',
    objectif: 'Recevoir du JSON, vérifier un champ obligatoire et renvoyer des statuts HTTP explicites.',
    outils: ['Node.js LTS', 'Express', 'curl', 'Éditeur de code'], prerequis: ['app.use', 'express.json', 'GET / POST'],
    structure: ['server.js', 'package.json'],
    etapes: [
      { titre: 'Activer le parseur JSON', explication: 'Sans ce middleware, req.body reste souvent undefined pour une requête JSON.', langage: 'JavaScript', code: 'const express = require("express");\nconst app = express();\napp.use(express.json());\nconst notes = [];\n\napp.post("/api/notes", (req, res) => {\n  if (typeof req.body.titre !== "string" || !req.body.titre.trim()) {\n    return res.status(400).json({ erreur: "titre requis" });\n  }\n  const note = { id: notes.length + 1, titre: req.body.titre.trim() };\n  notes.push(note);\n  res.status(201).json(note);\n});' },
      { titre: 'Tester les deux chemins', explication: 'Une requête valide et une requête invalide doivent produire deux réponses différentes.', langage: 'Bash', code: 'curl -X POST http://localhost:3000/api/notes \\\n  -H "Content-Type: application/json" \\\n  -d \'{"titre":"Réviser Express"}\'\n\ncurl -i -X POST http://localhost:3000/api/notes \\\n  -H "Content-Type: application/json" \\\n  -d \'{}\'' },
      { titre: 'Ajouter une lecture', explication: 'Exposez GET /api/notes pour observer les données conservées en mémoire.', langage: 'JavaScript', code: 'app.get("/api/notes", (req, res) => {\n  res.json({ donnees: notes });\n});' }
    ],
    validation: ['POST valide retourne 201.', 'POST sans titre retourne 400.', 'GET retourne un JSON lisible.', 'Le serveur ne plante pas sur un corps invalide.'],
    indice: 'Le return devant res.status(...).json(...) évite de continuer la fonction et d’envoyer une seconde réponse.',
    associes: ['express-donnees', 'express-routes', 'http-methodes', 'shell-curl']
  }),
  atelier({
    id: 'atelier-npm-package', titre: 'Publier une petite commande locale avec npm', domaine: 'npm', duree: '45 min',
    objectif: 'Créer un package privé local avec une commande bin et comprendre le lien entre script et exécutable.',
    outils: ['Node.js LTS', 'npm', 'Terminal'], prerequis: ['npm init', 'package.json', 'module.exports'],
    structure: ['bonjour-cli/package.json', 'bonjour-cli/index.js'],
    etapes: [
      { titre: 'Créer le package', explication: 'Un package commence par un nom, une version et un point d’entrée.', langage: 'Bash', code: 'mkdir bonjour-cli && cd bonjour-cli\nnpm init -y\nnpm pkg set name="bonjour-cli-local"\nnpm pkg set bin.bonjour="index.js"' },
      { titre: 'Écrire l’exécutable', explication: 'Le shebang permet à npm de lancer Node quand la commande est installée.', langage: 'JavaScript', code: '#!/usr/bin/env node\n\nconst nom = process.argv[2] || "développeur";\nconsole.log(`Bonjour ${nom} !`);' },
      { titre: 'Tester sans publier', explication: 'npm link crée un lien local vers le package, utile uniquement pour l’exercice.', langage: 'Bash', code: 'chmod +x index.js\nnpm link\nbonjour Ada\nnpm unlink -g bonjour-cli-local' }
    ],
    validation: ['bonjour Ada affiche un message.', 'La commande fonctionne depuis un autre dossier.', 'npm unlink retire le lien global.', 'Aucun package n’est publié par accident.'],
    indice: 'Le nom placé dans bin est la commande à taper. Le nom du package et le nom de la commande peuvent être différents.',
    associes: ['npm-init-install', 'npm-scripts', 'shell-permissions']
  }),
  atelier({
    id: 'atelier-shell-organiser', titre: 'Organiser un dossier de notes avec le shell', domaine: 'shell', duree: '25 min',
    objectif: 'Pratiquer pwd, mkdir, touch, mv, cp, find et grep dans un scénario concret et réversible.',
    outils: ['Terminal Bash ou Zsh'], prerequis: ['Navigation', 'fichiers', 'recherche'],
    structure: ['notes-web/html.md', 'notes-web/css.md', 'notes-web/archive/'],
    etapes: [
      { titre: 'Créer uniquement dans un bac à sable', explication: 'Travaillez dans un dossier d’exercice explicite pour éviter toute suppression involontaire.', langage: 'Bash', code: 'mkdir -p ~/bibliolearn-exercices/notes-web/archive\ncd ~/bibliolearn-exercices/notes-web\ntouch html.md css.md\npwd && ls -la' },
      { titre: 'Classer et rechercher', explication: 'Déplacez une note, copiez l’autre, puis recherchez un mot dans les fichiers.', langage: 'Bash', code: 'mv css.md archive/css-historique.md\ncp html.md archive/html-copie.md\nprintf "DOM et balises\n" > html.md\ngrep -R "DOM" .\nfind . -type f -name "*.md"' },
      { titre: 'Nettoyer sans risque', explication: 'Vérifiez la liste avant d’effacer le bac à sable complet.', langage: 'Bash', code: 'find . -maxdepth 3 -type f -print\n# Quand tout est vérifié :\ncd ..\nrm -r notes-web' }
    ],
    validation: ['Vous pouvez expliquer le chemin de chaque fichier.', 'grep trouve DOM.', 'find liste trois fichiers Markdown.', 'La suppression reste limitée au bac à sable.'],
    indice: 'Le dernier rm vise notes-web depuis ~/bibliolearn-exercices, pas votre dossier projet. Relancez pwd avant cette étape.',
    associes: ['shell-pwd-ls-cd', 'shell-mkdir-touch', 'shell-cp-mv-rm', 'shell-grep-rg-find']
  }),
  atelier({
    id: 'atelier-api-fetch', titre: 'Afficher une API avec fetch et états d’interface', domaine: 'javascript', duree: '45 min',
    objectif: 'Construire une interface qui distingue chargement, réussite et erreur au lieu de laisser l’utilisateur deviner.',
    outils: ['Navigateur', 'DevTools', 'Node.js', 'Terminal'], prerequis: ['Promise', 'async/await', 'fetch', 'DOM'],
    structure: ['package.json', 'server.js', 'index.html', 'app.js', 'styles.css'],
    etapes: [
      { titre: 'Préparer les zones d’état', explication: 'Le kit de départ donne les cinq fichiers complets. Le serveur sert la page et l’API sous la même origine : ouvrez http://localhost:3000/index.html, pas le fichier directement.', langage: 'HTML', code: '<button id="charger" type="button">Charger les notes</button>\n<p id="etat" role="status"></p>\n<ul id="liste-notes"></ul>' },
      { titre: 'Charger avec async/await', explication: 'Dans app.js, vérifiez response.ok : fetch ne rejette pas automatiquement une réponse HTTP 404 ou 500. Le DOM reçoit du texte, pas du HTML fabriqué avec une valeur distante.', langage: 'JavaScript', code: 'const reponse = await fetch("/api/notes");\nif (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);\nconst resultat = await reponse.json();\n// Créez un <li> pour chaque note avec textContent.' },
      { titre: 'Tester une panne', explication: 'Lancez le serveur, ouvrez la page, puis arrêtez le processus et recliquez. Une erreur expliquée vaut mieux qu’une interface silencieuse.', langage: 'Bash', code: 'npm install\nnpm start\n# Ouvrez http://localhost:3000/index.html\n# Ctrl+C puis cliquez de nouveau : la panne réseau est annoncée.' }
    ],
    validation: ['Le chargement est annoncé.', 'Une réponse HTTP non-OK est traitée.', 'Une panne affiche une explication.', 'Le contenu reçu est rendu sans recharger la page.'],
    indice: 'response.ok vaut false pour les statuts 400/500 ; utilisez throw new Error avant response.json().',
    associes: ['js-fetch', 'js-promises', 'dom-evenements', 'express-donnees']
  }),
  atelier({
    id: 'atelier-git-cycle', titre: 'Faire un premier commit propre', domaine: 'shell', duree: '30 min',
    objectif: 'Créer un historique lisible sans ajouter node_modules ni secrets.',
    outils: ['Git', 'Terminal', 'Éditeur de code'], prerequis: ['git status', 'staging', '.gitignore'],
    structure: ['.gitignore', 'README.md', 'package.json'],
    etapes: [
      { titre: 'Initialiser et ignorer', explication: 'Le dépôt doit savoir quels fichiers locaux ne doivent jamais entrer dans l’historique.', langage: 'Bash', code: 'git init\nprintf "node_modules/\\n.env\\n.DS_Store\\n" > .gitignore\necho "# Mon exercice" > README.md\ngit status' },
      { titre: 'Inspecter le staging', explication: 'Ajoutez par petits groupes puis lisez le diff avant de valider.', langage: 'Bash', code: 'git add .gitignore README.md\ngit diff --cached\ngit commit -m "Initialiser l exercice"' },
      { titre: 'Relire l’historique', explication: 'Un commit est un point de retour. Son message doit dire ce qui a changé.', langage: 'Bash', code: 'git log --oneline --decorate\ngit status' }
    ],
    validation: ['git status est propre après le commit.', 'node_modules et .env sont ignorés.', 'Le diff staged a été lu avant commit.', 'Le message décrit l’action réalisée.'],
    indice: 'git check-ignore -v .env node_modules/express/index.js permet de vérifier quelle règle ignore chaque chemin.',
    associes: ['git-cycle', 'shell-env-path', 'npm-ci-lockfile']
  })
];
