'use strict';

const programmes = require('./nouveaux-parcours');
const { fiche, texte, code, decomposition, alerte, comparaison, liens } = require('./outils');

const idFiche = (domaine, sujet) => domaine + '-' + sujet.id;
const autres = (programme, domaine, index) => [
  ...(index ? [idFiche(domaine, programme.sujets[index - 1])] : []),
  ...(index < programme.sujets.length - 1 ? [idFiche(domaine, programme.sujets[index + 1])] : [])
];
const commentaire = (domaine) => domaine === 'python' ? '#' : '//';

function codeJavaAtelier(notion) {
  if (notion.id === 'jdk-main') return notion.code;
  if (['types', 'conditions', 'listes', 'streams'].includes(notion.id)) {
    return 'public class Bonjour { public static void main(String[] args) { ' + notion.code + ' } }';
  }
  if (notion.id === 'methodes') return 'public class Bonjour { ' + notion.code + ' public static void main(String[] args) { System.out.println(doubler(4)); } }';
  if (notion.id === 'classes-records') return notion.code + '\npublic class Bonjour { public static void main(String[] args) { System.out.println(new Livre("Web", 120).pages()); } }';
  if (notion.id === 'interfaces') return notion.code + '\nclass Memoire implements Depot { public String trouver(String id) { return "Livre " + id; } }\npublic class Bonjour { public static void main(String[] args) { System.out.println(new Memoire().trouver("42")); } }';
  if (notion.id === 'exceptions') return 'public class Bonjour { public static void main(String[] args) throws Exception { ' + notion.code + ' } }';
  if (notion.id === 'fichiers') return 'public class Bonjour { public static void main(String[] args) throws Exception { ' + notion.code + ' System.out.println(texte); } }';
  return notion.code;
}

function codeDemarrage(domaine, notion) {
  return domaine === 'java' ? codeJavaAtelier(notion) : notion.code;
}

function commandesAtelier(domaine, notion) {
  const base = configurations[domaine].lancement;
  if (domaine === 'php' && notion.id === 'composer') {
    return { windows: 'composer install\nphp index.php', linux: 'composer install\nphp index.php', mac: 'composer install\nphp index.php' };
  }
  if (domaine === 'php' && notion.id === 'formulaires') {
    return {
      windows: 'php -S 127.0.0.1:8000\n# Dans un deuxième PowerShell :\nInvoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/index.php -Body @{ nom = "Awa" }',
      linux: "php -S 127.0.0.1:8000\n# Dans un deuxième terminal :\ncurl -X POST -d 'nom=Awa' http://127.0.0.1:8000/index.php",
      mac: "php -S 127.0.0.1:8000\n# Dans un deuxième terminal :\ncurl -X POST -d 'nom=Awa' http://127.0.0.1:8000/index.php"
    };
  }
  if (domaine === 'php' && ['formulaires', 'json'].includes(notion.id)) {
    return { windows: 'php -S 127.0.0.1:8000\n# Ouvrir http://127.0.0.1:8000/index.php', linux: 'php -S 127.0.0.1:8000\n# Ouvrir http://127.0.0.1:8000/index.php', mac: 'php -S 127.0.0.1:8000\n# Ouvrir http://127.0.0.1:8000/index.php' };
  }
  if (domaine === 'springboot' && notion.id === 'tests') {
    return { windows: '.\\mvnw.cmd test', linux: './mvnw test', mac: './mvnw test' };
  }
  return base;
}

function fichiersAtelier(domaine, notion) {
  const fichiers = [...configurations[domaine].fichiers];
  if (domaine === 'java' && ['exceptions', 'fichiers'].includes(notion.id)) fichiers.push('note.txt');
  if ((domaine === 'cpp' || domaine === 'php') && notion.id === 'fichiers') fichiers.push('note.txt');
  if (domaine === 'springboot' && notion.id === 'tests') fichiers.push('src/test/java/com/example/demo/BonjourWebTest.java');
  if (domaine === 'php' && notion.id === 'composer') fichiers.push('composer.json', 'composer.lock');
  return fichiers;
}

