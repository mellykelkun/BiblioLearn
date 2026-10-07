'use strict';

const { fiche, texte, code, comparaison, alerte, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'shell-premier-terminal', domaine: 'shell', categorie: 'Préparer son poste',
    titre: 'Ouvrir le terminal et retrouver son dossier',
    resume: 'Démarrer PowerShell sur Windows ou Terminal sur Linux/macOS, lire le dossier courant et créer un dossier d’essai sans risque.',
    tags: ['Windows', 'PowerShell', 'Linux', 'macOS', 'terminal', 'pwd', 'Get-Location'],
    guide: {
      modele: 'Le terminal est une fenêtre qui envoie des instructions au système. Une commande agit depuis un dossier courant ; ce dossier décide où les fichiers sont lus ou créés. PowerShell et Bash ne parlent pas toujours exactement le même langage.',
      scenario: 'Avant un atelier Java ou Python, vous devez créer un dossier isolé. Windows peut utiliser PowerShell et Get-Location ; Linux et macOS utilisent souvent un shell avec pwd. Dans les deux cas, vérifiez le chemin affiché avant de créer un fichier.',
      exercice: 'Ouvrez le terminal de votre système. Affichez le dossier courant, créez un dossier atelier-test, entrez dedans, puis affichez de nouveau le chemin. Notez la commande utilisée et le chemin observé ; ne touchez pas à un autre projet.',
      correction: 'Sur Windows PowerShell, Get-Location, New-Item -ItemType Directory -Name atelier-test puis Set-Location atelier-test montrent le changement. Sur Linux/macOS, pwd, mkdir atelier-test puis cd atelier-test produisent la même intention. La différence est la syntaxe, pas le but.',
      indice: 'Commencez par Get-Location sous PowerShell ou pwd sous Linux/macOS.'
    },
    sections: [
      texte('Pourquoi cette étape existe', 'Un exercice échoue souvent parce que le terminal n’est pas dans le dossier contenant le fichier ou le projet. Le prompt donne parfois un indice, mais une commande explicite est plus fiable.'),
      comparaison('Même intention, commandes différentes', ['Action', 'Windows PowerShell', 'Linux/macOS'], [
        ['Afficher le dossier actif', 'Get-Location', 'pwd'],
        ['Lister les fichiers', 'Get-ChildItem', 'ls'],
        ['Entrer dans un dossier', 'Set-Location atelier-test', 'cd atelier-test'],
        ['Créer un dossier', 'New-Item -ItemType Directory -Name atelier-test', 'mkdir atelier-test']
      ]),
      code('Sur Windows PowerShell', 'PowerShell', 'Get-Location\nNew-Item -ItemType Directory -Name atelier-test\nSet-Location atelier-test\nGet-Location', 'Chaque ligne s’exécute dans PowerShell ; le dossier doit être dédié à l’exercice.'),
      code('Sur Linux et macOS', 'Bash / zsh', 'pwd\nmkdir atelier-test\ncd atelier-test\npwd', 'Le second pwd doit finir par atelier-test.'),
      alerte('attention', 'Ne copiez pas une commande de suppression', 'Une commande qui efface des fichiers peut être irréversible. Ne lancez pas une instruction de tutoriel si son dossier cible ou sa signification n’est pas claire.'),
      liens({ label: 'PowerShell — premiers pas', url: 'https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started' }, { label: 'GNU Bash — manuel', url: 'https://www.gnu.org/software/bash/manual/bash.html' })
    ],
    associes: ['shell-pwd-ls-cd', 'shell-env-path']
  }),
  fiche({
    id: 'shell-installer-verifier-outil', domaine: 'shell', categorie: 'Préparer son poste',
    titre: 'Installer un outil et vérifier son exécutable',
    resume: 'Distinguer éditeur, runtime, SDK et compilateur ; contrôler la version et le PATH avant de démarrer un exercice.',
    tags: ['installation', 'Windows', 'Linux', 'macOS', 'PATH', 'SDK', 'runtime', 'compilateur'],
    guide: {
      modele: 'Installer un outil signifie rendre un programme disponible sur la machine. Le PATH est la liste des dossiers où le terminal cherche une commande ; un programme peut être installé mais introuvable dans un ancien terminal ou dans un autre profil.',
      scenario: 'Un apprenant a installé VS Code, puis tape javac et obtient « commande introuvable ». L’éditeur est présent, mais le JDK ne l’est peut-être pas. Il faut vérifier le bon outil, son emplacement et le terminal utilisé avant de changer du code.',
      exercice: 'Choisissez un outil requis par votre atelier. Ouvrez sa page officielle, notez la différence entre runtime et SDK/compilateur, installez-le si nécessaire, rouvrez le terminal et lancez sa commande de version. Notez le résultat exact sans afficher de secret.',
      correction: 'Un contrôle de version qui répond confirme que le terminal trouve un exécutable, pas que tout le projet fonctionne. Pour Java, vérifiez java et javac ; pour .NET, dotnet --info doit lister un SDK ; pour Docker, docker version doit montrer client et serveur.',
      indice: 'Repérez dans la préparation de la leçon la commande « Vérifier » adaptée à votre système.'
    },
    sections: [
      texte('Quel outil choisir', 'Un éditeur écrit du code. Un interpréteur exécute Python ou PHP. Un compilateur transforme Java ou C++ en programme exécutable. Un SDK rassemble plusieurs outils de développement. Installer seulement l’éditeur ne suffit donc pas.'),
      comparaison('Symptôme et diagnostic', ['Symptôme', 'À vérifier', 'Décision'], [
        ['Commande introuvable', 'PATH, nouveau terminal et installation officielle', 'Ne modifiez pas le code de la leçon.'],
        ['Runtime présent, compilation impossible', 'Présence du JDK ou du SDK, pas seulement du runtime', 'Installer le kit de développement adapté.'],
        ['Mauvaise version', 'Chemin du programme réellement invoqué', 'Aligner la version sur le projet sans écraser le système.']
      ]),
      code('Vérifications sans installation', 'PowerShell / Bash', 'node --version\npython3 --version\njava -version\njavac -version\ndotnet --info\nphp -v', 'Ces commandes ne changent pas vos fichiers. Sur Windows, Python peut répondre plutôt à py --version.'),
      alerte('attention', 'Ne pas masquer le problème', 'Évitez les commandes sudo, les modifications de PATH ou les scripts téléchargés copiés au hasard. Lisez la notice officielle correspondant exactement à votre système.'),
      liens({ label: 'Python — téléchargement', url: 'https://www.python.org/downloads/' }, { label: '.NET — installer', url: 'https://learn.microsoft.com/en-us/dotnet/core/install/' }, { label: 'Adoptium — installer le JDK', url: 'https://adoptium.net/installation' })
    ],
    associes: ['shell-premier-terminal', 'shell-env-path']
  }),
  fiche({
    id: 'shell-powershell-bash', domaine: 'shell', categorie: 'Préparer son poste',
    titre: 'Traduire une consigne Bash vers PowerShell',
    resume: 'Comprendre quand les commandes des tutoriels diffèrent sous Windows et éviter de copier une syntaxe Unix au mauvais endroit.',
    tags: ['PowerShell', 'Bash', 'Windows', 'Linux', 'macOS', 'terminal', 'scripts'],
    guide: {
      modele: 'Une consigne de terminal a une intention et une syntaxe. Le chemin, les variables et les scripts ne s’écrivent pas toujours pareil dans PowerShell et Bash. Traduire l’intention est plus sûr que remplacer des mots mécaniquement.',
      scenario: 'Un atelier Spring Boot montre ./mvnw spring-boot:run. Dans PowerShell, le fichier correspondant est souvent .\\mvnw.cmd. Le wrapper est livré avec le projet ; le problème n’est pas une erreur dans votre code Java.',
      exercice: 'Dans un dossier d’essai, affichez le chemin courant puis listez les fichiers avec la commande de votre système. Écrivez ensuite l’équivalent de ./mvnw --version pour PowerShell, sans lancer le wrapper d’un projet inconnu.',
      correction: 'Bash/zsh : pwd et ls ; PowerShell : Get-Location et Get-ChildItem. Un wrapper Maven généré se lance souvent avec .\\mvnw.cmd --version sur Windows et ./mvnw --version sur Linux/macOS. Vérifiez que le fichier est réellement présent avant de l’exécuter.',
      indice: 'PowerShell utilise souvent .\\ pour lancer un fichier du dossier courant ; Bash/zsh utilisent ./.'
    },
    sections: [
      texte('Lire la consigne avant de traduire', 'Repérez le dossier, le fichier lancé, les arguments et le résultat attendu. Si le tutoriel fournit un tableau Windows/Linux/macOS, choisissez la colonne de votre terminal, pas seulement de votre système d’exploitation. WSL utilise des commandes Linux sur Windows.'),
      comparaison('Exemples sûrs', ['Intention', 'PowerShell', 'Bash/zsh'], [
        ['Voir le dossier', 'Get-Location', 'pwd'],
        ['Voir les fichiers', 'Get-ChildItem', 'ls'],
        ['Lancer Maven wrapper', '.\\mvnw.cmd --version', './mvnw --version'],
        ['Chercher une commande', 'Get-Command java', 'command -v java']
      ]),
      code('Choisir le bon wrapper', 'PowerShell / Bash', '.\\mvnw.cmd spring-boot:run\n# Windows PowerShell\n\n./mvnw spring-boot:run\n# Linux/macOS Bash ou zsh', 'Ces commandes sont des alternatives ; n’exécutez pas les deux.'),
      alerte('attention', 'Le shell ne change pas le système cible', 'WSL ou un conteneur Linux sous Windows possède son propre environnement. Un outil installé dans Windows n’est pas forcément disponible dans WSL, et inversement.'),
      liens({ label: 'PowerShell — concepts', url: 'https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/01-getting-started' })
    ],
    associes: ['shell-premier-terminal', 'shell-installer-verifier-outil']
  })
];
