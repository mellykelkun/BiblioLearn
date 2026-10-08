'use strict';

// Les pages officielles restent à jour quand une version ou une architecture
// change. Un binaire direct n'est proposé que si son URL officielle est stable.
const page = (label, url, precision) => ({ label, url, precision, type: 'page' });
const guide = (label, url, precision) => ({ label, url, precision, type: 'guide' });
const fichier = (label, url, precision) => ({ label, url, precision, type: 'fichier' });
const choix = (note, ...liens) => ({ note, liens });

module.exports = {
  terminal: {
    windows: choix('PowerShell est déjà fourni par Windows ; aucun téléchargement n’est nécessaire pour les commandes de base.', guide('Ouvrir le guide Windows Terminal', 'https://learn.microsoft.com/en-us/windows/terminal/install', 'Windows Terminal est facultatif et peut héberger PowerShell.')),
    linux: choix('Le terminal et le shell sont normalement fournis par votre distribution ; aucun exécutable universel n’est à télécharger.', guide('Lire le manuel officiel de Bash', 'https://www.gnu.org/software/bash/manual/bash.html', 'Si votre terminal manque, utilisez l’aide de votre distribution.')),
    mac: choix('Terminal et zsh sont fournis avec macOS ; aucun téléchargement n’est nécessaire.', guide('Ouvrir le guide Terminal d’Apple', 'https://support.apple.com/guide/terminal/welcome/mac', 'Pour retrouver l’application et ses commandes de base.'))
  },
  vscode: {
    windows: choix('Choisissez « User Installer » pour votre architecture Windows.', page('Télécharger VS Code pour Windows', 'https://code.visualstudio.com/download', 'Sélectionnez x64 ou Arm64 selon votre ordinateur.')),
    linux: choix('Choisissez le paquet correspondant à votre distribution ; le site propose notamment .deb et .rpm.', page('Télécharger VS Code pour Linux', 'https://code.visualstudio.com/download', 'Paquets .deb, .rpm et autres options officielles.'), guide('Voir les méthodes Linux', 'https://code.visualstudio.com/docs/setup/linux', 'Choisir la méthode propre à votre distribution.')),
    mac: choix('Choisissez le téléchargement macOS adapté à votre puce.', page('Télécharger VS Code pour macOS', 'https://code.visualstudio.com/download', 'Sélectionnez Intel ou Apple silicon.'))
  },
  git: {
    windows: choix('La page Git propose le programme d’installation Windows et les variantes d’architecture.', page('Télécharger Git pour Windows', 'https://git-scm.com/install/windows', 'Choisissez x64 ou ARM64 sur la page officielle.')),
    linux: choix('Git s’installe en général depuis les paquets de votre distribution.', guide('Voir les commandes Git par distribution', 'https://git-scm.com/install/linux', 'Debian, Fedora, Arch et autres méthodes sont distinguées.')),
    mac: choix('macOS peut proposer les outils Apple lorsque vous tapez git --version ; Git publie aussi ses autres méthodes.', page('Installer Git sur macOS', 'https://git-scm.com/install/mac', 'Comparez les options proposées à votre système.'))
  },
  node: {
    windows: choix('Choisissez la version LTS, puis l’installateur Windows pour votre architecture.', page('Télécharger Node.js pour Windows', 'https://nodejs.org/en/download', 'La page officielle propose l’installateur correspondant au système.')),
    linux: choix('Sélectionnez Linux sur la page Node.js et suivez la méthode compatible avec votre distribution et le projet.', page('Ouvrir le téléchargement Node.js pour Linux', 'https://nodejs.org/en/download', 'Choisissez la version LTS et la méthode d’installation de votre système.'), guide('Lire les méthodes npm/Node.js', 'https://docs.npmjs.com/downloading-and-installing-node-js-and-npm', 'Aide pour choisir entre installateur et gestionnaire de versions.')),
    mac: choix('Choisissez la version LTS et le paquet macOS adapté à Intel ou Apple silicon.', page('Télécharger Node.js pour macOS', 'https://nodejs.org/en/download', 'Vérifiez la puce de votre Mac avant de choisir le paquet.'))
  },
  python: {
    windows: choix('La page Windows propose le gestionnaire d’installation Python et des installateurs selon l’architecture.', page('Télécharger Python pour Windows', 'https://www.python.org/downloads/windows/', 'Choisissez le gestionnaire ou un installateur stable compatible.')),
    linux: choix('Le paquet Python 3 et venv viennent généralement de votre distribution ; évitez un exécutable prévu pour un autre Linux.', guide('Installer Python sur Linux/Unix', 'https://docs.python.org/3/using/unix.html', 'Suivez la section adaptée à votre système et à votre gestionnaire de paquets.')),
    mac: choix('La page macOS fournit les installateurs signés et les versions stables de Python.', page('Télécharger Python pour macOS', 'https://www.python.org/downloads/macos/', 'Choisissez un installateur stable compatible avec votre Mac.'))
  },
  jdk: {
    windows: choix('Sélectionnez Windows, votre architecture et le paquet JDK, pas JRE.', page('Télécharger un JDK Temurin Windows', 'https://adoptium.net/temurin/releases/', 'Filtrez par OS, architecture et version Java attendue.')),
    linux: choix('Le paquet JDK de votre distribution convient souvent ; Temurin publie également ses paquets Linux.', page('Choisir un JDK Temurin Linux', 'https://adoptium.net/temurin/releases/', 'Sélectionnez Linux, architecture et JDK.'), guide('Voir l’installation Temurin', 'https://adoptium.net/installation/', 'Paquets et gestionnaires pris en charge.')),
    mac: choix('Sélectionnez macOS, Intel ou Apple silicon et le paquet JDK.', page('Télécharger un JDK Temurin macOS', 'https://adoptium.net/temurin/releases/', 'Filtrez par OS, architecture et version Java attendue.'))
  },
  springboot: {
    windows: choix('Spring Boot se prépare en générant un projet après l’installation du JDK ; choisissez Java, Maven et Spring Web.', page('Générer le projet Spring Boot', 'https://start.spring.io/', 'Télécharge un ZIP de projet, pas un installateur système.')),
    linux: choix('Après le JDK, générez le projet Java/Maven avec Spring Web ; le ZIP comprend le wrapper de build.', page('Générer le projet Spring Boot', 'https://start.spring.io/', 'Choisissez une version stable et la dépendance Spring Web.')),
    mac: choix('Après le JDK, générez le projet Java/Maven avec Spring Web ; le ZIP comprend le wrapper de build.', page('Générer le projet Spring Boot', 'https://start.spring.io/', 'Choisissez une version stable et la dépendance Spring Web.'))
  },
  cpp: {
    windows: choix('Installez les outils Microsoft puis cochez la charge de travail « Développement Desktop en C++ ».', page('Télécharger les outils C++ Microsoft', 'https://visualstudio.microsoft.com/downloads/', 'Visual Studio Community ou Build Tools, selon votre besoin.')),
    linux: choix('Installez le paquet C++ avec le gestionnaire de votre distribution. Ces pages identifient le bon nom du paquet ; ne téléchargez pas un .deb ou .rpm d’une autre version du système.', guide('Paquet g++ · Ubuntu', 'https://packages.ubuntu.com/search?keywords=g%2B%2B', 'Installez ensuite avec apt sur votre version d’Ubuntu.'), guide('Paquet g++ · Debian', 'https://packages.debian.org/search?keywords=g%2B%2B', 'Installez ensuite avec apt sur votre version de Debian.'), guide('Paquet gcc-c++ · Fedora', 'https://packages.fedoraproject.org/pkgs/gcc/gcc-c%2B%2B/', 'Installez ensuite avec dnf sur votre version de Fedora.'), guide('Paquet gcc · Arch Linux', 'https://archlinux.org/packages/core/x86_64/gcc/', 'Installez ensuite avec pacman sur votre architecture.')),
    mac: choix('Lancez xcode-select --install dans Terminal ; Apple propose aussi la page officielle des outils.', guide('Installer les outils de ligne de commande Apple', 'https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/', 'La commande ouvre la boîte de dialogue système ; aucun gros Xcode requis.'))
  },
  dotnet: {
    windows: choix('Choisissez le SDK .NET pour Windows, et non le runtime seul.', page('Télécharger le SDK .NET Windows', 'https://dotnet.microsoft.com/en-us/download', 'La page propose le SDK et les architectures disponibles.')),
    linux: choix('Choisissez votre distribution précise avant de copier une commande d’installation.', guide('Installer le SDK .NET sur Linux', 'https://learn.microsoft.com/en-us/dotnet/core/install/linux', 'Guides Microsoft par distribution et version.')),
    mac: choix('Choisissez le SDK .NET macOS adapté à Intel ou Apple silicon.', page('Télécharger le SDK .NET macOS', 'https://dotnet.microsoft.com/en-us/download', 'La page propose les deux architectures.'))
  },
  php: {
    windows: choix('La page PHP Windows distingue les archives par architecture et configuration. Pour l’exercice CLI, suivez ensuite le guide d’installation.', page('Télécharger PHP pour Windows', 'https://www.php.net/downloads.php?os=windows', 'Choisissez une version stable et l’archive adaptée.'), guide('Installer PHP sur Windows', 'https://www.php.net/manual/en/install.windows.php', 'Explique les prérequis et le PATH.')),
    linux: choix('PHP CLI s’installe depuis votre distribution ; le manuel distingue Debian, DNF, Alpine et Arch.', guide('Installer PHP sur Linux', 'https://www.php.net/manual/en/install.unix.php', 'Choisissez la section de votre distribution.')),
    mac: choix('PHP n’est pas fourni par toutes les versions récentes de macOS ; choisissez la méthode documentée pour votre système.', guide('Installer PHP sur macOS', 'https://www.php.net/manual/en/install.macosx.php', 'Méthodes maintenues et prérequis.'))
  },
  composer: {
    windows: choix('PHP doit être installé avant Composer. L’installateur Windows est fourni directement par getcomposer.org.', fichier('Télécharger Composer-Setup.exe', 'https://getcomposer.org/Composer-Setup.exe', 'Programme officiel Windows ; vérifiez que PHP fonctionne d’abord.'), guide('Lire l’installation Composer Windows', 'https://getcomposer.org/doc/00-intro.md', 'Étapes et dépannage de l’installateur.')),
    linux: choix('Après PHP, suivez la procédure officielle et sa vérification d’intégrité ; le fichier composer.phar peut rester local.', guide('Télécharger et installer Composer', 'https://getcomposer.org/download/', 'Procédure officielle avec vérification de l’installateur.')),
    mac: choix('Après PHP, suivez la procédure officielle ; une installation locale suffit pour un exercice.', guide('Télécharger et installer Composer', 'https://getcomposer.org/download/', 'Procédure officielle pour macOS et autres systèmes Unix.'))
  },
  docker: {
    windows: choix('Choisissez Docker Desktop Windows et vérifiez les prérequis WSL/virtualisation sur cette page.', page('Télécharger Docker Desktop Windows', 'https://docs.docker.com/desktop/setup/install/windows-install/', 'Liens de téléchargement et prérequis officiels.')),
    linux: choix('Choisissez Docker Engine pour votre distribution ou Docker Desktop Linux si cette interface est nécessaire.', guide('Installer Docker Engine sur Linux', 'https://docs.docker.com/engine/install/', 'Sélectionnez Ubuntu, Debian, Fedora ou votre distribution.'), guide('Installer Docker Desktop sur Linux', 'https://docs.docker.com/desktop/setup/install/linux/', 'Option graphique distincte du moteur seul.')),
    mac: choix('Choisissez Docker Desktop pour Apple silicon ou Intel sur la page officielle.', page('Télécharger Docker Desktop macOS', 'https://docs.docker.com/desktop/setup/install/mac-install/', 'Deux liens de téléchargement selon la puce.'))
  },
  vercel: {
    windows: choix('La CLI Vercel s’obtient via npm après Node.js ; il n’y a pas d’installateur Windows autonome à choisir ici.', guide('Installer la CLI Vercel', 'https://vercel.com/docs/cli', 'Lisez la méthode npm et vérifiez le projet avant de le lier.')),
    linux: choix('La CLI Vercel s’obtient via npm après Node.js ; vérifiez d’abord node et npm.', guide('Installer la CLI Vercel', 'https://vercel.com/docs/cli', 'Méthode officielle npm et commandes de diagnostic.')),
    mac: choix('La CLI Vercel s’obtient via npm après Node.js ; vérifiez d’abord node et npm.', guide('Installer la CLI Vercel', 'https://vercel.com/docs/cli', 'Méthode officielle npm et commandes de diagnostic.'))
  }
};