const prerequisSpecifiques = {
  'java-exceptions': 'Créez note.txt dans le dossier de l’exercice ; le code lit sa première ligne.',
  'java-fichiers': 'Créez note.txt en UTF-8 avant de lancer le programme.',
  'cpp-fichiers': 'Créez note.txt dans le dossier de l’exercice avant de lancer le programme ; l’absence doit produire un code de sortie non nul.',
  'php-fichiers': 'Créez note.txt dans le dossier de l’exercice ; le script lit uniquement ce chemin connu, jamais un chemin fourni par le visiteur.',
  'springboot-repository': 'Dans Spring Initializr, ajoutez Spring Data JPA et une base H2 de développement ; ne pointez pas l’exercice vers une vraie base.',
  'springboot-tests': 'Ajoutez le starter de test web de la version Spring Boot choisie ; placez le test dans src/test/java et la route /bonjour dans src/main/java.',
  'springboot-validation': 'Le fragment de validation appartient à un service ou à une méthode : complétez le projet généré avant de lancer le serveur.',
  'php-pdo': 'Vérifiez php -m et la présence du pilote pdo_sqlite ; l’exemple utilise une base temporaire en mémoire.',
  'php-composer': 'Installez Composer depuis sa documentation officielle et exécutez composer install dans un projet contenant composer.json.'
};

function creerLecon(programme, domaine, notion, index) {
  const modele = notion.idee;
  const scenario = notion.application + ' La décision utile consiste à vérifier le résultat concret avant de transmettre la donnée à une autre couche. Résultat attendu : ' + notion.attendu;
  const exercice = 'Dans un dossier d’essai, reproduisez le fragment « ' + notion.titre + ' ». Prédisez le résultat, exécutez-le dans l’environnement indiqué, puis modifiez une entrée pour tester ce cas : ' + notion.panne + ' Expliquez à quelle couche l’erreur doit être traitée.';
  const correction = notion.attendu + ' Le cas limite montre pourquoi il faut contrôler les données et ne pas confondre affichage, calcul et transport. ' + notion.panne + ' La correction doit préserver un message compréhensible et un résultat réutilisable.';
  return fiche({
    id: idFiche(domaine, notion),
    domaine,
    categorie: index < 3 ? 'Premiers pas' : index < 7 ? 'Construire la logique' : 'Données et qualité',
    titre: notion.titre,
    resume: modele,
    tags: [programme.nom, notion.titre, programme.outil, 'installation', 'exercice'],
    niveau: index < 5 ? 'Fondamental' : 'Débutant → junior',
    guide: { modele, scenario, exercice, correction, indice: 'Commencez par identifier l’entrée et le type reçu. Ensuite, lisez le message d’erreur exact avant de modifier le code.' },
    sections: [
      texte('Où le code s’exécute', programme.contexte),
      ...(prerequisSpecifiques[domaine + '-' + notion.id] ? [texte('Prérequis pour cet exemple', prerequisSpecifiques[domaine + '-' + notion.id])] : []),
      code('Exemple à essayer', programme.langage, notion.code, 'Créez un dossier d’exercice, ouvrez-le dans l’éditeur et utilisez la préparation adaptée à votre système ci-dessus. Pour Java hors du premier programme, l’atelier fournit une classe complète. Pour Spring Boot, intégrez le fragment au projet généré.'),
      decomposition('Suivre la donnée', [
        { terme: 'Entrée', explication: 'Identifiez la valeur concrète ou la ressource fournie au fragment ; notez son type avant toute conversion.' },
        { terme: 'Traitement et sortie', explication: notion.attendu },
        { terme: 'Cas qui échoue', explication: notion.panne }
      ]),
      comparaison('Choisir une solution', ['Situation', 'Décision', 'Pourquoi'], [
        ['Premier essai isolé', 'Exécuter le fragment dans un dossier d’exercice', 'Une erreur reste facile à retrouver et ne touche pas un vrai projet.'],
        ['Fonction utilisée par plusieurs parties', 'Isoler la logique puis écrire une vérification', 'Le résultat peut être transmis sans dépendre de la console.'],
        ['Entrée externe ou sensible', 'Valider au bord du système et limiter les champs de sortie', 'Une entrée non fiable ne doit pas devenir une décision ou une fuite.']
      ]),
      alerte('attention', 'Erreur à provoquer volontairement', notion.panne + ' Lisez le diagnostic, puis corrigez uniquement ce qui explique cet échec.'),
      liens({ label: 'Documentation officielle — ' + programme.nom, url: programme.source })
    ],
    associes: autres(programme, domaine, index)
  });
}

