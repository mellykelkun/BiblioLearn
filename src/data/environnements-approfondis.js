'use strict';

// Chaque commande est une étape explicite : la page ne lance rien sur le poste.
// « commun » s'applique aux trois systèmes, les autres clés à un seul système.
const parSysteme = (windows, linux, mac = linux) => ({ windows, linux, mac });
const commande = (but, windows, linux, mac = linux) => ({ but, texte: parSysteme(windows, linux, mac) });
const panne = (symptome, comprendre, windows, linux, mac = linux) => ({ symptome, comprendre, corriger: parSysteme(windows, linux, mac) });

module.exports = {
  terminal: {
    fondamentaux: [
      ['Terminal', 'Fenêtre où l’on écrit des commandes ; elle affiche aussi leur résultat et leurs erreurs.'],
      ['Dossier courant', 'Emplacement dans lequel une commande lit ou crée un fichier quand aucun chemin absolu n’est donné.'],
      ['Interpréteur', 'PowerShell sur Windows, Bash ou zsh le plus souvent sur Linux/macOS : les noms de commandes et les séparateurs peuvent varier.']
    ],
    installation: parSysteme(
      ['Ouvrez PowerShell depuis Démarrer ; Windows Terminal est une fenêtre facultative qui peut héberger PowerShell.', 'Lisez le nom du profil actif. Dans VS Code, Terminal → Nouveau terminal permet d’ouvrir un terminal dans le dossier du projet.', 'Aucun paquet supplémentaire n’est nécessaire pour les commandes de base de ce guide.'],
      ['Ouvrez le Terminal fourni par votre distribution ; vérifiez le nom du shell avec echo "$SHELL".', 'Dans VS Code, Terminal → Nouveau terminal reprend en général le dossier du projet.', 'Les commandes de base sont normalement déjà présentes ; si le terminal manque, suivez le centre d’aide de votre distribution.'],
      ['Ouvrez Terminal dans Applications → Utilitaires ; vérifiez le shell avec echo "$SHELL".', 'Dans VS Code, Terminal → Nouveau terminal reprend en général le dossier du projet.', 'Aucune installation supplémentaire n’est requise pour pwd, ls, cd et mkdir.']
    ),
    commandes: [
      commande('Afficher le dossier courant avant toute création.', 'Get-Location', 'pwd'),
      commande('Voir les fichiers et dossiers présents.', 'Get-ChildItem', 'ls'),
      commande('Créer un dossier d’essai, puis y entrer.', 'New-Item -ItemType Directory -Name atelier-poste\nSet-Location atelier-poste', 'mkdir atelier-poste\ncd atelier-poste'),
      commande('Voir comment le shell cherche un outil.', 'Get-Command git -ErrorAction SilentlyContinue', 'command -v git')
    ],
    essai: { titre: 'Créer un espace isolé', fichier: 'aucun', contenu: '', execution: parSysteme('Get-Location\nNew-Item -ItemType Directory -Name atelier-poste\nSet-Location atelier-poste\nGet-Location', 'pwd\nmkdir atelier-poste\ncd atelier-poste\npwd'), resultat: 'La dernière ligne affiche un chemin se terminant par atelier-poste. Si ce dossier existe déjà, choisissez un autre nom.' },
    pannes: [
      panne('Commande introuvable', 'Distinguez faute de frappe, outil absent et outil hors du PATH.', 'Get-Command NOM -ErrorAction SilentlyContinue ; rouvrez PowerShell après installation.', 'command -v NOM ; vérifiez la documentation de votre distribution et rouvrez le terminal.'),
      panne('Chemin contenant des espaces', 'Le shell découpe un chemin non cité en plusieurs arguments.', 'Set-Location "C:\\Users\\Votre nom\\Documents"', 'cd "Mon dossier"'),
      panne('Accès refusé', 'Le dossier n’est peut-être pas modifiable par votre compte.', 'Utilisez un dossier personnel ; contrôlez Get-Location et Get-Item ., sans lancer PowerShell administrateur pour un exercice.', 'Travaillez dans votre dossier personnel ; vérifiez pwd et ls -ld . avant de changer des permissions.')
    ]
  },
  vscode: {
    fondamentaux: [
      ['Éditeur', 'Permet d’écrire des fichiers texte et de voir leur arborescence ; il ne fournit pas à lui seul Python, Java ou un compilateur C++.'],
      ['Dossier de travail', 'Ouvrez le dossier du projet pour que le terminal, les fichiers et les extensions partagent le même contexte.'],
      ['Extension', 'Fonction ajoutée à l’éditeur. Installez seulement celles dont vous comprenez le rôle et la provenance.']
    ],
    installation: parSysteme(
      ['Téléchargez l’installateur utilisateur sur code.visualstudio.com/download et vérifiez le nom de l’éditeur avant l’exécution.', 'Suivez l’installation, puis ouvrez VS Code depuis Démarrer ; l’option d’ajout au PATH facilite la commande code.', 'Rouvrez PowerShell et vérifiez code --version. L’application graphique reste utilisable si cette commande échoue.'],
      ['Sur code.visualstudio.com/docs/setup/linux, choisissez le paquet adapté à votre distribution (.deb pour Debian/Ubuntu, .rpm pour Fedora/RHEL, etc.).', 'Installez avec le gestionnaire graphique ou la méthode officielle propre à la distribution.', 'Ouvrez l’application, puis un nouveau terminal ; vérifiez code --version.'],
      ['Téléchargez le .dmg officiel pour Intel ou Apple silicon sur code.visualstudio.com/download.', 'Glissez Visual Studio Code dans Applications, puis ouvrez-le depuis ce dossier.', 'Dans la palette de commandes, lancez « Shell Command: Install code command in PATH » ; rouvrez Terminal et vérifiez code --version.']
    ),
    commandes: [
      commande('Afficher la version de la commande de l’éditeur.', 'code --version', 'code --version'),
      commande('Ouvrir le dossier courant comme projet.', 'code .', 'code .'),
      commande('Ouvrir l’aide des options de lancement.', 'code --help', 'code --help')
    ],
    essai: { titre: 'Écrire et ouvrir une page entière', fichier: 'index.html', contenu: '<!doctype html>\n<html lang="fr">\n<head><meta charset="utf-8"><title>Mon poste</title></head>\n<body><main><h1>Mon éditeur fonctionne</h1></main></body>\n</html>', execution: parSysteme('code .\n# Enregistrez index.html puis ouvrez-le depuis l’Explorateur.', 'code .\n# Enregistrez index.html puis ouvrez-le depuis le gestionnaire de fichiers.'), resultat: 'Le navigateur montre « Mon éditeur fonctionne ». Le fichier doit bien s’appeler index.html, pas index.html.txt.' },
    pannes: [
      panne('code est introuvable', 'L’éditeur graphique et sa commande terminal sont deux points d’entrée différents.', 'Rouvrez PowerShell ; si nécessaire réinstallez depuis le site officiel avec l’option PATH.', 'Rouvrez le terminal ; vérifiez command -v code et la méthode de paquet utilisée.', 'Dans la palette de commandes de VS Code, installez la commande code dans le PATH puis rouvrez Terminal.'),
      panne('Le terminal ne voit pas le fichier', 'Le dossier ouvert dans l’éditeur et le dossier courant du terminal diffèrent.', 'Ouvrez le dossier parent du fichier avec Fichier → Ouvrir le dossier ; vérifiez Get-Location.', 'Ouvrez le dossier parent avec Fichier → Ouvrir le dossier ; vérifiez pwd.'),
      panne('La page affiche les balises au lieu de la page', 'Le fichier est peut-être enregistré en .txt ou ouvert comme texte.', 'Dans l’Explorateur, affichez les extensions et contrôlez index.html.', 'Dans le gestionnaire de fichiers, contrôlez le nom complet index.html.')
    ]
  },
  git: {
    fondamentaux: [
      ['Dépôt', 'Dossier dont Git suit l’historique après git init.'],
      ['Commit', 'Point de contrôle local comprenant les fichiers sélectionnés et un message. Il ne publie rien en ligne.'],
      ['Zone de préparation', 'git add choisit ce qui entrera dans le prochain commit ; git status montre ce choix.']
    ],
    installation: parSysteme(
      ['Téléchargez Git for Windows depuis git-scm.com/download/win ; suivez l’installateur officiel.', 'Conservez PowerShell comme terminal si vous l’utilisez déjà ; Git Bash est une autre option, avec une syntaxe différente.', 'Rouvrez le terminal puis vérifiez git --version et Get-Command git.'],
      ['Choisissez le paquet Git de votre distribution ; Debian/Ubuntu : sudo apt update puis sudo apt install git.', 'Sur Fedora, Arch ou une autre distribution, utilisez son gestionnaire indiqué par git-scm.com/download/linux.', 'Rouvrez le terminal et vérifiez git --version.'],
      ['Dans Terminal, git --version peut proposer l’installation des outils Apple ; suivez cette boîte de dialogue si elle correspond à votre choix.', 'Autre possibilité : installez Git depuis git-scm.com/download/mac.', 'Rouvrez Terminal ; vérifiez git --version et command -v git.']
    ),
    commandes: [
      commande('Vérifier la version de Git.', 'git --version', 'git --version'),
      commande('Créer un dépôt local dans le dossier d’exercice.', 'git init', 'git init'),
      commande('Voir les fichiers suivis ou modifiés.', 'git status', 'git status'),
      commande('Enregistrer une seule version locale.', 'git add note.txt\ngit commit -m "Ajouter une note"', 'git add note.txt\ngit commit -m "Ajouter une note"'),
      commande('Relire le dernier commit.', 'git log -1 --oneline', 'git log -1 --oneline')
    ],
    essai: { titre: 'Créer un premier historique local', fichier: 'note.txt', contenu: 'Premier exercice Git.\n', execution: parSysteme('New-Item -ItemType Directory -Name essai-git\nSet-Location essai-git\n# Créez note.txt avec le texte proposé dans VS Code.\ngit init\ngit add note.txt\ngit commit -m "Ajouter une note"\ngit status', 'mkdir essai-git\ncd essai-git\n# Créez note.txt avec le texte proposé dans VS Code.\ngit init\ngit add note.txt\ngit commit -m "Ajouter une note"\ngit status'), resultat: 'git status indique que l’arbre de travail est propre. Rien n’est envoyé à un hébergeur.' },
    pannes: [
      panne('Author identity unknown', 'Git ne sait pas quel nom et quelle adresse associer au commit.', 'Définissez git config --global user.name "Votre nom" puis git config --global user.email "vous@example.com" avec vos vraies informations.', 'Définissez git config --global user.name "Votre nom" puis git config --global user.email "vous@example.com" avec vos vraies informations.'),
      panne('not a git repository', 'La commande est lancée hors du dossier initialisé.', 'Vérifiez Get-Location ; entrez dans essai-git avec Set-Location essai-git.', 'Vérifiez pwd ; entrez dans essai-git avec cd essai-git.'),
      panne('git introuvable après installation', 'Le terminal conserve parfois l’ancien PATH.', 'Rouvrez PowerShell et contrôlez Get-Command git ; vérifiez l’option PATH de l’installateur.', 'Rouvrez Terminal et contrôlez command -v git ; vérifiez la méthode d’installation choisie.')
    ]
  },
  node: {
    fondamentaux: [
      ['Node.js', 'Exécute JavaScript hors du navigateur ; un fichier .js peut ainsi lire des arguments ou démarrer un serveur.'],
      ['npm', 'Gestionnaire fourni avec la plupart des installations Node ; il lit package.json pour les scripts et dépendances.'],
      ['package-lock.json', 'Note les versions réellement résolues pour pouvoir réinstaller le projet de façon reproductible.']
    ],
    installation: parSysteme(
      ['Sur nodejs.org/en/download, choisissez la version LTS et l’installateur Windows adapté à votre architecture.', 'Suivez l’installateur, puis fermez et rouvrez PowerShell ou VS Code pour actualiser le PATH.', 'Vérifiez séparément node --version, npm --version et Get-Command node.'],
      ['Sur nodejs.org/en/download, choisissez une méthode maintenue pour votre distribution ou un gestionnaire de versions documenté.', 'Si le projet indique une version Node attendue, installez cette version avant ses dépendances. Évitez de mélanger des installations système et utilisateur sans comprendre le PATH.', 'Ouvrez un nouveau terminal ; vérifiez node --version, npm --version et command -v node.'],
      ['Sur nodejs.org/en/download, choisissez la version LTS pour Intel ou Apple silicon.', 'Terminez l’installation puis rouvrez Terminal ou VS Code.', 'Vérifiez node --version, npm --version et command -v node.']
    ),
    commandes: [
      commande('Vérifier le moteur et le gestionnaire.', 'node --version\nnpm --version', 'node --version\nnpm --version'),
      commande('Contrôler la syntaxe avant l’exécution.', 'node --check bonjour.js', 'node --check bonjour.js'),
      commande('Exécuter le fichier en passant un argument.', 'node bonjour.js Awa', 'node bonjour.js Awa'),
      commande('Dans un projet déjà connu, afficher ses scripts npm.', 'npm run', 'npm run')
    ],
    essai: { titre: 'Exécuter un script autonome', fichier: 'bonjour.js', contenu: '"use strict";\nconst nom = process.argv[2] || "Awa";\nconsole.log(`Bonjour ${nom} !`);', execution: parSysteme('node --check bonjour.js\nnode bonjour.js Awa', 'node --check bonjour.js\nnode bonjour.js Awa'), resultat: 'La vérification de syntaxe ne produit pas d’erreur ; le lancement affiche « Bonjour Awa ! ». Aucun npm install n’est nécessaire pour ce fichier.' },
    pannes: [
      panne('node répond, npm ne répond pas', 'Les deux commandes peuvent être exposées différemment au terminal.', 'Rouvrez PowerShell ; vérifiez Get-Command npm. Si npm.ps1 est bloqué, utilisez npm.cmd --version et consultez la politique PowerShell avant tout changement.', 'Rouvrez le terminal ; comparez command -v node et command -v npm, puis reprenez l’installation officielle.'),
      panne('Version Node incompatible avec le projet', 'La version installée peut être plus ancienne que celle demandée dans package.json.', 'Comparez node --version à engines.node dans package.json ; installez une version compatible depuis la source officielle.', 'Comparez node --version à engines.node ; sélectionnez une version compatible avec votre méthode d’installation.'),
      panne('Cannot find module ou package introuvable', 'Le chemin du fichier ou la dépendance du projet manque.', 'Vérifiez Get-Location et le nom du fichier ; si le module est déclaré dans package.json, lancez npm install dans ce projet.', 'Vérifiez pwd et le nom du fichier ; si le module est déclaré, lancez npm install dans ce projet.')
    ]
  },
  python: {
    fondamentaux: [
      ['Interpréteur', 'Programme qui exécute un fichier .py ; le nom de commande varie selon le système.'],
      ['venv', 'Dossier isolé contenant un interpréteur et ses packages pour un projet.'],
      ['pip', 'Installe des packages pour l’interpréteur invoqué ; « python -m pip » évite de confondre plusieurs installations.']
    ],
    installation: parSysteme(
      ['Depuis python.org/downloads, installez le gestionnaire Python ou une version stable selon le guide Windows officiel.', 'Rouvrez PowerShell ; vérifiez py --version ou python --version. Ne supposez pas que les deux visent la même version.', 'Dans un dossier d’exercice, créez .venv ; utilisez directement son python.exe, sans devoir modifier la politique d’exécution de PowerShell.'],
      ['Installez Python 3 et son module venv avec le gestionnaire de votre distribution ; Debian/Ubuntu : sudo apt install python3 python3-venv.', 'Vérifiez python3 --version ; créez .venv dans le projet avec python3 -m venv .venv.', 'Utilisez .venv/bin/python -m pip ; ne modifiez pas le Python système pour un exercice.'],
      ['Téléchargez Python 3 depuis python.org/downloads ou suivez une méthode documentée par votre gestionnaire de paquets.', 'Rouvrez Terminal et vérifiez python3 --version et command -v python3.', 'Créez .venv par projet ; n’écrasez pas le Python interne de macOS.']
    ),
    commandes: [
      commande('Afficher la version de l’interpréteur réellement appelé.', 'py --version', 'python3 --version'),
      commande('Créer un environnement isolé dans le dossier courant.', 'py -m venv .venv', 'python3 -m venv .venv'),
      commande('Vérifier le pip de cet environnement.', '.\\.venv\\Scripts\\python.exe -m pip --version', '.venv/bin/python -m pip --version'),
      commande('Exécuter un script dans cet environnement.', '.\\.venv\\Scripts\\python.exe bonjour.py', '.venv/bin/python bonjour.py')
    ],
    essai: { titre: 'Lancer Python sans dépendance externe', fichier: 'bonjour.py', contenu: 'nom = "Awa"\nprint(f"Bonjour {nom} !")', execution: parSysteme('py -m venv .venv\n.\\.venv\\Scripts\\python.exe bonjour.py', 'python3 -m venv .venv\n.venv/bin/python bonjour.py'), resultat: 'Le terminal affiche « Bonjour Awa ! ». Le dossier .venv appartient à cet exercice ; ne le copiez pas dans Git.' },
    pannes: [
      panne('py ou python introuvable', 'Windows peut utiliser le gestionnaire Python et des alias distincts ; ailleurs le nom courant est python3.', 'Vérifiez py --version et python --version ; consultez la section dépannage du guide Python Windows et rouvrez PowerShell.', 'Vérifiez command -v python3 ; installez le paquet de votre distribution ou rouvrez Terminal.'),
      panne('No module named venv / ensurepip indisponible', 'Le composant venv n’est pas toujours dans le paquet de base.', 'Réparez l’installation Python officielle puis recréez .venv.', 'Installez le paquet venv adapté à la version de votre distribution, puis recréez .venv.', 'Vérifiez l’installation Python choisie et recréez .venv avec cet interpréteur.'),
      panne('ModuleNotFoundError ou environnement géré par le système', 'Le package est peut-être installé dans un autre Python ; le Python système peut refuser pip.', 'Utilisez .\\.venv\\Scripts\\python.exe -m pip list ; installez dans ce venv si le projet le demande.', 'Utilisez .venv/bin/python -m pip list ; installez dans ce venv, jamais avec sudo pip.')
    ]
  },
  jdk: {
    fondamentaux: [
      ['JDK', 'Kit qui contient notamment javac pour compiler et java pour lancer ; un runtime seul ne suffit pas à développer.'],
      ['Classe et fichier', 'Une classe publique Bonjour doit être dans Bonjour.java, avec la même casse.'],
      ['Classpath', 'Emplacements où Java cherche les classes ; les premiers exercices se lancent depuis le dossier du fichier compilé.']
    ],
    installation: parSysteme(
      ['Sur adoptium.net/installation, choisissez un JDK Temurin pour Windows et votre architecture, pas seulement un JRE.', 'Installez le MSI ; rouvrez PowerShell.', 'Vérifiez java -version, javac -version et que leurs versions majeures correspondent.'],
      ['Choisissez un paquet JDK de votre distribution ou la méthode Adoptium correspondant à celle-ci.', 'Sur Debian/Ubuntu, un paquet comme default-jdk fournit généralement java et javac ; vérifiez la version exigée par votre projet.', 'Rouvrez le terminal ; comparez java -version et javac -version.'],
      ['Sur adoptium.net/installation, choisissez le PKG JDK pour Intel ou Apple silicon.', 'Terminez l’installation puis rouvrez Terminal.', 'Vérifiez java -version, javac -version et, en cas de versions multiples, /usr/libexec/java_home -V.']
    ),
    commandes: [
      commande('Vérifier l’exécuteur et le compilateur.', 'java -version\njavac -version', 'java -version\njavac -version'),
      commande('Compiler le fichier source.', 'javac Bonjour.java', 'javac Bonjour.java'),
      commande('Lancer la classe compilée, sans extension.', 'java Bonjour', 'java Bonjour')
    ],
    essai: { titre: 'Compiler puis lancer une classe', fichier: 'Bonjour.java', contenu: 'public class Bonjour {\n    public static void main(String[] args) {\n        System.out.println("Bonjour Java !");\n    }\n}', execution: parSysteme('javac Bonjour.java\njava Bonjour', 'javac Bonjour.java\njava Bonjour'), resultat: 'javac crée Bonjour.class ; java Bonjour affiche « Bonjour Java ! ». Ne lancez pas java Bonjour.class.' },
    pannes: [
      panne('java fonctionne mais javac manque', 'Un runtime ou un chemin vers une autre installation est actif.', 'Comparez Get-Command java et Get-Command javac ; installez un JDK, puis rouvrez PowerShell.', 'Comparez command -v java et command -v javac ; installez ou sélectionnez un JDK.', 'Consultez /usr/libexec/java_home -V puis comparez command -v java et command -v javac.'),
      panne('Could not find or load main class', 'Le nom de classe, sa casse ou le dossier courant ne correspond pas.', 'Vérifiez Get-Location, Bonjour.class et la commande java Bonjour sans extension.', 'Vérifiez pwd, Bonjour.class et la commande java Bonjour sans extension.'),
      panne('UnsupportedClassVersionError', 'Le programme a été compilé pour un Java plus récent que celui qui le lance.', 'Comparez java -version et javac -version ; choisissez le même JDK pour compiler et lancer.', 'Comparez java -version et javac -version ; sélectionnez le même JDK.')
    ]
  },
  springboot: {
    fondamentaux: [
      ['Spring Initializr', 'Génère un projet Java déjà organisé avec pom.xml, des dépendances et un wrapper Maven.'],
      ['Wrapper', 'mvnw ou mvnw.cmd : script du projet qui lance la version Maven prévue ; inspectez le projet avant de l’exécuter.'],
      ['Port local', 'Le serveur écoute normalement sur localhost:8080 ; une autre application peut déjà occuper ce port.']
    ],
    installation: parSysteme(
      ['Installez d’abord un JDK compatible avec la version Spring choisie.', 'Sur start.spring.io, choisissez Java, Maven, une version stable, le paquet com.example.demo et la dépendance Spring Web ; téléchargez le ZIP.', 'Décompressez-le dans un dossier d’essai. Ouvrez celui qui contient pom.xml, mvnw.cmd et src ; vérifiez .\\mvnw.cmd --version.'],
      ['Installez d’abord un JDK compatible.', 'Sur start.spring.io, choisissez Java, Maven, une version stable, com.example.demo et Spring Web ; téléchargez puis décompressez le ZIP.', 'Entrez dans le dossier contenant pom.xml et mvnw ; vérifiez ./mvnw --version.'],
      ['Installez d’abord un JDK compatible.', 'Sur start.spring.io, choisissez Java, Maven, une version stable, com.example.demo et Spring Web ; téléchargez puis décompressez le ZIP.', 'Entrez dans le dossier contenant pom.xml et mvnw ; vérifiez ./mvnw --version.']
    ),
    commandes: [
      commande('Vérifier le wrapper depuis la racine du projet.', '.\\mvnw.cmd --version', './mvnw --version'),
      commande('Lancer les tests du projet.', '.\\mvnw.cmd test', './mvnw test'),
      commande('Démarrer le serveur local.', '.\\mvnw.cmd spring-boot:run', './mvnw spring-boot:run'),
      commande('Tester la réponse depuis un autre terminal ; une page 404 prouve aussi que le serveur répond.', 'curl.exe -i http://localhost:8080/', 'curl -i http://localhost:8080/')
    ],
    essai: { titre: 'Ajouter une route au projet généré', fichier: 'src/main/java/com/example/demo/BonjourController.java', contenu: 'package com.example.demo;\n\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.RestController;\n\n@RestController\npublic class BonjourController {\n    @GetMapping("/bonjour")\n    public String bonjour() { return "Bonjour Spring !"; }\n}', execution: parSysteme('.\\mvnw.cmd spring-boot:run\n# Dans un autre PowerShell :\ncurl.exe -i http://localhost:8080/bonjour', './mvnw spring-boot:run\n# Dans un autre terminal :\ncurl -i http://localhost:8080/bonjour'), resultat: 'La réponse HTTP 200 contient « Bonjour Spring ! ». Ctrl+C arrête le serveur. La première exécution peut télécharger des dépendances.' },
    pannes: [
      panne('Wrapper ou pom.xml introuvable', 'Le terminal n’est probablement pas à la racine du projet extrait.', 'Vérifiez Get-Location et Get-ChildItem ; cherchez mvnw.cmd dans le dossier qui contient pom.xml.', 'Vérifiez pwd et ls ; cherchez mvnw dans le dossier qui contient pom.xml.'),
      panne('Permission denied sur mvnw', 'Le fichier n’a pas le droit d’exécution après extraction.', 'Utilisez .\\mvnw.cmd dans PowerShell, pas ./mvnw.', 'Vérifiez ls -l mvnw ; sur le projet officiel extrait, chmod u+x mvnw rend ce seul script exécutable.'),
      panne('Port 8080 déjà utilisé ou Java incompatible', 'Une application écoute déjà, ou le JDK ne correspond pas à pom.xml.', 'Arrêtez l’autre serveur ; comparez java -version au niveau Java de pom.xml. Pour cet essai, server.port=8081 peut être placé dans src/main/resources/application.properties.', 'Arrêtez l’autre serveur ; comparez java -version au niveau Java de pom.xml. Pour cet essai, server.port=8081 peut être placé dans src/main/resources/application.properties.')
    ]
  },
  cpp: {
    fondamentaux: [
      ['Source', 'Fichier .cpp lisible ; le compilateur crée ensuite un programme propre à votre système.'],
      ['Compilation puis liaison', 'Le compilateur vérifie et traduit le code ; l’éditeur de liens assemble les parties nécessaires à l’exécutable.'],
      ['Norme C++', 'L’option -std=c++20 ou /std:c++20 choisit les règles de langage de cet exercice.']
    ],
    installation: parSysteme(
      ['Depuis Microsoft, installez Visual Studio Community ou Build Tools avec la charge « Développement Desktop en C++ ».', 'Ouvrez Developer PowerShell for VS depuis Démarrer ; un PowerShell ordinaire ne prépare pas toujours les chemins du compilateur.', 'Vérifiez cl puis le contenu du dossier avant de compiler.'],
      ['Installez le compilateur C++ de votre distribution ; Debian/Ubuntu : sudo apt install g++.', 'Sur Fedora, Arch ou autre distribution, utilisez son paquet officiel GCC/G++.', 'Rouvrez le terminal et vérifiez g++ --version.'],
      ['Lancez xcode-select --install et acceptez la boîte de dialogue Apple pour les outils de ligne de commande.', 'Rouvrez Terminal, vérifiez xcode-select -p puis clang++ --version.', 'VS Code reste facultatif et ne remplace pas le compilateur.']
    ),
    commandes: [
      commande('Vérifier le compilateur sélectionné.', 'cl', 'g++ --version', 'clang++ --version'),
      commande('Compiler avec avertissements, puis nommer le programme.', 'cl /EHsc /W4 /std:c++20 main.cpp /Fe:atelier.exe', 'g++ -std=c++20 -Wall -Wextra main.cpp -o atelier', 'clang++ -std=c++20 -Wall -Wextra main.cpp -o atelier'),
      commande('Lancer le programme construit.', '.\\atelier.exe', './atelier')
    ],
    essai: { titre: 'Compiler un programme complet', fichier: 'main.cpp', contenu: '#include <iostream>\n\nint main() {\n    std::cout << "Bonjour C++ !\\n";\n    return 0;\n}', execution: parSysteme('cl /EHsc /W4 /std:c++20 main.cpp /Fe:atelier.exe\n.\\atelier.exe', 'g++ -std=c++20 -Wall -Wextra main.cpp -o atelier\n./atelier', 'clang++ -std=c++20 -Wall -Wextra main.cpp -o atelier\n./atelier'), resultat: 'La compilation crée un exécutable, puis l’exécution affiche « Bonjour C++ ! ». Le fichier main.cpp reste distinct du programme produit.' },
    pannes: [
      panne('Compilateur introuvable', 'L’éditeur et le compilateur sont des logiciels distincts.', 'Ouvrez Developer PowerShell for VS et contrôlez la charge C++ installée.', 'Vérifiez command -v g++ ; installez le paquet C++ officiel de votre distribution.', 'Vérifiez xcode-select -p et clang++ --version ; terminez les outils de ligne de commande Apple.'),
      panne('Undefined reference / symbole externe non résolu', 'Une fonction est déclarée mais son corps ou un fichier source manque à la liaison.', 'Vérifiez que tous les .cpp nécessaires figurent dans la commande cl.', 'Vérifiez que tous les .cpp nécessaires figurent dans la commande g++.', 'Vérifiez que tous les .cpp nécessaires figurent dans la commande clang++.'),
      panne('Programme introuvable après compilation', 'La compilation a peut-être échoué ou le nom du binaire diffère.', 'Lisez la première erreur ; cherchez atelier.exe avec Get-ChildItem avant .\\atelier.exe.', 'Lisez la première erreur ; cherchez atelier avec ls avant ./atelier.')
    ]
  },
  dotnet: {
    fondamentaux: [
      ['SDK', 'Contient les modèles, le compilateur et dotnet run ; le runtime seul lance surtout un programme déjà construit.'],
      ['Projet .csproj', 'Décrit la cible .NET et les dépendances ; dotnet run le cherche dans le dossier courant.'],
      ['Restauration', 'dotnet restore lit les dépendances du projet avant la construction.']
    ],
    installation: parSysteme(
      ['Sur learn.microsoft.com/dotnet/core/install/windows, choisissez un SDK .NET pris en charge, adapté à votre architecture.', 'Terminez l’installateur puis rouvrez PowerShell.', 'Vérifiez dotnet --list-sdks et dotnet --info ; une liste vide signifie qu’aucun SDK n’est visible.'],
      ['Sur learn.microsoft.com/dotnet/core/install/linux, choisissez votre distribution exacte et son paquet SDK.', 'N’utilisez pas une commande Ubuntu sur une autre distribution ; vérifiez la source de paquets.', 'Rouvrez le terminal puis vérifiez dotnet --list-sdks et dotnet --info.'],
      ['Sur learn.microsoft.com/dotnet/core/install/macos, choisissez le SDK adapté à Apple silicon ou Intel.', 'Terminez l’installation et rouvrez Terminal.', 'Vérifiez dotnet --list-sdks et dotnet --info.']
    ),
    commandes: [
      commande('Lister les SDK installés, pas seulement les runtimes.', 'dotnet --list-sdks', 'dotnet --list-sdks'),
      commande('Créer un projet console dans un dossier d’essai vide.', 'dotnet new console --output essai-dotnet', 'dotnet new console --output essai-dotnet'),
      commande('Exécuter le projet depuis son dossier.', 'Set-Location essai-dotnet\ndotnet run', 'cd essai-dotnet\ndotnet run'),
      commande('Construire le projet après une modification.', 'dotnet build', 'dotnet build')
    ],
    essai: { titre: 'Modifier puis lancer le projet généré', fichier: 'essai-dotnet/Program.cs', contenu: 'Console.WriteLine("Bonjour C# !");', execution: parSysteme('dotnet new console --output essai-dotnet\n# Remplacez essai-dotnet/Program.cs par le code montré.\ndotnet run --project essai-dotnet', 'dotnet new console --output essai-dotnet\n# Remplacez essai-dotnet/Program.cs par le code montré.\ndotnet run --project essai-dotnet'), resultat: 'Le terminal affiche « Bonjour C# ! ». Le générateur crée aussi le .csproj : conservez-le.' },
    pannes: [
      panne('dotnet existe mais aucun SDK n’est listé', 'Un runtime seul ne suffit pas pour dotnet new ou dotnet build.', 'Installez le SDK officiel puis rouvrez PowerShell ; recontrôlez dotnet --list-sdks.', 'Installez le paquet SDK de votre distribution ou le SDK officiel ; recontrôlez dotnet --list-sdks.'),
      panne('No project was found', 'La commande est lancée hors du dossier contenant le .csproj.', 'Vérifiez Get-Location ; entrez dans essai-dotnet ou utilisez dotnet run --project essai-dotnet.', 'Vérifiez pwd ; entrez dans essai-dotnet ou utilisez dotnet run --project essai-dotnet.'),
      panne('SDK incompatible avec la cible', 'Le projet peut demander une version .NET absente.', 'Comparez dotnet --list-sdks, la cible TargetFramework du .csproj et global.json éventuel.', 'Comparez dotnet --list-sdks, TargetFramework et global.json éventuel.')
    ]
  },
  php: {
    fondamentaux: [
      ['PHP CLI', 'Exécute un fichier .php depuis le terminal, sans serveur web.'],
      ['Serveur intégré', 'Outil local pour essayer une page ; il ne constitue pas une configuration de production.'],
      ['Extension PHP', 'Module activant une fonction ou un pilote ; les extensions chargées dépendent du php.ini utilisé.']
    ],
    installation: parSysteme(
      ['Consultez php.net/manual/en/install.windows.php pour choisir une distribution PHP Windows et son architecture.', 'Rendez php.exe accessible selon la méthode officielle choisie, puis rouvrez PowerShell.', 'Vérifiez php -v et php --ini ; le second indique le fichier de configuration chargé.'],
      ['Installez PHP CLI depuis les paquets de votre distribution ; Debian/Ubuntu : sudo apt install php-cli.', 'Pour une extension supplémentaire, utilisez le paquet correspondant à la version PHP de votre distribution.', 'Vérifiez php -v et php --ini.'],
      ['Suivez php.net/manual/en/install.php et une distribution PHP maintenue pour macOS ; ne supposez pas que PHP est préinstallé.', 'Rouvrez Terminal et contrôlez command -v php.', 'Vérifiez php -v et php --ini.']
    ),
    commandes: [
      commande('Identifier la version et la configuration active.', 'php -v\nphp --ini', 'php -v\nphp --ini'),
      commande('Contrôler la syntaxe du fichier.', 'php -l bonjour.php', 'php -l bonjour.php'),
      commande('Exécuter le script sans serveur.', 'php bonjour.php', 'php bonjour.php'),
      commande('Démarrer un serveur local depuis le dossier de la page ; Ctrl+C l’arrête.', 'php -S 127.0.0.1:8000', 'php -S 127.0.0.1:8000')
    ],
    essai: { titre: 'Exécuter un script PHP minimal', fichier: 'bonjour.php', contenu: '<?php\ndeclare(strict_types=1);\necho "Bonjour PHP !\\n";', execution: parSysteme('php -l bonjour.php\nphp bonjour.php', 'php -l bonjour.php\nphp bonjour.php'), resultat: 'La vérification annonce l’absence d’erreur de syntaxe ; le script affiche « Bonjour PHP ! ».' },
    pannes: [
      panne('php introuvable', 'L’interpréteur CLI n’est pas installé ou n’est pas sur le PATH.', 'Rouvrez PowerShell ; vérifiez Get-Command php et le chemin du php.exe choisi.', 'Vérifiez command -v php ; installez php-cli avec le gestionnaire de votre distribution.', 'Vérifiez command -v php ; reprenez la méthode d’installation choisie.'),
      panne('Class PDO / pilote ou autre extension manquant', 'Le PHP invoqué n’a pas chargé l’extension attendue.', 'Exécutez php -m et php --ini ; activez l’extension adaptée dans la configuration de cette installation.', 'Exécutez php -m et php --ini ; installez le paquet d’extension correspondant à votre version.'),
      panne('Port 8000 déjà utilisé', 'Un autre serveur local écoute sur ce port.', 'Arrêtez le processus connu ou choisissez 127.0.0.1:8001 pour cet essai.', 'Arrêtez le processus connu ou choisissez 127.0.0.1:8001 pour cet essai.')
    ]
  },
  composer: {
    fondamentaux: [
      ['composer.json', 'Déclare les packages PHP souhaités par le projet.'],
      ['composer.lock', 'Enregistre les versions résolues ; composer install les réutilise quand ce fichier existe.'],
      ['Autoload', 'Fichier vendor/autoload.php généré après installation ; il charge les classes des dépendances du projet.']
    ],
    installation: parSysteme(
      ['Vérifiez d’abord php -v ; l’installateur Composer a besoin de PHP.', 'Depuis getcomposer.org/doc/00-intro.md, utilisez Composer-Setup.exe officiel.', 'Rouvrez PowerShell ; vérifiez composer --version et php -v dans le même terminal.'],
      ['Vérifiez d’abord php -v ; suivez la procédure officielle getcomposer.org/download pour une installation locale ou dans le PATH.', 'Ne collez pas aveuglément un pipeline téléchargé ; suivez les contrôles d’intégrité indiqués par Composer.', 'Vérifiez composer --version, ou php composer.phar --version si vous avez choisi un fichier local.'],
      ['Vérifiez d’abord php -v ; suivez la procédure officielle getcomposer.org/download.', 'Une installation locale composer.phar suffit pour un exercice ; vous n’avez pas besoin d’un emplacement global.', 'Vérifiez composer --version, ou php composer.phar --version.']
    ),
    commandes: [
      commande('Vérifier la CLI et le PHP qu’elle utilise.', 'composer --version\nphp -v', 'composer --version\nphp -v'),
      commande('Contrôler la déclaration des packages.', 'composer validate', 'composer validate'),
      commande('Installer les versions du lockfile dans un projet connu.', 'composer install', 'composer install'),
      commande('Voir les dépendances installées.', 'composer show', 'composer show')
    ],
    essai: { titre: 'Valider un petit projet Composer', fichier: 'composer.json', contenu: '{\n  "name": "bibliolearn/essai-composer",\n  "description": "Exercice local sans dépendance externe",\n  "type": "project",\n  "require": {}\n}', execution: parSysteme('composer validate\ncomposer install', 'composer validate\ncomposer install'), resultat: 'Composer valide le fichier puis crée éventuellement vendor/ et composer.lock selon sa version. Aucun package tiers n’est demandé.' },
    pannes: [
      panne('composer introuvable ou php introuvable', 'Composer dépend d’un PHP CLI visible dans le terminal.', 'Rouvrez PowerShell ; comparez Get-Command composer et Get-Command php ; reprenez l’installateur officiel si besoin.', 'Vérifiez command -v php ; si installation locale, utilisez php composer.phar --version.'),
      panne('Extension PHP requise absente', 'Une dépendance demande un module non chargé par le PHP de la CLI.', 'Lisez le nom d’extension dans l’erreur ; utilisez php -m et php --ini avant de configurer ce PHP.', 'Lisez l’extension demandée ; utilisez php -m puis le paquet officiel correspondant à votre version.'),
      panne('Le lockfile et composer.json divergent', 'La déclaration a changé depuis la résolution des versions.', 'Lisez le diff des deux fichiers et les contraintes ; mettez à jour les dépendances consciemment, ne supprimez pas le lockfile au hasard.', 'Lisez le diff des deux fichiers et les contraintes ; mettez à jour les dépendances consciemment.')
    ]
  },
  docker: {
    fondamentaux: [
      ['Image', 'Paquet qui décrit les fichiers et la commande de départ du conteneur.'],
      ['Conteneur', 'Exécution d’une image ; il s’arrête lorsque sa commande principale se termine.'],
      ['Client et moteur', 'docker est la commande cliente ; le moteur doit aussi tourner pour créer un conteneur.']
    ],
    installation: parSysteme(
      ['Suivez docs.docker.com/desktop/setup/install/windows-install et vérifiez les prérequis de virtualisation et du backend choisi, souvent WSL 2.', 'Installez Docker Desktop officiel puis démarrez-le ; attendez que le moteur soit prêt.', 'Ouvrez un nouveau PowerShell ; docker version doit afficher un Client et un Server.'],
      ['Choisissez Docker Engine ou Docker Desktop dans docs.docker.com/get-started/get-docker selon votre distribution.', 'Suivez exactement le guide de votre distribution pour le dépôt et le service ; évitez les scripts non vérifiés.', 'Vérifiez docker version. Si l’accès au socket est refusé, lisez les implications du groupe docker dans la documentation officielle avant de changer les permissions.'],
      ['Choisissez Docker Desktop pour la puce Intel ou Apple silicon depuis la documentation officielle.', 'Installez l’application et démarrez-la ; attendez le démarrage du moteur.', 'Dans un nouveau Terminal, docker version doit afficher Client et Server.']
    ),
    commandes: [
      commande('Distinguer présence du client et moteur actif.', 'docker version', 'docker version'),
      commande('Exécuter l’image officielle de démonstration ; téléchargement réseau au premier essai.', 'docker run --rm hello-world', 'docker run --rm hello-world'),
      commande('Voir les conteneurs encore en cours.', 'docker ps', 'docker ps'),
      commande('Voir les images déjà présentes.', 'docker image ls', 'docker image ls')
    ],
    essai: { titre: 'Construire une image locale simple', fichier: 'Dockerfile', contenu: 'FROM busybox:stable\nCMD ["echo", "Bonjour Docker !"]', execution: parSysteme('docker build -t essai-bibliolearn .\ndocker run --rm essai-bibliolearn', 'docker build -t essai-bibliolearn .\ndocker run --rm essai-bibliolearn'), resultat: 'Après téléchargement de l’image de base, le conteneur affiche « Bonjour Docker ! » puis s’arrête. N’utilisez qu’un dossier d’essai comme contexte de build.' },
    pannes: [
      panne('Cannot connect to the Docker daemon', 'La CLI existe, mais le moteur n’est pas prêt.', 'Démarrez Docker Desktop ; vérifiez son état et les prérequis WSL/virtualisation.', 'Vérifiez le service Docker selon le guide de votre distribution ; distinguez service arrêté et permission refusée.', 'Démarrez Docker Desktop et attendez que le moteur soit prêt.'),
      panne('Permission denied sur le socket', 'Sous Linux, le compte n’a pas accès au moteur ; cet accès est puissant.', 'Vérifiez que Docker Desktop fonctionne ; ne modifiez pas les ACL à l’aveugle.', 'Consultez la procédure officielle post-installation et ses implications ; n’utilisez pas chmod 777 sur docker.sock.', 'Vérifiez Docker Desktop ; ne modifiez pas les permissions d’un socket inconnu.'),
      panne('Erreur de téléchargement ou d’architecture', 'L’image peut être inaccessible, ou ne pas proposer votre architecture.', 'Vérifiez la connexion, l’image et l’architecture indiquée par Docker Desktop.', 'Vérifiez la connexion, docker info et l’architecture de l’image.', 'Vérifiez la connexion et la variante Intel/Apple silicon de Docker Desktop.')
    ]
  },
  vercel: {
    fondamentaux: [
      ['Projet lié', 'Le dossier local est associé à un projet et une équipe Vercel ; vérifiez cette association avant toute publication.'],
      ['Prévisualisation', 'Déploiement de test avec son URL ; il précède une publication en production.'],
      ['Production', 'Adresse utilisée par les visiteurs ; une commande de publication modifie l’application accessible publiquement.']
    ],
    installation: parSysteme(
      ['Installez Node.js/npm et vérifiez node --version et npm --version.', 'Lisez vercel.com/docs/cli avant la première utilisation. npx vercel --version peut télécharger le paquet officiel ; contrôlez le nom avant d’accepter.', 'Ouvrez le dossier du projet connu ; n’exécutez pas vercel link ou vercel --prod tant que l’équipe et le projet cible ne sont pas identifiés.'],
      ['Installez Node.js/npm et vérifiez node --version et npm --version.', 'Lisez vercel.com/docs/cli. npx vercel --version peut télécharger le paquet officiel au premier lancement.', 'Vérifiez le dossier du projet et l’équipe avant toute liaison ou publication.'],
      ['Installez Node.js/npm et vérifiez node --version et npm --version.', 'Lisez vercel.com/docs/cli. npx vercel --version peut télécharger le paquet officiel au premier lancement.', 'Vérifiez le dossier du projet et l’équipe avant toute liaison ou publication.']
    ),
    commandes: [
      commande('Afficher la version de la CLI ; peut télécharger le paquet si absent.', 'npx vercel --version', 'npx vercel --version'),
      commande('Identifier le compte connecté, si une session existe.', 'npx vercel whoami', 'npx vercel whoami'),
      commande('Afficher l’équipe active sans déployer.', 'npx vercel teams list', 'npx vercel teams list'),
      commande('Inspecter les projets visibles avant de lier le dossier.', 'npx vercel project list', 'npx vercel project list')
    ],
    essai: { titre: 'Vérifier l’outil sans publier', fichier: 'aucun', contenu: '', execution: parSysteme('node --version\nnpm --version\nnpx vercel --version\nnpx vercel whoami', 'node --version\nnpm --version\nnpx vercel --version\nnpx vercel whoami'), resultat: 'La version de la CLI et le compte connecté s’affichent. Si vous n’êtes pas connecté, whoami le signale ; aucune application n’est créée ni déployée.' },
    pannes: [
      panne('npx introuvable', 'La préparation Node.js/npm n’est pas terminée.', 'Rouvrez PowerShell ; vérifiez node --version et npm --version.', 'Rouvrez le terminal ; vérifiez node --version et npm --version.'),
      panne('Compte non connecté ou accès refusé', 'La CLI ne connaît pas votre session ou votre compte n’a pas accès à cette équipe.', 'Vérifiez npx vercel whoami ; suivez vercel login seulement avec le bon compte.', 'Vérifiez npx vercel whoami ; suivez vercel login seulement avec le bon compte.'),
      panne('Mauvais projet ou mauvaise équipe', 'Une liaison précédente peut viser une autre destination.', 'Avant tout déploiement, lisez .vercel/project.json et comparez ses identifiants au tableau de bord ; reliez seulement le projet existant voulu.', 'Avant tout déploiement, lisez .vercel/project.json et comparez ses identifiants au tableau de bord ; reliez seulement le projet existant voulu.')
    ]
  }
};
