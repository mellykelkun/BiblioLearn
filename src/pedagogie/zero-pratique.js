'use strict';

const { fiche, texte, code, liste, decomposition, liens } = require('../data/outils');
const q = (id, question, choix, correct, explication) => ({ id, question, choix, correct, explication });
const sourceTerminal = 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line';

const nouvelles = [
  {
    ...fiche({
      id: 'zero-page-complete', domaine: 'niveau-zero', categorie: 'Première création', titre: 'Créer une page complète à partir de zéro',
      resume: 'Copier un document HTML entier, le retrouver, l’ouvrir et comprendre la différence entre source et affichage.',
      tags: ['débuter', 'HTML', 'fichier', 'navigateur'], niveau: 'Niveau 0',
      guide: {
        modele: 'Une page HTML est un fichier texte enregistré avec l’extension .html. Le navigateur lit ce fichier et affiche les éléments décrits par les balises. Vous pouvez commencer sans terminal ni installation de langage.',
        scenario: 'Vous voulez montrer votre nom et un court message. La première version complète est petite : un fichier, un titre et un paragraphe. Elle sera ensuite modifiée sans effacer l’original.',
        exercice: 'Dans la page complète, remplacez « Mon carnet » par « Mes découvertes » et ajoutez un second paragraphe. Enregistrez, rechargez, puis décrivez ce qui a changé à l’écran et ce qui reste dans le fichier.',
        indice: 'Copiez la ligne <p>...</p>, changez son texte, puis placez-la juste avant </main>.',
        correction: 'Le document garde <!doctype html>, html, head et body. Dans main, <h1>Mes découvertes</h1> change le titre et un second <p>Nouvelle note</p> ajoute une ligne. L’enregistrement change le fichier ; le rechargement demande au navigateur de relire sa nouvelle version.'
      },
      sections: [
        texte('Où créer le fichier', 'Dans Documents, créez un dossier bibliolearn-essai. Dans ce dossier, créez accueil.html avec un éditeur de texte brut. Vérifiez le nom complet : accueil.html.txt ne sera pas interprété de la même façon.'),
        code('accueil.html — document entier', 'HTML', '<!doctype html>\n<html lang="fr">\n<head>\n  <meta charset="utf-8">\n  <title>Mon carnet</title>\n</head>\n<body>\n  <main>\n    <h1>Mon carnet</h1>\n    <p>Je viens de créer ma première page.</p>\n  </main>\n</body>\n</html>', 'Copiez l’intégralité dans accueil.html, pas seulement la ligne h1.'),
        decomposition('Lire les pièces essentielles', [
          { terme: '<!doctype html>', explication: 'annonce un document HTML moderne au navigateur ; ce n’est pas un élément visible de la page.' },
          { terme: 'lang="fr"', explication: 'annonce la langue du document, utile notamment à la lecture vocale.' },
          { terme: 'meta charset="utf-8"', explication: 'permet de lire correctement les caractères comme é et è.' },
          { terme: 'title', explication: 'nomme l’onglet du navigateur ; h1 est le titre visible dans la page.' },
          { terme: 'main, h1, p', explication: 'main délimite le contenu principal ; h1 est un titre ; p est un paragraphe.' }
        ]),
        liste('Essayer et vérifier', ['Enregistrez accueil.html dans le dossier d’essai.', 'Depuis le gestionnaire de fichiers, ouvrez accueil.html avec un navigateur.', 'Vérifiez : l’onglet dit Mon carnet et la page montre un titre plus une phrase.', 'Changez seulement la phrase, enregistrez et rechargez la page. Si rien ne change, vérifiez le nom et l’emplacement du fichier ouvert.']),
        code('Deuxième essai — la partie qui change', 'HTML', '<main>\n  <h1>Mes découvertes</h1>\n  <p>Je viens de créer ma première page.</p>\n  <p>Nouvelle note : j’ai modifié un fichier et rechargé le navigateur.</p>\n</main>'),
        liens({ label: 'MDN : créer sa première page web', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content' })
      ], associes: ['zero-programme', 'zero-fichiers']
    }),
    niveauPedagogique: 0, tempsEstime: 25, maturiteEditoriale: 'enriched', provenance: 'redaction-specifique',
    questions: [q('onglet', 'Quelle balise nomme l’onglet ?', ['title', 'h1', 'main'], 0, 'title se trouve dans head ; h1 apparaît dans la page.'), q('recharger', 'Après avoir modifié le fichier, que faites-vous pour voir le nouveau texte ?', ['Seulement déplacer la souris', 'Enregistrer puis recharger le navigateur'], 1, 'Le navigateur doit relire le fichier enregistré.')]
  },
  {
    ...fiche({
      id: 'zero-naviguer-dossiers', domaine: 'niveau-zero', categorie: 'Première commande', titre: 'Naviguer dans un dossier avec des commandes sûres',
      resume: 'Afficher son emplacement, créer un bac à sable, entrer et revenir sur Windows, Linux ou macOS.',
      tags: ['débuter', 'terminal', 'PowerShell', 'Bash', 'dossiers'], niveau: 'Niveau 0',
      guide: {
        modele: 'Le terminal agit dans un dossier courant. Afficher ce dossier est une lecture ; créer un sous-dossier est une modification. Une commande ne doit être copiée que si son rôle et sa cible sont compris.',
        scenario: 'Un atelier vous demande de créer main.py. Sans savoir où se trouve le terminal, vous pourriez enregistrer main.py ailleurs et obtenir « fichier introuvable ». Vous allez préparer un seul dossier d’essai.',
        exercice: 'Créez un dossier notes dans bibliolearn-essai, entrez dans notes, affichez votre position, puis revenez dans bibliolearn-essai. Relevez les quatre commandes utilisées sur votre système.',
        indice: 'Adaptez les commandes de l’exemple en remplaçant atelier par notes. Pour revenir au parent, utilisez cd .. ou Set-Location .. .',
        correction: 'Bash/Zsh : mkdir notes, cd notes, pwd, cd .. . PowerShell : New-Item -ItemType Directory -Name notes, Set-Location notes, Get-Location, Set-Location .. . Le chemin affiché après le déplacement se termine par notes ; après le retour, il se termine par bibliolearn-essai.'
      },
      sections: [
        texte('Avant toute commande', 'Ouvrez Documents dans le gestionnaire de fichiers. Créez-y bibliolearn-essai. Copiez son chemin depuis la barre d’adresse ou faites « Ouvrir dans le terminal » si votre système le propose. Dans l’exemple ci-dessous, commencez déjà dans bibliolearn-essai. Si le dossier affiché diffère, revenez dans le gestionnaire et ouvrez le terminal depuis ce dossier.'),
        code('Windows PowerShell — quatre actions lisibles', 'PowerShell', 'Get-Location\nGet-ChildItem\nNew-Item -ItemType Directory -Name atelier\nSet-Location atelier\nGet-Location\nSet-Location ..\nGet-Location', 'Copiez une ligne à la fois ; n’entrez pas les commentaires ni l’invite PS>.'),
        code('Linux et macOS — mêmes intentions', 'Bash ou Zsh', 'pwd\nls\nmkdir atelier\ncd atelier\npwd\ncd ..\npwd', 'Copiez une ligne à la fois ; n’entrez pas le symbole $ d’un tutoriel.'),
        decomposition('Comprendre chaque commande', [
          { terme: 'Get-Location / pwd', explication: 'affiche le dossier courant sans modifier les fichiers.' },
          { terme: 'Get-ChildItem / ls', explication: 'énumère ce qui se trouve dans ce dossier.' },
          { terme: 'New-Item ... / mkdir', explication: 'crée le sous-dossier atelier dans le dossier courant ; vérifiez le nom avant Entrée.' },
          { terme: 'Set-Location atelier / cd atelier', explication: 'entre dans le sous-dossier créé.' },
          { terme: 'Set-Location .. / cd ..', explication: 'revient au dossier parent ; les deux points désignent le parent.' }
        ]),
        texte('Résultat attendu et récupération', 'Après l’entrée, le chemin affiché se termine par atelier. Après le retour, il se termine par bibliolearn-essai. Si « atelier n’existe pas » apparaît, relisez la sortie de Get-ChildItem ou ls et vérifiez votre emplacement ; ne créez pas des dossiers au hasard. Si le dossier atelier existe déjà, ne relancez pas la commande de création : entrez simplement dedans.'),
        liens({ label: 'MDN : la ligne de commande', url: sourceTerminal })
      ], associes: ['zero-terminal', 'zero-fichiers']
    }),
    niveauPedagogique: 0, tempsEstime: 30, maturiteEditoriale: 'enriched', provenance: 'redaction-specifique',
    questions: [q('pwd', 'Quelle commande Bash affiche le dossier courant ?', ['pwd', 'mkdir', 'cd ..'], 0, 'pwd lit la position actuelle.'), q('parent', 'Que signifie .. dans cd .. ?', ['Un fichier caché', 'Le dossier parent', 'Tous les dossiers'], 1, '.. désigne le parent du dossier courant.')]
  }
];

const supplements = {
  'zero-programme': [code('Document complet à copier après le premier fragment', 'HTML', '<!doctype html>\n<html lang="fr">\n<head><meta charset="utf-8"><title>Premier essai</title></head>\n<body><main><h1>Mon premier titre</h1></main></body>\n</html>', 'Enregistrez cette version complète sous accueil.html ; la leçon suivante en explique chaque ligne.')],
  'zero-terminal': [texte('La commande suivante, sans risque de modification', 'Lorsque Get-Location ou pwd a montré votre position, Get-ChildItem sur PowerShell ou ls sur Bash/Zsh liste les fichiers présents. Ne lancez pas encore une commande qui efface ou déplace un fichier. La leçon « Naviguer dans un dossier » donne ensuite une séquence complète et son résultat attendu.'), code('Deux lectures successives', 'Terminal selon votre système', '# PowerShell\nGet-Location\nGet-ChildItem\n\n# Bash / Zsh\npwd\nls')],
  'zero-erreurs': [code('Vérifier un chemin sans rien supprimer', 'Terminal selon votre système', '# PowerShell, dans le dossier apprentissage\nGet-Location\nTest-Path .\\notes.txt\n\n# Bash / Zsh, dans le dossier apprentissage\npwd\nls -l notes.txt', 'Test-Path répond True ou False ; ls affiche le fichier ou un message indiquant son absence.')],
  'zero-sauvegarde': [code('Copier un fichier d’essai après avoir vérifié le dossier', 'Terminal selon votre système', '# PowerShell, depuis le dossier qui contient accueil.html\nGet-Location\nCopy-Item accueil.html accueil-avant-changement.html\nGet-ChildItem accueil*.html\n\n# Bash / Zsh, même dossier\npwd\ncp accueil.html accueil-avant-changement.html\nls accueil*.html', 'La copie garde le contenu actuel. Ouvrez les deux fichiers avant de modifier l’un d’eux ; une copie sur le même disque n’est pas une sauvegarde contre une panne matérielle.')]
};

function enrichirZero(ficheExistante) {
  const ajout = supplements[ficheExistante.id];
  if (!ajout) return ficheExistante;
  const sections = [...ficheExistante.sections];
  const indexLiens = sections.findIndex(s => s.type === 'liens');
  sections.splice(indexLiens < 0 ? sections.length : indexLiens, 0, ...ajout);
  return { ...ficheExistante, sections };
}

module.exports = { nouvelles, enrichirZero };