const configurations = {
  python: { fichiers: ['main.py'], lancement: { windows: 'py main.py', linux: 'python3 main.py', mac: 'python3 main.py' } },
  java: { fichiers: ['Bonjour.java'], lancement: { windows: 'javac Bonjour.java\njava Bonjour', linux: 'javac Bonjour.java\njava Bonjour', mac: 'javac Bonjour.java\njava Bonjour' } },
  springboot: { fichiers: ['pom.xml', 'src/main/java/com/example/demo/DemoApplication.java'], lancement: { windows: '.\\mvnw.cmd spring-boot:run', linux: './mvnw spring-boot:run', mac: './mvnw spring-boot:run' } },
  cpp: { fichiers: ['main.cpp'], lancement: { windows: 'cl /EHsc main.cpp\n.\\main.exe', linux: 'g++ -std=c++20 -Wall -Wextra main.cpp -o atelier\n./atelier', mac: 'clang++ -std=c++20 -Wall -Wextra main.cpp -o atelier\n./atelier' } },
  csharp: { fichiers: ['Program.cs', 'atelier.csproj'], lancement: { windows: 'dotnet run', linux: 'dotnet run', mac: 'dotnet run' } },
  php: { fichiers: ['index.php'], lancement: { windows: 'php index.php', linux: 'php index.php', mac: 'php index.php' } }
};

const variantes = [
  { id: 'essayer', titre: 'Lire et reproduire', duree: '45 min', niveau: 'Débutant',
    consigne: (n) => 'Reproduisez le code puis annoncez la valeur ou la réponse obtenue avant de la voir. ' + n.attendu,
    controle: (n) => 'Le résultat observé correspond à : ' + n.attendu },
  { id: 'limites', titre: 'Casser et réparer', duree: '60 min', niveau: 'Débutant',
    consigne: (n) => 'Reproduisez ce défaut sans toucher à un projet réel : ' + n.panne + ' Ensuite réparez-le et expliquez le diagnostic.',
    controle: (n) => 'Le cas défaillant est reproduit puis corrigé : ' + n.panne },
  { id: 'transfert', titre: 'Appliquer dans un produit', duree: '75 min', niveau: 'Intermédiaire',
    consigne: (n) => n.application + ' Ajoutez une entrée réaliste, un état vide et une sortie explicite.',
    controle: (n) => 'Le scénario produit une sortie utile : ' + n.application },
  { id: 'qualite', titre: 'Tester et transmettre', duree: '90 min', niveau: 'Intermédiaire',
    consigne: (n) => 'Ajoutez un test du cas normal et du cas limite, puis expliquez le contrat à un autre développeur. Cas limite : ' + n.panne,
    controle: (n) => 'Un test ou une vérification reproductible couvre : ' + n.attendu }
];

