'use strict';

// La préparation ne lance jamais une installation à la place de l'apprenant.
// Les commandes ci-dessous vérifient l'environnement ou travaillent dans le
// dossier d'exercice. Une distribution Linux doit suivre sa propre notice.
const outils = {
  terminal: {
    nom: 'Terminal et commandes de base', role: 'Donner des instructions au système dans un dossier courant. Le terminal ne compile pas le code à lui seul.',
    verifier: { windows: 'Get-Location', linux: 'pwd', mac: 'pwd' },
    pourquoi: 'Les étapes de projet créent des dossiers, lancent des tests et affichent les erreurs. Vérifier le dossier courant évite de modifier le mauvais projet.',
    attention: 'Une commande copiée pour Bash ne fonctionne pas toujours dans PowerShell. Lisez la commande avant Entrée ; ne lancez pas de suppression récursive ni de script téléchargé sans en comprendre la source.',
    systemes: {
      windows: { ouvrir: 'Ouvrez Windows Terminal ou PowerShell depuis le menu Démarrer. Dans VS Code : Terminal → Nouveau terminal, puis vérifiez que le profil indique PowerShell.', etapes: ['Tapez Get-Location pour connaître le dossier actif.', 'Tapez Get-ChildItem pour voir les fichiers et Set-Location CHEMIN pour changer de dossier.', 'Pour créer un dossier d’exercice : New-Item -ItemType Directory -Name atelier-demo ; puis Set-Location atelier-demo.'], diagnostic: 'Si une commande est « introuvable », essayez Get-Command NOM ; une nouvelle installation peut nécessiter de rouvrir PowerShell.' },
      linux: { ouvrir: 'Ouvrez l’application Terminal de votre distribution, ou Terminal → Nouveau terminal dans VS Code.', etapes: ['Tapez pwd pour connaître le dossier actif et ls pour voir les fichiers.', 'Utilisez cd CHEMIN pour entrer dans un dossier.', 'Pour un exercice isolé : mkdir atelier-demo puis cd atelier-demo.'], diagnostic: 'Si une commande est introuvable, command -v NOM précise si elle est accessible ; consultez ensuite la notice de votre distribution.' },
      mac: { ouvrir: 'Ouvrez Terminal depuis Applications → Utilitaires, ou Terminal → Nouveau terminal dans VS Code.', etapes: ['Tapez pwd pour connaître le dossier actif et ls pour voir les fichiers.', 'Utilisez cd CHEMIN pour entrer dans un dossier.', 'Pour un exercice isolé : mkdir atelier-demo puis cd atelier-demo.'], diagnostic: 'Si une commande est introuvable, command -v NOM vérifie sa présence. Rouvrez le terminal après une installation.' }
    },
    sources: [{ label: 'PowerShell — premiers pas', url: 'https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started' }, { label: 'GNU Bash — manuel', url: 'https://www.gnu.org/software/bash/manual/bash.html' }],
    references: ['PowerShell', 'Bash', 'Terminal', 'Shell']
  },
  vscode: {
    nom: 'Éditeur Visual Studio Code', role: 'Écrire et organiser les fichiers ; un éditeur ne remplace pas le runtime ou le compilateur.',
    verifier: { windows: 'code --version', linux: 'code --version', mac: 'code --version' },
    pourquoi: 'Un dossier ouvert comme projet permet de voir les fichiers, le terminal intégré et les messages d’erreur au même endroit.',
    attention: 'Une extension peut exécuter du code : choisissez une source connue. L’échec de code --version ne signifie pas forcément que l’éditeur graphique est absent ; il peut manquer au PATH.',
    systemes: {
      windows: { ouvrir: 'Téléchargez le programme d’installation utilisateur depuis le site officiel de VS Code, exécutez-le, puis ouvrez un dossier d’exercice avec Fichier → Ouvrir le dossier.', etapes: ['Ouvrez le dossier de votre exercice, pas un fichier isolé.', 'Ouvrez Terminal → Nouveau terminal ; le chemin doit correspondre au dossier affiché.'], diagnostic: 'Si code est introuvable, rouvrez PowerShell après installation. Vous pouvez toujours démarrer l’éditeur depuis le menu Démarrer.' },
      linux: { ouvrir: 'Choisissez le paquet officiel adapté à votre distribution (.deb, .rpm ou autre méthode documentée) sur la page VS Code.', etapes: ['Ouvrez le dossier de votre exercice.', 'Ouvrez le terminal intégré et contrôlez pwd.'], diagnostic: 'N’utilisez pas une commande apt sur une distribution qui utilise dnf, pacman ou un autre gestionnaire.' },
      mac: { ouvrir: 'Téléchargez le .dmg officiel, glissez Visual Studio Code dans Applications, puis démarrez-le depuis Applications.', etapes: ['Ouvrez le dossier de votre exercice.', 'Pour activer la commande code : Palette de commandes → Shell Command: Install code command in PATH.'], diagnostic: 'Si code est introuvable après cette étape, rouvrez le Terminal ; l’application reste accessible depuis Applications.' }
    },
    sources: [{ label: 'VS Code — installation', url: 'https://code.visualstudio.com/docs/getstarted/overview' }],
    references: ['Visual Studio Code', 'VS Code', 'code .']
  },
  git: {
    nom: 'Git', role: 'Suivre des versions locales du code ; publier sur un hébergeur est une étape distincte.',
    verifier: { windows: 'git --version', linux: 'git --version', mac: 'git --version' },
    pourquoi: 'Un commit permet de retrouver l’état d’un exercice avant une expérience risquée.',
    attention: 'git reset --hard et les nettoyages forcés peuvent perdre des modifications. Vérifiez git status et le dossier courant avant une commande qui modifie l’historique.',
    systemes: {
      windows: { ouvrir: 'Téléchargez Git for Windows depuis git-scm.com/download/win, suivez l’installateur puis rouvrez PowerShell.', etapes: ['Lancez git --version.', 'Dans un dossier d’essai seulement, lancez git init puis git status.'], diagnostic: 'Si git est introuvable, rouvrez le terminal ; vérifiez le choix d’intégration à la ligne de commande dans l’installateur.' },
      linux: { ouvrir: 'Installez le paquet Git avec le gestionnaire officiel de votre distribution ; Ubuntu/Debian utilisent par exemple sudo apt install git.', etapes: ['Lancez git --version.', 'Dans un dossier d’essai, lancez git init puis git status.'], diagnostic: 'Si apt n’existe pas, votre distribution utilise un autre gestionnaire : consultez git-scm.com/download/linux.' },
      mac: { ouvrir: 'Lancez git --version dans Terminal ; macOS peut proposer les outils de ligne de commande Apple. Sinon, utilisez l’installateur officiel Git.', etapes: ['Acceptez l’installation des outils Apple seulement si vous reconnaissez la boîte de dialogue.', 'Dans un dossier d’essai, lancez git init puis git status.'], diagnostic: 'Rouvrez Terminal si l’installation vient de se terminer.' }
    },
    sources: [{ label: 'Git — installer', url: 'https://git-scm.com/book/en/v2/Getting-Started-Installing-Git' }],
    references: ['Git', 'git init', 'git status', 'git commit']
  },
  node: {
    nom: 'Node.js et npm', role: 'Exécuter JavaScript hors du navigateur ; npm installe les dépendances déclarées par un projet.',
    verifier: { windows: 'node --version\nnpm --version', linux: 'node --version\nnpm --version', mac: 'node --version\nnpm --version' },
    pourquoi: 'Les ateliers de serveur et de frameworks utilisent Node pour lancer scripts, tests et outils de développement. npm accompagne généralement Node.',
    attention: 'Choisissez une version prise en charge par le projet. Évitez sudo npm install -g et n’exécutez pas un installateur « curl | bash » trouvé au hasard.',
    systemes: {
      windows: { ouvrir: 'Depuis nodejs.org/en/download, choisissez l’installateur officiel adapté à Windows et suivez les étapes. Rouvrez PowerShell.', etapes: ['Vérifiez node --version puis npm --version.', 'Dans un dossier de projet connu, npm install lit package.json ; ne l’exécutez pas dans un dossier inconnu.'], diagnostic: 'Si node fonctionne mais npm ne fonctionne pas, vérifiez l’installation et le PATH dans un nouveau terminal.' },
      linux: { ouvrir: 'Suivez la méthode officielle Node.js ou un gestionnaire de versions reconnu pour votre distribution ; ne copiez pas une commande apt destinée à un autre Linux.', etapes: ['Vérifiez node --version puis npm --version.', 'Dans un projet, lisez package.json avant npm install.'], diagnostic: 'Une ancienne version système peut coexister avec la nouvelle : command -v node montre quel exécutable est lancé.' },
      mac: { ouvrir: 'Depuis nodejs.org/en/download, choisissez l’installateur macOS ou la méthode recommandée pour votre machine Intel/Apple silicon.', etapes: ['Rouvrez Terminal puis vérifiez node --version et npm --version.', 'Dans un projet, lisez package.json avant npm install.'], diagnostic: 'Si le terminal utilise une autre version que prévu, command -v node indique son chemin.' }
    },
    sources: [{ label: 'Node.js — téléchargement', url: 'https://nodejs.org/en/download' }, { label: 'npm — premiers pas', url: 'https://docs.npmjs.com/downloading-and-installing-node-js-and-npm' }],
    references: ['Node.js', 'npm', 'npx', 'React', 'Vue', 'Angular', 'Next.js', 'TypeScript']
  },
  python: {
    nom: 'Python, pip et environnement virtuel', role: 'Interpréter les fichiers .py ; pip installe les packages dans un environnement choisi.',
    verifier: { windows: 'py --version', linux: 'python3 --version', mac: 'python3 --version' },
    pourquoi: 'Un environnement virtuel isole les dépendances d’un atelier du Python utilisé par le système et des autres projets.',
    attention: 'N’installez pas les dépendances d’un exercice dans le Python système avec sudo pip. Sur Windows, py et python ne pointent pas forcément vers la même installation.',
    systemes: {
      windows: { ouvrir: 'Sur python.org/downloads, installez la version stable adaptée à Windows avec l’installateur officiel, puis rouvrez PowerShell.', etapes: ['Vérifiez py --version.', 'Dans un dossier d’exercice : py -m venv .venv.', 'Utilisez .\\.venv\\Scripts\\python.exe -m pip --version sans avoir à modifier la politique PowerShell.'], diagnostic: 'Si py est introuvable, consultez le guide Windows du gestionnaire d’installation Python ; vérifiez que le terminal a été rouvert.' },
      linux: { ouvrir: 'Utilisez le paquet Python 3 et le paquet venv de votre distribution. Sur Debian/Ubuntu : sudo apt install python3 python3-venv python3-pip.', etapes: ['Vérifiez python3 --version.', 'Dans un dossier d’exercice : python3 -m venv .venv.', 'Utilisez .venv/bin/python -m pip --version pour confirmer l’isolation.'], diagnostic: 'Si venv manque, installez le paquet venv adapté à votre version et distribution ; ne modifiez pas le Python système.' },
      mac: { ouvrir: 'Installez Python 3 depuis python.org/downloads ou une méthode documentée par votre gestionnaire de paquets ; ne remplacez pas le Python interne de macOS.', etapes: ['Vérifiez python3 --version.', 'Dans un dossier d’exercice : python3 -m venv .venv.', 'Utilisez .venv/bin/python -m pip --version.'], diagnostic: 'Si python3 pointe vers une autre version, command -v python3 aide à comprendre le PATH.' }
    },
    sources: [{ label: 'Python — télécharger', url: 'https://www.python.org/downloads/' }, { label: 'Python — environnements virtuels', url: 'https://docs.python.org/3/library/venv.html' }, { label: 'Python — installation Windows', url: 'https://docs.python.org/3/using/windows.html' }],
    references: ['Python', 'pip', 'venv', 'pytest']
  },
  jdk: {
    nom: 'JDK Java', role: 'Compiler avec javac et exécuter avec java ; un JRE seul ne suffit pas pour coder.',
    verifier: { windows: 'java -version\njavac -version', linux: 'java -version\njavac -version', mac: 'java -version\njavac -version' },
    pourquoi: 'Java et Spring Boot ont besoin d’un kit de développement. Vérifier à la fois java et javac révèle un runtime installé sans compilateur.',
    attention: 'Plusieurs JDK peuvent coexister. Assurez-vous que java et javac viennent de la même installation ; ne changez pas JAVA_HOME à l’aveugle.',
    systemes: {
      windows: { ouvrir: 'Téléchargez un JDK Temurin adapté à Windows depuis adoptium.net/installation et utilisez l’installateur MSI officiel.', etapes: ['Rouvrez PowerShell.', 'Vérifiez java -version puis javac -version.', 'Dans le dossier d’exercice : javac Bonjour.java puis java Bonjour.'], diagnostic: 'Si java marche et javac manque, un runtime seul ou un PATH différent est probablement actif.' },
      linux: { ouvrir: 'Installez un paquet JDK adapté à votre distribution depuis ses dépôts ou les instructions officielles Adoptium.', etapes: ['Vérifiez java -version puis javac -version.', 'Compilez un petit fichier dans un dossier d’exercice avec javac Bonjour.java.'], diagnostic: 'command -v java et command -v javac aident à trouver deux chemins incompatibles.' },
      mac: { ouvrir: 'Téléchargez le paquet PKG JDK pour macOS adapté à votre puce depuis Adoptium, puis suivez l’installateur.', etapes: ['Rouvrez Terminal et vérifiez java -version puis javac -version.', 'Compilez un petit fichier dans un dossier d’exercice.'], diagnostic: '/usr/libexec/java_home -V liste les JDK reconnus par macOS si plusieurs versions sont installées.' }
    },
    sources: [{ label: 'Adoptium — installer un JDK', url: 'https://adoptium.net/installation' }, { label: 'Java — démarrer', url: 'https://dev.java/learn/' }],
    references: ['Java', 'JDK', 'JVM', 'javac', 'Maven']
  },
  springboot: {
    nom: 'Spring Boot et wrapper de build', role: 'Créer une application web Java ; le wrapper Maven/Gradle livré avec le projet lance la version de build attendue.',
    verifier: { windows: '.\\mvnw.cmd --version', linux: './mvnw --version', mac: './mvnw --version' },
    pourquoi: 'Le projet généré par Spring Initializr contient ses dépendances et un wrapper : inutile de demander à un débutant d’installer Maven globalement pour son premier atelier.',
    attention: 'Le wrapper est un script du projet : inspectez son origine avant exécution. Démarrer le serveur ouvre un port local ; ne publiez pas une API d’exercice avec des secrets.',
    systemes: {
      windows: { ouvrir: 'Après avoir installé le JDK, ouvrez start.spring.io, choisissez Java, Maven et la dépendance Web, puis téléchargez et décompressez le projet.', etapes: ['Ouvrez le dossier contenant pom.xml dans PowerShell.', 'Vérifiez .\\mvnw.cmd --version.', 'Lancez .\\mvnw.cmd spring-boot:run et ouvrez http://localhost:8080.'], diagnostic: 'Si le wrapper n’existe pas, vous n’êtes peut-être pas à la racine du projet ; vérifiez Get-Location et Get-ChildItem.' },
      linux: { ouvrir: 'Après le JDK, générez un projet Java/Maven avec la dépendance Web sur start.spring.io, puis décompressez-le.', etapes: ['Entrez dans le dossier contenant pom.xml.', 'Vérifiez ./mvnw --version.', 'Lancez ./mvnw spring-boot:run ; testez http://localhost:8080.'], diagnostic: 'Si « permission denied » apparaît sur un wrapper officiel, vérifiez les droits du fichier ; ne donnez pas tous les droits au dossier.' },
      mac: { ouvrir: 'Après le JDK, générez un projet Java/Maven avec la dépendance Web sur start.spring.io, puis décompressez-le.', etapes: ['Entrez dans le dossier contenant pom.xml.', 'Vérifiez ./mvnw --version.', 'Lancez ./mvnw spring-boot:run ; testez http://localhost:8080.'], diagnostic: 'Si le port 8080 est occupé, arrêtez l’autre service ou configurez un autre port pour cet exercice.' }
    },
    sources: [{ label: 'Spring — première application', url: 'https://docs.spring.io/spring-boot/tutorial/first-application/' }, { label: 'Spring Initializr', url: 'https://start.spring.io/' }],
    references: ['Spring Boot', 'Spring Initializr', 'Maven wrapper', 'pom.xml']
  },
  cpp: {
    nom: 'Compilateur C++', role: 'Transformer du C++ en programme exécutable ; VS Code seul ne compile rien.',
    verifier: { windows: 'cl', linux: 'g++ --version', mac: 'clang++ --version' },
    pourquoi: 'Compiler révèle les erreurs de syntaxe et de type avant l’exécution ; le programme produit doit ensuite être lancé séparément.',
    attention: 'Les binaires diffèrent selon système et architecture. Ne téléchargez pas un compilateur depuis une page inconnue ; ouvrez le terminal approprié à l’outil installé.',
    systemes: {
      windows: { ouvrir: 'Installez Visual Studio Community ou Build Tools depuis Microsoft avec la charge « Développement Desktop en C++ » ; ouvrez Developer PowerShell for VS.', etapes: ['Tapez cl pour vérifier que le compilateur est disponible.', 'Dans le dossier d’exercice : cl /EHsc main.cpp puis .\\main.exe.'], diagnostic: 'Dans un PowerShell ordinaire, cl peut être introuvable même si Visual Studio est installé ; utilisez Developer PowerShell.' },
      linux: { ouvrir: 'Installez le compilateur C++ de votre distribution. Sur Debian/Ubuntu : sudo apt install g++.', etapes: ['Vérifiez g++ --version.', 'Dans le dossier d’exercice : g++ -std=c++20 -Wall -Wextra main.cpp -o atelier puis ./atelier.'], diagnostic: 'Si g++ est absent, vérifiez le gestionnaire de paquets de votre distribution ; un éditeur ne fournit pas le compilateur.' },
      mac: { ouvrir: 'Installez les outils de ligne de commande Apple avec xcode-select --install, puis suivez la boîte de dialogue système.', etapes: ['Vérifiez clang++ --version.', 'Dans le dossier d’exercice : clang++ -std=c++20 -Wall -Wextra main.cpp -o atelier puis ./atelier.'], diagnostic: 'Si les outils sont déjà installés mais introuvables, vérifiez xcode-select -p avant toute réinstallation.' }
    },
    sources: [{ label: 'Microsoft — outils C++', url: 'https://learn.microsoft.com/en-us/cpp/build/vscpp-step-0-installation' }, { label: 'GCC — documentation', url: 'https://gcc.gnu.org/onlinedocs/' }, { label: 'Apple — outils développeur', url: 'https://developer.apple.com/xcode/resources/' }],
    references: ['C++', 'g++', 'clang++', 'MSVC', 'CMake']
  },
  dotnet: {
    nom: 'SDK .NET pour C#', role: 'Compiler et lancer une application C# avec dotnet ; le runtime seul permet surtout de l’exécuter.',
    verifier: { windows: 'dotnet --info', linux: 'dotnet --info', mac: 'dotnet --info' },
    pourquoi: 'Le SDK fournit modèles, compilateur et commandes de test ; sa version doit correspondre au projet.',
    attention: 'Choisissez le SDK, pas seulement « Runtime ». Vérifiez l’architecture de la machine et la version ciblée par le fichier .csproj.',
    systemes: {
      windows: { ouvrir: 'Téléchargez le SDK .NET depuis Microsoft ou suivez le guide Windows officiel, puis rouvrez PowerShell.', etapes: ['Vérifiez dotnet --info.', 'Dans un dossier vide : dotnet new console ; puis dotnet run.'], diagnostic: 'Si dotnet --info ne liste aucun SDK, vous avez peut-être seulement le runtime.' },
      linux: { ouvrir: 'Choisissez votre distribution dans le guide Microsoft .NET Linux et installez son paquet SDK ; n’utilisez pas une commande Ubuntu sur Fedora.', etapes: ['Vérifiez dotnet --info.', 'Dans un dossier vide : dotnet new console ; puis dotnet run.'], diagnostic: 'Si la commande existe sans SDK, consultez la source de paquets configurée pour votre distribution.' },
      mac: { ouvrir: 'Téléchargez le SDK macOS depuis Microsoft, en choisissant Apple silicon ou Intel selon votre Mac.', etapes: ['Rouvrez Terminal et vérifiez dotnet --info.', 'Dans un dossier vide : dotnet new console ; puis dotnet run.'], diagnostic: 'Une architecture incorrecte peut expliquer un lancement impossible : vérifiez le paquet téléchargé.' }
    },
    sources: [{ label: 'Microsoft — installer .NET', url: 'https://learn.microsoft.com/en-us/dotnet/core/install/' }],
    references: ['C#', '.NET', 'dotnet', 'ASP.NET Core', 'NuGet']
  },
  php: {
    nom: 'PHP en ligne de commande', role: 'Exécuter un script PHP ou démarrer un petit serveur local pour apprendre ; un serveur de développement n’est pas une production.',
    verifier: { windows: 'php -v', linux: 'php -v', mac: 'php -v' },
    pourquoi: 'La commande php permet de tester des fonctions sans configurer immédiatement Apache ou Nginx.',
    attention: 'Le serveur intégré php -S est uniquement pour le développement local. Ne copiez pas php.ini de production sans comprendre les extensions et messages d’erreur.',
    systemes: {
      windows: { ouvrir: 'Suivez le manuel PHP Windows pour choisir une distribution officielle, installez-la et rendez php.exe accessible au terminal.', etapes: ['Rouvrez PowerShell puis vérifiez php -v.', 'Dans un dossier d’essai : php bonjour.php.', 'Pour une page locale : php -S 127.0.0.1:8000 ; arrêtez avec Ctrl+C.'], diagnostic: 'Si php est introuvable, vérifiez l’emplacement de php.exe et le PATH ; ne confondez pas le serveur web et l’interpréteur.' },
      linux: { ouvrir: 'Installez le paquet PHP CLI de votre distribution ; Debian/Ubuntu proposent par exemple sudo apt install php-cli.', etapes: ['Vérifiez php -v.', 'Exécutez php bonjour.php dans le dossier d’exercice.', 'Pour tester une page : php -S 127.0.0.1:8000 puis Ctrl+C.'], diagnostic: 'Si le paquet est absent, lisez la page d’installation PHP correspondant à votre distribution et version.' },
      mac: { ouvrir: 'Suivez le manuel PHP pour macOS et utilisez une distribution maintenue ou un gestionnaire de paquets documenté ; ne supposez pas que PHP est préinstallé.', etapes: ['Vérifiez php -v.', 'Exécutez php bonjour.php.', 'Pour une page locale : php -S 127.0.0.1:8000 puis Ctrl+C.'], diagnostic: 'Si plusieurs PHP coexistent, command -v php révèle celui du terminal.' }
    },
    sources: [{ label: 'PHP — installation', url: 'https://www.php.net/manual/en/install.php' }, { label: 'PHP — serveur intégré', url: 'https://www.php.net/manual/en/features.commandline.webserver.php' }],
    references: ['PHP', 'php-cli', 'Composer', 'PDO']
  },
  composer: {
    nom: 'Composer pour PHP', role: 'Déclarer et installer les dépendances PHP d’un projet ; PHP doit déjà fonctionner.',
    verifier: { windows: 'composer --version', linux: 'composer --version', mac: 'composer --version' },
    pourquoi: 'composer.json et composer.lock permettent de retrouver les mêmes packages sur une autre machine ou en CI.',
    attention: 'Composer exécute du code de packages pendant certaines opérations. Lisez composer.json avant composer install et n’exécutez pas un installateur téléchargé sans en vérifier la source.',
    systemes: {
      windows: { ouvrir: 'Après PHP, utilisez Composer-Setup.exe indiqué dans la documentation officielle getcomposer.org. Rouvrez PowerShell à la fin.', etapes: ['Vérifiez composer --version.', 'Dans un projet PHP connu, lisez composer.json puis lancez composer install.'], diagnostic: 'Si Composer est introuvable, ouvrez un nouveau terminal et vérifiez que PHP lui-même répond à php -v.' },
      linux: { ouvrir: 'Après PHP, suivez la procédure officielle Composer pour Linux ; elle propose une installation locale ou dans votre PATH. Examinez l’installateur avant de l’exécuter.', etapes: ['Vérifiez composer --version, ou php composer.phar --version si installé localement.', 'Lisez composer.json avant composer install.'], diagnostic: 'Si composer est introuvable, vérifiez le PATH ou utilisez le fichier composer.phar dans le dossier où il a été installé.' },
      mac: { ouvrir: 'Après PHP, suivez la procédure officielle Composer pour macOS ; une installation locale suffit pour un exercice.', etapes: ['Vérifiez composer --version, ou php composer.phar --version.', 'Lisez composer.json avant composer install.'], diagnostic: 'Si composer est introuvable, vérifiez le chemin du fichier et relancez Terminal.' }
    },
    sources: [{ label: 'Composer — installation officielle', url: 'https://getcomposer.org/doc/00-intro.md' }],
    references: ['Composer', 'composer.json', 'composer.lock']
  },
  docker: {
    nom: 'Docker', role: 'Exécuter des applications isolées dans des conteneurs ; ce n’est pas requis pour les premiers exercices de langage.',
    verifier: { windows: 'docker version', linux: 'docker version', mac: 'docker version' },
    pourquoi: 'Un conteneur rend une dépendance de projet plus reproductible quand l’équipe a besoin du même environnement.',
    attention: 'Docker Desktop peut avoir des conditions de licence selon l’usage. Ne montez pas un dossier sensible ni le socket Docker dans un conteneur inconnu.',
    systemes: {
      windows: { ouvrir: 'Suivez le guide Docker Desktop Windows officiel et ses prérequis de virtualisation/WSL, puis démarrez Docker Desktop.', etapes: ['Vérifiez docker version : client ET serveur doivent répondre.', 'Utilisez un projet d’exercice officiel avant de tirer une image inconnue.'], diagnostic: 'Si seul le client répond, Docker Desktop ou son moteur n’est probablement pas démarré.' },
      linux: { ouvrir: 'Choisissez Docker Desktop ou Docker Engine selon la documentation officielle de votre distribution.', etapes: ['Vérifiez docker version : client ET serveur doivent répondre.', 'Testez dans un projet non sensible.'], diagnostic: 'Ne résolvez pas une erreur de permission avec chmod 777 sur le socket Docker.' },
      mac: { ouvrir: 'Installez Docker Desktop depuis la documentation officielle pour la bonne puce, puis démarrez l’application.', etapes: ['Vérifiez docker version : client ET serveur doivent répondre.', 'Testez dans un dossier d’exercice.'], diagnostic: 'Si seul le client répond, attendez le démarrage du moteur dans Docker Desktop.' }
    },
    sources: [{ label: 'Docker — installation par système', url: 'https://docs.docker.com/get-started/get-docker/' }],
    references: ['Docker', 'Dockerfile', 'docker compose', 'conteneur']
  },
  vercel: {
    nom: 'CLI Vercel', role: 'Prévisualiser ou déployer un projet lié à un compte Vercel ; inutile pour lire les leçons ou tester un serveur local.',
    verifier: { windows: 'npx vercel --version', linux: 'npx vercel --version', mac: 'npx vercel --version' },
    pourquoi: 'La CLI sert au déploiement et aux diagnostics ; une première expérience peut se faire par l’intégration Git sans commande de publication.',
    attention: 'npx peut télécharger un package si absent : vérifiez sa provenance. Une commande --prod affecte le site public ; testez sur une prévisualisation avant.',
    systemes: {
      windows: { ouvrir: 'Installez d’abord Node.js/npm. Lisez la documentation CLI Vercel et identifiez le projet avant toute commande de déploiement.', etapes: ['Dans un projet non sensible, npx vercel --version confirme l’outil.', 'Liez uniquement le projet voulu ; vérifiez le nom et l’équipe.'], diagnostic: 'Si npx est introuvable, vérifiez Node.js/npm avant Vercel.' },
      linux: { ouvrir: 'Installez d’abord Node.js/npm, puis suivez la documentation CLI Vercel.', etapes: ['Vérifiez npx vercel --version dans un projet d’essai.', 'Vérifiez l’équipe et le projet liés avant un déploiement.'], diagnostic: 'Si npx est introuvable, reprenez la préparation Node.js.' },
      mac: { ouvrir: 'Installez d’abord Node.js/npm, puis suivez la documentation CLI Vercel.', etapes: ['Vérifiez npx vercel --version dans un projet d’essai.', 'Vérifiez l’équipe et le projet liés avant un déploiement.'], diagnostic: 'Si npx est introuvable, reprenez la préparation Node.js.' }
    },
    sources: [{ label: 'Vercel — CLI', url: 'https://vercel.com/docs/cli' }],
    references: ['Vercel', 'vercel deploy', 'vercel.json']
  }
};

const domaines = {
  html: ['vscode'], css: ['vscode'], javascript: ['vscode'], dom: ['vscode'],
  node: ['node', 'vscode'], npm: ['node', 'vscode'], http: ['terminal'], express: ['node', 'vscode'], shell: ['terminal', 'git'],
  typescript: ['node', 'vscode'], react: ['node', 'vscode'], nextjs: ['node', 'vscode'], vue: ['node', 'vscode'], angular: ['node', 'vscode'], 'css-outils': ['node', 'vscode'],
  python: ['python', 'vscode'], java: ['jdk', 'vscode'], springboot: ['jdk', 'springboot', 'vscode'], cpp: ['cpp', 'vscode'], csharp: ['dotnet', 'vscode'], php: ['php', 'composer', 'vscode']
};

module.exports = { outils, domaines };
