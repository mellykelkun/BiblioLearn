'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'shell-terminal', domaine: 'shell', categorie: 'Fondamentaux', titre: 'Terminal, shell et dossier courant',
    resume: 'Comprendre l’endroit où une commande s’exécute et comment lire le résultat affiché.',
    tags: ['terminal', 'shell', 'bash', 'zsh', 'invite', 'commande'],
    sections: [
      texte('Idée simple', 'Le terminal est la fenêtre dans laquelle vous écrivez. Le shell est le programme qui lit votre texte et lance les commandes. Bash et Zsh sont deux shells courants. Une commande agit toujours depuis un dossier courant.'),
      code('Lire une invite', 'Bash', 'arthur@ordinateur:~/projet$ pwd\n/home/arthur/projet\n\n# Le symbole $ indique que le shell attend une commande.', 'Le texte avant $ identifie souvent l’utilisateur et le dossier courant.'),
      decomposition('Ce que vous voyez', [
        { terme: 'pwd', explication: 'commande exécutée ; elle affiche le chemin du dossier courant.' },
        { terme: '~/projet', explication: '~ est un raccourci vers votre dossier personnel.' },
        { terme: 'sortie', explication: 'texte écrit par la commande ; il peut servir à vérifier ou enchaîner une étape.' }
      ]),
      alerte('erreur', 'Erreur fréquente', 'Copier le symbole $ dans la commande provoque souvent une erreur. Il représente l’invite, il ne fait pas partie de la commande.'),
      liens({ label: 'GNU Bash — manuel', url: 'https://www.gnu.org/software/bash/manual/' })
    ], associes: ['shell-pwd-ls-cd', 'shell-pipes-redirections', 'node-runtime']
  }),
  fiche({
    id: 'shell-pwd-ls-cd', domaine: 'shell', categorie: 'Navigation', titre: 'pwd, ls et cd : se déplacer',
    resume: 'Afficher le dossier courant, son contenu, puis entrer dans un autre dossier.',
    tags: ['pwd', 'ls', 'cd', 'dossier', 'répertoire'],
    sections: [
      code('Commandes de base', 'Bash', 'pwd                 # Où suis-je ?\nls                  # Que contient ce dossier ?\nls -la              # Inclure les fichiers cachés et les détails\ncd public           # Entrer dans public\ncd ..               # Remonter d’un niveau\ncd -                # Revenir au dossier précédent\ncd                  # Revenir au dossier personnel'),
      decomposition('Lire une commande', [
        { terme: 'ls', explication: 'programme principal : liste les fichiers.' },
        { terme: '-la', explication: 'options : -l demande le format détaillé et -a inclut les fichiers cachés.' },
        { terme: 'public', explication: 'argument : chemin relatif depuis le dossier courant.' },
        { terme: '..', explication: 'chemin spécial représentant le dossier parent.' }
      ]),
      texte('Chemins relatifs et absolus', 'public/app.js est relatif au dossier courant. /home/arthur/projet/public/app.js est absolu : il commence à la racine /. Utiliser pwd avant une opération importante évite de modifier le mauvais projet.'),
      alerte('bonne-pratique', 'Réflexe sûr', 'Avant rm, mv ou cp, faites pwd puis ls. Vous vérifiez ainsi la cible et le contenu réel.'),
      liens({ label: 'GNU Coreutils — ls', url: 'https://www.gnu.org/software/coreutils/manual/html_node/ls-invocation.html' })
    ], associes: ['shell-terminal', 'shell-mkdir-touch', 'shell-cp-mv-rm']
  }),
  fiche({
    id: 'shell-mkdir-touch', domaine: 'shell', categorie: 'Fichiers', titre: 'mkdir et touch : créer une structure',
    resume: 'Créer des dossiers et des fichiers vides pour préparer un exercice ou un projet.',
    tags: ['mkdir', 'touch', 'parents', 'fichier'],
    sections: [
      code('Créer un mini-projet', 'Bash', 'mkdir -p exercice-card/src exercice-card/public\ncd exercice-card\ntouch index.html styles.css README.md\ntouch src/app.js\nls -R', 'mkdir -p crée aussi les parents manquants ; touch crée un fichier vide ou met à jour sa date.'),
      decomposition('Options et arguments', [
        { terme: 'mkdir', explication: 'make directory : crée un dossier.' },
        { terme: '-p', explication: 'crée les dossiers parents nécessaires sans échouer s’ils existent déjà.' },
        { terme: 'src/app.js', explication: 'chemin du fichier ; le dossier src doit exister avant touch.' }
      ]),
      alerte('erreur', 'Erreur fréquente', 'mkdir src/app crée un dossier app, pas un fichier app. Pour un fichier, utilisez touch ou un éditeur.'),
      alerte('attention', 'Attention', 'touch ne crée pas les dossiers parents. mkdir -p src avant touch src/app.js.'),
      liens({ label: 'GNU Coreutils — mkdir', url: 'https://www.gnu.org/software/coreutils/manual/html_node/mkdir-invocation.html' })
    ], associes: ['shell-pwd-ls-cd', 'shell-cp-mv-rm']
  }),
  fiche({
    id: 'shell-cp-mv-rm', domaine: 'shell', categorie: 'Fichiers', titre: 'cp, mv et rm : copier, déplacer, supprimer',
    resume: 'Manipuler des fichiers avec des commandes puissantes à utiliser après vérification.',
    tags: ['cp', 'mv', 'rm', 'récursif', 'supprimer'],
    sections: [
      code('Exemples prudents', 'Bash', 'cp index.html sauvegarde.html       # Copier\nmv sauvegarde.html archives/          # Déplacer / renommer\ncp -r src src-copie                 # Copier un dossier\nrm brouillon.txt                    # Supprimer un fichier\nrm -r dossier-temporaire             # Supprimer un dossier et son contenu'),
      comparaison('Quelle commande choisir ?', ['Commande', 'Effet', 'Exemple'], [
        ['cp', 'Conserve la source et crée une copie', 'cp app.js app.bak.js'],
        ['mv', 'Déplace ou renomme', 'mv ancien.js nouveau.js'],
        ['rm', 'Supprime sans passer par une corbeille', 'rm fichier.txt']
      ]),
      alerte('attention', 'Commande destructive', 'rm ne demande pas toujours de confirmation et ne fournit pas de corbeille. Ne tapez jamais rm -rf sans avoir vérifié pwd et le chemin exact.'),
      alerte('bonne-pratique', 'Alternative plus sûre', 'Utilisez rm -i pour demander une confirmation fichier par fichier et préférez un gestionnaire de fichiers pour les suppressions incertaines.'),
      liens({ label: 'GNU Coreutils — cp, mv, rm', url: 'https://www.gnu.org/software/coreutils/manual/html_node/Basic-Operations.html' })
    ], associes: ['shell-pwd-ls-cd', 'shell-mkdir-touch', 'shell-permissions']
  }),
  fiche({
    id: 'shell-cat-less-head-tail', domaine: 'shell', categorie: 'Lecture', titre: 'cat, less, head et tail : lire sans ouvrir un éditeur',
    resume: 'Inspecter rapidement un fichier ou suivre un journal de serveur directement dans le terminal.',
    tags: ['cat', 'less', 'head', 'tail', 'logs'],
    sections: [
      code('Lire et suivre', 'Bash', 'cat package.json              # Afficher tout le fichier\nless package.json             # Lire avec défilement\nhead -n 20 server.log         # Voir les 20 premières lignes\ntail -n 20 server.log          # Voir les 20 dernières lignes\ntail -f server.log            # Suivre les nouvelles lignes en direct'),
      texte('Quand utiliser quoi', 'cat convient aux petits fichiers. less évite de remplir le terminal pour un gros fichier : appuyez sur q pour quitter. tail -f est utile pour observer les logs pendant qu’un serveur tourne ; Ctrl+C arrête le suivi.'),
      alerte('erreur', 'Fichier introuvable', 'Un chemin relatif est calculé depuis le dossier courant. Vérifiez pwd, puis ls, puis écrivez le chemin correctement.'),
      liens({ label: 'man7 — cat, less et tail', url: 'https://man7.org/linux/man-pages/man1/tail.1.html' })
    ], associes: ['shell-pwd-ls-cd', 'shell-grep-rg-find', 'node-process']
  }),
  fiche({
    id: 'shell-grep-rg-find', domaine: 'shell', categorie: 'Recherche', titre: 'grep, rg et find : retrouver une information',
    resume: 'Chercher un texte ou un fichier dans un projet sans parcourir chaque dossier à la main.',
    tags: ['grep', 'rg', 'ripgrep', 'find', 'recherche'],
    sections: [
      code('Rechercher dans un projet', 'Bash', 'grep -R "app.get" .              # grep récursif dans le dossier courant\nrg "addEventListener" src/        # ripgrep, rapide et lisible\nfind . -name "*.js" -type f        # trouver les fichiers JavaScript\nrg -n "TODO|FIXME" .               # afficher aussi les numéros de ligne'),
      decomposition('Décomposition de rg', [
        { terme: 'rg', explication: 'outil de recherche moderne (ripgrep), souvent installé séparément.' },
        { terme: '"addEventListener"', explication: 'motif recherché ; les guillemets protègent les espaces et caractères spéciaux.' },
        { terme: 'src/', explication: 'dossier limité à inspecter, au lieu de tout le projet.' },
        { terme: '-n', explication: 'option qui ajoute le numéro de ligne dans le résultat.' }
      ]),
      alerte('attention', 'Outil optionnel', 'rg n’est pas présent sur toutes les machines. grep et find sont plus universels ; installez ripgrep seulement si vous le souhaitez.'),
      liens({ label: 'ripgrep — guide', url: 'https://github.com/BurntSushi/ripgrep' }, { label: 'GNU grep', url: 'https://www.gnu.org/software/grep/manual/grep.html' })
    ], associes: ['shell-cat-less-head-tail', 'shell-pipes-redirections', 'git-cycle']
  }),
  fiche({
    id: 'shell-pipes-redirections', domaine: 'shell', categorie: 'Combiner', titre: 'Pipes, redirections et codes de sortie',
    resume: 'Relier des commandes et enregistrer leur résultat pour créer de petits workflows.',
    tags: ['pipe', 'redirection', 'stdin', 'stdout', '&&', '||'],
    sections: [
      code('Enchaîner des commandes', 'Bash', 'npm run check > verification.txt       # écrire la sortie dans un fichier\ncat package.json | grep "scripts"    # envoyer la sortie de cat à grep\nmkdir build && cd build                 # cd seulement si mkdir réussit\nnode app.js || echo "Le serveur a échoué" # action si erreur'),
      decomposition('Symboles essentiels', [
        { terme: '>', explication: 'redirige la sortie et remplace le fichier cible.' },
        { terme: '>>', explication: 'ajoute à la fin sans effacer le contenu existant.' },
        { terme: '|', explication: 'envoie la sortie standard d’une commande vers l’entrée de la suivante.' },
        { terme: '&& / ||', explication: 'exécute selon le code de sortie : succès ou échec.' }
      ]),
      texte('Code de sortie', 'Une commande termine généralement avec 0 en cas de réussite et une autre valeur en cas d’erreur. Le shell peut donc décider de continuer ou de lancer une solution de repli.'),
      alerte('erreur', 'Écraser un fichier', 'La redirection > remplace le contenu. Utilisez >> si vous voulez ajouter, ou vérifiez le nom du fichier avant d’exécuter.'),
      liens({ label: 'Bash — Pipelines', url: 'https://www.gnu.org/software/bash/manual/html_node/Pipelines.html' })
    ], associes: ['shell-grep-rg-find', 'shell-terminal', 'npm-cli-scripts']
  }),
  fiche({
    id: 'shell-permissions', domaine: 'shell', categorie: 'Système', titre: 'Permissions et exécution d’un script',
    resume: 'Comprendre pourquoi un fichier ne peut pas être exécuté et utiliser chmod avec mesure.',
    tags: ['chmod', 'permission', 'exécutable', './'],
    sections: [
      code('Créer et exécuter un script', 'Bash', `printf '#!/usr/bin/env bash\\necho "Bonjour"\\n' > bonjour.sh\nchmod +x bonjour.sh\n./bonjour.sh`, 'Le shebang choisit l’interpréteur ; chmod +x ajoute le droit d’exécution pour le propriétaire, le groupe et les autres.'),
      decomposition('Pourquoi ./bonjour.sh ?', [
        { terme: './', explication: 'indique explicitement le dossier courant. Pour des raisons de sécurité, il n’est pas toujours dans PATH.' },
        { terme: 'chmod +x', explication: 'modifie les permissions pour rendre le fichier exécutable.' },
        { terme: 'permission denied', explication: 'le système refuse l’exécution car le droit x manque ou le dossier n’est pas accessible.' }
      ]),
      alerte('attention', 'Éviter chmod 777', 'Donner tous les droits à tout le monde masque le problème et augmente les risques. Accorder seulement le droit nécessaire.'),
      liens({ label: 'GNU Coreutils — chmod', url: 'https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html' })
    ], associes: ['shell-terminal', 'node-cli-check-watch']
  }),
  fiche({
    id: 'shell-curl', domaine: 'shell', categorie: 'HTTP', titre: 'curl : tester une URL ou une API',
    resume: 'Envoyer une requête HTTP depuis le terminal pour vérifier un serveur sans interface graphique.',
    tags: ['curl', 'http', 'api', 'get', 'post', 'json'],
    sections: [
      code('Requêtes utiles', 'Bash', `curl http://localhost:3000/api/sante\ncurl -i https://example.com             # inclure les en-têtes HTTP\ncurl -X POST http://localhost:3000/api/notes \\\n  -H "Content-Type: application/json" \\\n  -d '{"titre":"Lire curl"}'`, 'La barre inversée permet de continuer la commande sur la ligne suivante dans Bash.'),
      decomposition('Décomposition d’une requête POST', [
        { terme: '-X POST', explication: 'choisit la méthode HTTP ; curl utilise GET par défaut.' },
        { terme: '-H', explication: 'ajoute un en-tête, ici le type des données envoyées.' },
        { terme: '-d', explication: 'envoie le corps de la requête, ici une chaîne JSON.' },
        { terme: 'URL', explication: 'adresse du serveur et du chemin API à tester.' }
      ]),
      alerte('erreur', 'Serveur inaccessible', 'ECONNREFUSED signifie souvent qu’aucun processus n’écoute sur le port. Lancez le serveur puis vérifiez le port et l’URL.'),
      liens({ label: 'curl — documentation', url: 'https://curl.se/docs/' }, { label: 'MDN — HTTP', url: 'https://developer.mozilla.org/fr/docs/Web/HTTP' })
    ], associes: ['http-requete-reponse', 'http-methodes', 'express-routes']
  }),
  fiche({
    id: 'shell-env-path', domaine: 'shell', categorie: 'Environnement', titre: 'Variables d’environnement et PATH',
    resume: 'Comprendre comment le shell trouve node, npm et vos autres programmes.',
    tags: ['env', 'PATH', 'export', 'variables', 'process.env'],
    sections: [
      code('Inspecter et définir', 'Bash', 'echo "$PATH"                    # Dossiers parcourus pour trouver une commande\nwhich node                       # Chemin du programme utilisé\nNODE_ENV=development node app.js # Variable pour une seule commande\nexport PORT=3000                 # Variable disponible aux commandes suivantes\necho "$PORT"'),
      texte('Lien avec Node.js', 'Dans Node, process.env.PORT lit la variable PORT fournie par le système. Cela évite d’écrire un secret ou un port directement dans le code. Les fichiers .env sont pratiques, mais ne doivent pas être commités s’ils contiennent des secrets.'),
      alerte('attention', 'Ne jamais publier les secrets', 'Ajoutez .env à .gitignore et fournissez un fichier .env.example sans valeur secrète pour expliquer les variables attendues.'),
      liens({ label: 'Node.js — process.env', url: 'https://nodejs.org/api/process.html#processenv' })
    ], associes: ['node-process', 'node-runtime', 'git-cycle']
  }),
  fiche({
    id: 'node-cli-check-watch', domaine: 'node', categorie: 'Commandes', titre: 'node : vérifier, exécuter et surveiller',
    resume: 'Utiliser la CLI Node.js pour connaître sa version, lancer un fichier et détecter les changements.',
    tags: ['node --version', 'node --check', 'node --watch', 'cli'],
    sections: [
      code('Commandes Node.js', 'Bash', 'node --version       # Version installée\nnpm --version        # Version de npm\nnode app.js          # Exécuter le fichier\nnode --check app.js  # Vérifier la syntaxe sans lancer le programme\nnode --watch app.js  # Relancer quand le fichier change\nnode                 # Ouvrir le REPL interactif'),
      decomposition('Deux commandes souvent confondues', [
        { terme: 'node app.js', explication: 'charge et exécute réellement le programme ; ses effets peuvent se produire.' },
        { terme: 'node --check app.js', explication: 'analyse la syntaxe seulement ; une erreur logique ne sera pas détectée.' },
        { terme: 'node --watch app.js', explication: 'redémarre le processus lorsque les fichiers suivis changent ; pratique en développement.' }
      ]),
      alerte('erreur', 'Version trop ancienne', 'Une option peut manquer selon la version de Node. Utilisez une version LTS récente et vérifiez node --version.'),
      liens({ label: 'Node.js — options CLI', url: 'https://nodejs.org/api/cli.html' })
    ], associes: ['node-runtime', 'npm-cli-scripts', 'shell-permissions']
  }),
  fiche({
    id: 'npm-init-install', domaine: 'npm', categorie: 'Démarrage', titre: 'npm init et npm install : préparer un projet',
    resume: 'Créer package.json, installer un package et distinguer dépendance d’exécution et outil de développement.',
    tags: ['npm init', 'npm install', 'dependencies', 'devDependencies', 'package.json'],
    sections: [
      code('Initialiser puis installer', 'Bash', 'mkdir mon-projet && cd mon-projet\nnpm init -y\nnpm install express\nnpm install --save-dev nodemon\nnpm install lodash@4.17.21', 'npm init -y crée un package.json avec des réponses par défaut. Les installations mettent à jour package.json et package-lock.json.'),
      decomposition('Où va chaque package ?', [
        { terme: 'npm install express', explication: 'ajoute express dans dependencies : le code en a besoin pour fonctionner.' },
        { terme: 'npm install --save-dev nodemon', explication: 'ajoute nodemon dans devDependencies : il aide pendant le développement.' },
        { terme: 'package-lock.json', explication: 'fige l’arbre exact des versions installées pour reproduire l’installation.' }
      ]),
      comparaison('dependencies ou devDependencies ?', ['Question', 'dependencies', 'devDependencies'], [
        ['Nécessaire en production ?', 'Oui', 'Non, généralement'],
        ['Exemples', 'express, zod', 'nodemon, eslint'],
        ['Commande', 'npm install package', 'npm install -D outil']
      ]),
      alerte('bonne-pratique', 'Bon réflexe', 'Commitez package.json et package-lock.json. Ne commitez pas node_modules : il est régénéré avec npm ci ou npm install.'),
      liens({ label: 'npm — install', url: 'https://docs.npmjs.com/cli/install/' }, { label: 'npm — package.json', url: 'https://docs.npmjs.com/cli/v11/configuring-npm/package-json' })
    ], associes: ['npm-cli-scripts', 'npm-ci-lockfile', 'node-cli-check-watch']
  }),
  fiche({
    id: 'npm-cli-scripts', domaine: 'npm', categorie: 'Workflow', titre: 'npm scripts et npx : lancer les outils du projet',
    resume: 'Créer des commandes courtes et reproductibles dans package.json sans dépendre d’installations globales.',
    tags: ['scripts', 'npm run', 'npx', 'exec', 'nodemon'],
    sections: [
      code('package.json puis exécution', 'JSON', '"scripts": {\n  "dev": "nodemon server.js",\n  "start": "node server.js",\n  "check": "node --check server.js"\n}', 'Les commentaires ne sont pas autorisés dans JSON ; cette légende explique le rôle de chaque script.'),
      code('Commandes correspondantes', 'Bash', 'npm run dev\nnpm start\nnpm run check\nnpm exec nodemon server.js\nnpx cowsay "outil ponctuel"', 'npm start est un raccourci pour le script start. npx / npm exec exécute un binaire fourni par un package.'),
      decomposition('Pourquoi les scripts sont utiles', [
        { terme: 'nom stable', explication: 'toute l’équipe tape npm run check au lieu de mémoriser une longue commande.' },
        { terme: 'PATH local', explication: 'npm ajoute node_modules/.bin, donc la version du projet est utilisée.' },
        { terme: 'npx', explication: 'lance un binaire local ou, si nécessaire, une version temporaire ; vérifiez toujours le package utilisé.' }
      ]),
      alerte('erreur', 'Script inconnu', 'npm ERR! Missing script: dev signifie que dev n’existe pas dans package.json ou que vous n’êtes pas dans le bon dossier.'),
      liens({ label: 'npm — scripts', url: 'https://docs.npmjs.com/cli/v11/using-npm/scripts' }, { label: 'npm — exec', url: 'https://docs.npmjs.com/cli/npm-exec/' })
    ], associes: ['npm-init-install', 'npm-ci-lockfile', 'node-cli-check-watch']
  }),
  fiche({
    id: 'npm-ci-lockfile', domaine: 'npm', categorie: 'Reproductibilité', titre: 'npm ci, package-lock et installation propre',
    resume: 'Installer exactement les versions verrouillées, notamment en CI ou lors d’un déploiement.',
    tags: ['npm ci', 'lockfile', 'ci', 'node_modules'],
    sections: [
      code('Installation reproductible', 'Bash', 'git clone https://github.com/exemple/projet.git\ncd projet\nnpm ci\nnpm run check\nnpm start', 'npm ci part d’un package-lock.json existant et installe un arbre propre. Il échoue si package.json et le lockfile ne correspondent pas.'),
      comparaison('npm install ou npm ci ?', ['Situation', 'npm install', 'npm ci'], [
        ['Développement quotidien', 'Peut mettre à jour le lockfile', 'Possible mais plus strict'],
        ['CI / déploiement', 'Moins prévisible', 'Recommandé'],
        ['node_modules existant', 'Le réutilise souvent', 'Le supprime puis repart du lockfile']
      ]),
      alerte('erreur', 'Pas de lockfile', 'npm ci nécessite package-lock.json (ou un lockfile compatible). Lancez npm install une première fois puis committez le fichier.'),
      liens({ label: 'npm — ci', url: 'https://docs.npmjs.com/cli/commands/npm-ci/' })
    ], associes: ['npm-init-install', 'npm-cli-scripts', 'git-cycle']
  }),
  fiche({
    id: 'npm-update-outdated-audit', domaine: 'npm', categorie: 'Maintenance', titre: 'npm outdated, update et audit',
    resume: 'Observer les versions, mettre à jour avec prudence et repérer les vulnérabilités connues.',
    tags: ['outdated', 'update', 'audit', 'vulnerability'],
    sections: [
      code('Inspecter avant de modifier', 'Bash', 'npm outdated\nnpm audit\nnpm audit fix\nnpm update', 'Lisez le rapport avant d’accepter une mise à jour majeure. npm audit fix peut modifier le lockfile.'),
      decomposition('Lire la sortie', [
        { terme: 'wanted', explication: 'version la plus récente compatible avec les contraintes du package.json.' },
        { terme: 'latest', explication: 'version publiée la plus récente, potentiellement avec des changements majeurs.' },
        { terme: 'audit', explication: 'analyse des dépendances connues pour avoir une vulnérabilité signalée.' }
      ]),
      alerte('bonne-pratique', 'Mise à jour raisonnée', 'Mettez à jour une famille de packages à la fois, relancez les tests, lisez le changelog et committez le lockfile avec le changement.'),
      liens({ label: 'npm — audit', url: 'https://docs.npmjs.com/cli/audit.html/' }, { label: 'npm — outdated', url: 'https://docs.npmjs.com/cli/v11/commands/npm-outdated' })
    ], associes: ['npm-ci-lockfile', 'npm-init-install']
  }),
  fiche({
    id: 'git-cycle', domaine: 'shell', categorie: 'Git', titre: 'Cycle Git : init, status, add, commit, log',
    resume: 'Enregistrer des étapes compréhensibles et retrouver l’historique d’un projet.',
    tags: ['git', 'init', 'status', 'add', 'commit', 'log', 'versionnement'],
    sections: [
      code('Premier cycle local', 'Bash', 'git init\ngit status\ngit add package.json src/\ngit diff --cached\ngit commit -m "Initialiser le projet"\ngit log --oneline --decorate\ngit status', 'git add prépare une photographie (staging). git commit l’enregistre dans l’historique ; status reste votre boussole.'),
      decomposition('Les trois zones', [
        { terme: 'working tree', explication: 'fichiers que vous modifiez actuellement.' },
        { terme: 'staging area', explication: 'changements sélectionnés par git add pour le prochain commit.' },
        { terme: 'repository', explication: 'historique enregistré par les commits dans .git.' }
      ]),
      alerte('erreur', 'Commit trop large', 'Ajouter tout avec git add . peut inclure .env ou node_modules. Créez un .gitignore et vérifiez git status avant le commit.'),
      code('Un .gitignore de départ', 'Bash', 'printf "node_modules/\\n.env\\n.DS_Store\\n" > .gitignore\ngit add .gitignore\ngit commit -m "Ignorer les fichiers locaux"'),
      liens({ label: 'Git — documentation de référence', url: 'https://git-scm.com/docs' }, { label: 'Git — gitignore', url: 'https://git-scm.com/docs/gitignore' })
    ], associes: ['shell-env-path', 'npm-ci-lockfile', 'shell-grep-rg-find']
  })
];