function creerAtelier(programme, domaine, notion, variante, index) {
  const id = 'atelier-' + domaine + '-' + notion.id + '-' + variante.id;
  const prefixe = commentaire(domaine);
  const titre = variante.titre + ' : ' + notion.titre;
  const consigne = variante.consigne(notion);
  const source = codeDemarrage(domaine, notion) + '\n' + prefixe + ' Atelier ' + variante.id + ' : ' + consigne;
  return {
    id, titre, domaine, niveau: variante.niveau, duree: variante.duree,
    objectif: consigne,
    outils: [programme.nom, 'Éditeur de code', 'Terminal adapté à votre système'],
    prerequis: ['Lire la leçon « ' + notion.titre + ' »', 'Préparer ' + programme.nom + ' selon Windows, Linux ou macOS', 'Travailler dans un dossier d’essai', ...(prerequisSpecifiques[domaine + '-' + notion.id] ? [prerequisSpecifiques[domaine + '-' + notion.id]] : [])],
    structure: ['atelier-' + notion.id + '-' + variante.id + '/README.md', ...fichiersAtelier(domaine, notion).map((f) => 'atelier-' + notion.id + '-' + variante.id + '/' + f)],
    execution: commandesAtelier(domaine, notion),
    etapes: [
      notion.id === 'composer' && domaine === 'php'
        ? { titre: 'Créer le manifeste Composer', explication: 'Créez composer.json avec ce contenu dans le dossier de l’atelier. Le fichier composer.lock et vendor/autoload.php seront générés par composer install ; ne les inventez pas.', langage: 'JSON', code: '{\n  "name": "bibliolearn/atelier",\n  "description": "Atelier local de découverte de Composer",\n  "require": {}\n}' }
        : { titre: 'Préparer le dossier et le contrat', explication: 'Ouvrez le terminal adapté à votre système ; confirmez le dossier courant. Notez entrée, type et résultat attendus avant d’écrire le code.', langage: 'Markdown', code: '# ' + titre + '\nEntrée et type :\nRésultat : ' + notion.attendu + '\nPanne à observer : ' + notion.panne },
      { titre: 'Construire la solution', explication: 'Le fragment de la leçon est un point de départ. Certains fragments nécessitent le projet ou les imports expliqués dans la leçon ; complétez-les avant exécution.', langage: programme.langage, code: source },
      { titre: 'Vérifier et provoquer une limite', explication: consigne + ' Ne corrigez pas avant d’avoir noté le comportement exact.', langage: 'Protocole', code: '1. Exécuter le cas nominal et comparer avec : ' + notion.attendu + '\n2. Provoquer : ' + notion.panne + '\n3. Lire le statut, la sortie ou l’erreur.\n4. Corriger puis rejouer les deux cas.' },
      { titre: 'Transmettre le résultat', explication: 'Documentez qui produit la valeur, son type après conversion, qui la valide, qui peut la recevoir et ce qui se passe en cas de panne.', langage: 'Markdown', code: '# Bilan : ' + notion.titre + '\n- Entrée et type :\n- Validation et erreur :\n- Résultat public attendu : ' + notion.attendu + '\n- Où stocker ou transmettre ce résultat :\n- Information à ne pas exposer :' }
    ],
    validation: [variante.controle(notion), 'La commande de lancement correspondant au système est indiquée et exécutée depuis le bon dossier.', 'Une entrée invalide ne devient pas silencieusement un succès.', 'Le README explique le type, la frontière de validation et la sortie.'],
    indice: 'Lisez d’abord le diagnostic exact. ' + notion.panne,
    associes: [idFiche(domaine, notion)]
  };
}

const fiches = Object.entries(programmes).flatMap(([domaine, programme]) =>
  programme.sujets.map((notion, index) => creerLecon(programme, domaine, notion, index)));
const ateliers = Object.entries(programmes).flatMap(([domaine, programme]) =>
  programme.sujets.flatMap((notion) => variantes.map((variante, index) => creerAtelier(programme, domaine, notion, variante, index))));

module.exports = { fiches, ateliers, programmes };
