'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'html-document', domaine: 'html', categorie: 'Structure', titre: 'Structure d’un document HTML',
    resume: 'Comprendre le squelette minimal d’une page et le rôle exact de html, head et body.',
    tags: ['doctype', 'html', 'head', 'body', 'meta', 'title', 'structure'],
    sections: [
      texte('Définition', 'HTML décrit la structure et le sens du contenu. Le navigateur analyse le document reçu et construit un arbre d’objets appelé DOM. HTML ne sert ni à programmer un comportement ni à définir toute la présentation.'),
      texte('Pourquoi cette structure existe', 'Le doctype sélectionne le mode standard du navigateur. html contient le document, head regroupe les métadonnées non affichées comme contenu principal, et body contient ce que la page présente.'),
      code('Squelette moderne commenté', 'HTML', '<!doctype html>\n<html lang="fr">\n  <head>\n    <!-- Encodage des caractères et affichage mobile. -->\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <!-- Le titre apparaît dans l’onglet du navigateur. -->\n    <title>Titre de la page</title>\n  </head>\n  <body>\n    <!-- Le contenu visible commence ici. -->\n    <h1>Contenu principal</h1>\n  </body>\n</html>'),
      decomposition('Décomposition', [
        { terme: '<!doctype html>', explication: 'indique que le document utilise le standard HTML actuel ; ce n’est pas une balise.' },
        { terme: '<html lang="fr">', explication: 'élément racine ; lang aide lecteurs d’écran et moteurs de recherche.' },
        { terme: '<meta charset="UTF-8">', explication: 'définit l’encodage des caractères, à placer tôt dans head.' },
        { terme: '<meta name="viewport">', explication: 'adapte la largeur de mise en page aux écrans mobiles.' },
        { terme: '<title>', explication: 'nom visible dans l’onglet et utilisé par les favoris et moteurs de recherche.' }
      ]),
      alerte('erreur', 'Erreur fréquente', 'Oublier meta viewport ne casse pas le HTML, mais la page apparaît souvent minuscule sur mobile. Mettre du contenu visible dans head produit également un document invalide.'),
      alerte('retenir', 'À retenir', 'Le HTML donne du sens au contenu. Choisir une balise pour sa signification avant de penser à son apparence.'),
      liens({ label: 'MDN — Introduction au HTML', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax' }, { label: 'WHATWG — The HTML syntax', url: 'https://html.spec.whatwg.org/multipage/syntax.html' })
    ],
    associes: ['html-semantique', 'dom-selection']
  }),
  fiche({
    id: 'html-semantique', domaine: 'html', categorie: 'Structure', titre: 'HTML sémantique',
    resume: 'Choisir des éléments qui décrivent le rôle du contenu plutôt que sa seule apparence.',
    tags: ['main', 'header', 'nav', 'article', 'section', 'footer', 'accessibilité'],
    sections: [
      texte('Pourquoi cela existe', 'Une structure sémantique est compréhensible par le navigateur, les technologies d’assistance, les moteurs de recherche et les développeurs. Une pile de div peut sembler identique visuellement mais perd ces informations.'),
      code('Exemple concret', 'HTML', '<header>\n  <nav aria-label="Navigation principale">…</nav>\n</header>\n<main>\n  <article>\n    <h1>Comprendre le DOM</h1>\n    <section aria-labelledby="definition">\n      <h2 id="definition">Définition</h2>\n      <p>…</p>\n    </section>\n  </article>\n</main>\n<footer>…</footer>'),
      liste('Repères pratiques', ['main : contenu principal unique de la page.', 'nav : groupe important de liens de navigation.', 'article : contenu autonome et réutilisable.', 'section : regroupement thématique, généralement nommé par un titre.', 'header et footer : en-tête et pied de la page ou d’une section.', 'div : conteneur neutre lorsque aucun élément sémantique ne convient.']),
      alerte('attention', 'Quand ne pas utiliser section', 'section n’est pas un div décoratif. Sans thème identifiable ou titre pertinent, un div est souvent plus honnête.'),
      liens({ label: 'MDN — Éléments de structuration', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content/Structuring_documents' })
    ],
    associes: ['html-document', 'html-attributs', 'css-selecteurs']
  }),
  fiche({
    id: 'html-attributs', domaine: 'html', categorie: 'Fondamentaux', titre: 'Attributs, id et class',
    resume: 'Ajouter des informations à une balise et choisir correctement entre identifiant unique et classe réutilisable.',
    tags: ['attribut', 'id', 'class', 'href', 'src', 'data', 'aria'],
    sections: [
      code('Syntaxe', 'HTML', '<a class="lien-externe" href="https://example.com" target="_blank" rel="noreferrer">\n  Documentation\n</a>'),
      decomposition('Décomposition de la syntaxe', [
        { terme: 'a', explication: 'nom de l’élément : un lien.' },
        { terme: 'class="lien-externe"', explication: 'classe réutilisable par CSS et JavaScript.' },
        { terme: 'href="…"', explication: 'destination du lien.' },
        { terme: 'target="_blank"', explication: 'ouvre un nouveau contexte de navigation.' },
        { terme: 'rel="noreferrer"', explication: 'précise la relation et évite de transmettre l’URL d’origine.' }
      ]),
      comparaison('id ou class ?', ['Critère', 'id', 'class'], [
        ['Unicité', 'Unique dans le document', 'Réutilisable'],
        ['CSS', '#entete', '.carte'],
        ['JavaScript', 'getElementById()', 'querySelectorAll()'],
        ['Usage conseillé', 'Ancre, label, cible unique', 'Styles et groupes d’éléments']
      ]),
      alerte('erreur', 'Erreur fréquente', 'Utiliser le même id plusieurs fois crée un document invalide et rend les sélections ou associations de labels ambiguës. Pour un groupe, utiliser class.'),
      liens({ label: 'MDN — Attributs HTML', url: 'https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Attributes' })
    ],
    associes: ['dom-selection', 'css-selecteurs', 'html-formulaires']
  }),
  fiche({
    id: 'html-texte-listes', domaine: 'html', categorie: 'Contenu', titre: 'Titres, paragraphes et listes',
    resume: 'Structurer un texte lisible avec une hiérarchie de titres et des listes qui ont du sens.',
    tags: ['h1', 'h2', 'p', 'ul', 'ol', 'li', 'strong', 'em'],
    sections: [
      code('Exemple', 'HTML', '<article>\n  <h1>Installer Node.js</h1>\n  <p><strong>Node.js</strong> exécute JavaScript hors du navigateur.</p>\n\n  <h2>Étapes</h2>\n  <ol>\n    <li>Installer une version LTS.</li>\n    <li>Vérifier avec <code>node --version</code>.</li>\n  </ol>\n</article>'),
      liste('Choisir le bon élément', ['h1 à h6 créent une hiérarchie : ne pas choisir un niveau pour sa taille.', 'p représente un paragraphe, pas un simple espacement.', 'ul convient lorsque l’ordre ne change pas le sens ; ol lorsque la séquence compte.', 'strong marque une importance forte ; em marque une emphase de lecture.', 'br force un saut de ligne dans un même contenu, par exemple une adresse ou un poème.']),
      alerte('attention', 'Bonne pratique', 'Ne sautez pas arbitrairement de h2 à h5 pour obtenir une taille plus petite. Réglez l’apparence en CSS et gardez une hiérarchie logique.'),
      liens({ label: 'MDN — Titres et paragraphes', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content/Headings_and_paragraphs' })
    ],
    associes: ['html-semantique', 'css-typographie']
  }),
  fiche({
    id: 'html-liens-images', domaine: 'html', categorie: 'Contenu', titre: 'Liens et images',
    resume: 'Relier des ressources et intégrer une image avec un texte alternatif adapté.',
    tags: ['a', 'href', 'img', 'src', 'alt', 'width', 'height'],
    sections: [
      code('Syntaxe', 'HTML', '<a href="/guides/http.html">Lire le guide HTTP</a>\n\n<img\n  src="/images/cycle-http.webp"\n  alt="Cycle requête-réponse entre un navigateur et un serveur"\n  width="960"\n  height="540"\n>'),
      decomposition('Paramètres importants', [
        { terme: 'href', explication: 'URL absolue, relative, ancre #id, courriel mailto: ou téléphone tel:.' },
        { terme: 'src', explication: 'adresse de la ressource image.' },
        { terme: 'alt', explication: 'remplacement textuel décrivant le sens de l’image ; vide si elle est purement décorative.' },
        { terme: 'width / height', explication: 'dimensions intrinsèques qui réservent l’espace et limitent les décalages de mise en page.' }
      ]),
      alerte('erreur', 'Erreur fréquente', 'Écrire alt="image" ou répéter la légende n’aide pas. Décrire l’information utile. Pour une image décorative, alt="" indique aux lecteurs d’écran de l’ignorer.'),
      liens({ label: 'MDN — Liens', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content/Creating_links' }, { label: 'MDN — Images', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content/HTML_images' })
    ],
    associes: ['html-attributs', 'html-semantique']
  }),
  fiche({
    id: 'html-formulaires', domaine: 'html', categorie: 'Formulaires', titre: 'Formulaires, labels et validation',
    resume: 'Collecter des données compréhensibles et accessibles sans confondre interface et sécurité.',
    tags: ['form', 'label', 'input', 'button', 'required', 'name', 'submit'],
    sections: [
      code('Exemple minimal', 'HTML', '<form action="/inscription" method="post">\n  <div>\n    <label for="email">Adresse e-mail</label>\n    <input id="email" name="email" type="email" autocomplete="email" required>\n  </div>\n  <button type="submit">S’inscrire</button>\n</form>'),
      decomposition('Ce que signifie chaque partie', [
        { terme: 'action', explication: 'adresse qui reçoit les données lors de la soumission native.' },
        { terme: 'method="post"', explication: 'méthode HTTP employée ; GET placerait les données dans l’URL.' },
        { terme: 'for / id', explication: 'associent explicitement le label au champ et agrandissent la zone cliquable.' },
        { terme: 'name', explication: 'clé utilisée lors de l’envoi ; sans name, la valeur n’est pas soumise.' },
        { terme: 'type="submit"', explication: 'déclenche la validation puis l’envoi du formulaire.' }
      ]),
      alerte('erreur', 'Sécurité', 'La validation HTML améliore l’expérience, mais elle peut être contournée. Le serveur doit toujours valider, normaliser et autoriser les données reçues.'),
      liens({ label: 'MDN — Formulaires web', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Forms' })
    ],
    associes: ['dom-formulaires', 'http-methodes', 'html-attributs']
  }),
  fiche({
    id: 'html-tableaux', domaine: 'html', categorie: 'Contenu', titre: 'Tableaux de données',
    resume: 'Présenter des données tabulaires avec des en-têtes qui restent compréhensibles.',
    tags: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'scope'],
    sections: [
      texte('Quand l’utiliser', 'Un tableau sert à montrer des relations entre lignes et colonnes. Il ne doit pas servir à mettre une page en colonnes : CSS Grid et Flexbox existent pour la mise en page.'),
      code('Exemple accessible', 'HTML', '<table>\n  <caption>Méthodes HTTP courantes</caption>\n  <thead>\n    <tr><th scope="col">Méthode</th><th scope="col">Intention</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">GET</th><td>Lire une ressource</td></tr>\n    <tr><th scope="row">POST</th><td>Créer ou déclencher une action</td></tr>\n  </tbody>\n</table>'),
      alerte('retenir', 'À retenir', 'caption nomme le tableau et scope indique si un th décrit une ligne ou une colonne. Ces relations sont essentielles quand le tableau est lu sans sa mise en page visuelle.'),
      liens({ label: 'MDN — Tableaux HTML', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics' })
    ],
    associes: ['html-semantique', 'css-grid']
  }),
  fiche({
    id: 'html-obsolete', domaine: 'html', categorie: 'Historique', titre: 'Reconnaître le HTML obsolète',
    resume: 'Identifier FONT, CENTER, BLINK, FRAMESET et les anciens attributs sans les reproduire.',
    tags: ['font', 'center', 'blink', 'frameset', 'bgcolor', 'align', 'obsolete', 'historique'], niveau: 'Historique',
    sections: [
      texte('Pourquoi connaître ces syntaxes', 'On les rencontre encore dans d’anciens sites, courriels ou supports pédagogiques. Elles mélangeaient contenu et présentation. Les navigateurs peuvent en tolérer certaines, mais elles ne constituent plus une méthode moderne.'),
      code('Ancien — à reconnaître seulement', 'HTML', '<font color="red">Bonjour</font>\n<center>Titre centré</center>\n<body bgcolor="#ffffff">\n<table align="center">…</table>'),
      code('Moderne — séparation HTML / CSS', 'HTML', '<p class="texte-alerte">Bonjour</p>\n<h1 class="titre-centre">Titre centré</h1>\n<table class="tableau-centre">…</table>'),
      code('Styles modernes', 'CSS', 'body { background-color: #fff; }\n.texte-alerte { color: #c62828; }\n.titre-centre { text-align: center; }\n.tableau-centre { margin-inline: auto; }'),
      comparaison('Correspondances pratiques', ['Ancien', 'Problème', 'Remplacement'], [
        ['<font>', 'Présentation dans le HTML', 'color, font-family en CSS'],
        ['<center>, align', 'Alignement non sémantique', 'text-align, margin, Flexbox'],
        ['bgcolor, background', 'Style de fond dans le HTML', 'background en CSS'],
        ['<blink>', 'Non standard et gênant', 'Ne pas reproduire'],
        ['<frameset>, <frame>', 'Document fragmenté et inaccessible', 'Mise en page normale ; iframe si intégration justifiée']
      ]),
      alerte('obsolete', 'Obsolète', 'Ne pas apprendre ces éléments comme solutions. Ils sont documentés uniquement pour lire et moderniser du code historique.'),
      liens({ label: 'WHATWG — Obsolete features', url: 'https://html.spec.whatwg.org/multipage/obsolete.html' })
    ],
    associes: ['html-document', 'css-selecteurs', 'css-flexbox']
  }),
  fiche({
    id: 'css-selecteurs', domaine: 'css', categorie: 'Fondamentaux', titre: 'Sélecteurs CSS et spécificité',
    resume: 'Cibler des éléments et comprendre pourquoi une déclaration gagne dans la cascade.',
    tags: ['sélecteur', 'cascade', 'spécificité', 'class', 'id', 'pseudo-classe'],
    sections: [
      code('Syntaxe', 'CSS', '.carte {\n  border: 1px solid #334155;\n}\n\n.carte > h2 {\n  margin-block-start: 0;\n}\n\n.carte:hover {\n  border-color: #5eead4;\n}'),
      decomposition('Anatomie d’une règle', [
        { terme: '.carte', explication: 'sélecteur : détermine quels éléments correspondent.' },
        { terme: 'border', explication: 'propriété à modifier.' },
        { terme: '1px solid #334155', explication: 'valeur composée : largeur, style et couleur.' },
        { terme: ':hover', explication: 'pseudo-classe liée à un état d’interaction.' }
      ]),
      texte('Comment la cascade tranche', 'Le navigateur considère d’abord l’importance et l’origine des déclarations, puis la spécificité du sélecteur, puis l’ordre d’apparition si le reste est à égalité. Héritage et valeur initiale interviennent lorsqu’aucune déclaration directe ne gagne.'),
      alerte('bonne-pratique', 'Bonne pratique', 'Préférer des classes courtes et prévisibles. Empiler des ids, des sélecteurs imbriqués et !important rend chaque évolution plus coûteuse.'),
      liens({ label: 'MDN — Cascade et héritage', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts' })
    ],
    associes: ['html-attributs', 'css-box-model', 'css-variables']
  }),
  fiche({
    id: 'css-box-model', domaine: 'css', categorie: 'Mise en page', titre: 'Modèle de boîte et box-sizing',
    resume: 'Raisonner avec contenu, padding, bordure et marge pour expliquer les dimensions réelles.',
    tags: ['box model', 'margin', 'padding', 'border', 'box-sizing', 'width'],
    sections: [
      texte('Fonctionnement interne', 'Chaque élément génère une ou plusieurs boîtes. Par défaut, width vise seulement la zone de contenu ; padding et border s’ajoutent. Avec border-box, width inclut contenu, padding et bordure, ce qui simplifie les calculs.'),
      code('Réglage recommandé', 'CSS', '*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n.carte {\n  width: 320px;\n  padding: 24px;\n  border: 1px solid;\n  margin-block: 16px;\n}'),
      decomposition('Les quatre zones', [
        { terme: 'content', explication: 'texte, image ou enfants de la boîte.' },
        { terme: 'padding', explication: 'espace intérieur entre contenu et bordure.' },
        { terme: 'border', explication: 'limite dessinée autour du padding.' },
        { terme: 'margin', explication: 'espace extérieur ; les marges verticales de blocs peuvent fusionner.' }
      ]),
      alerte('erreur', 'Pourquoi la boîte dépasse', 'Avec content-box, width: 320px + deux paddings de 24px + deux bordures de 1px donne 370px. border-box maintient la largeur extérieure déclarée à 320px.'),
      liens({ label: 'MDN — Le modèle de boîte', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics/Box_model' })
    ],
    associes: ['css-selecteurs', 'css-flexbox', 'css-grid']
  }),
  fiche({
    id: 'css-flexbox', domaine: 'css', categorie: 'Mise en page', titre: 'Flexbox',
    resume: 'Distribuer et aligner des éléments sur un axe principal, avec un axe secondaire.',
    tags: ['display flex', 'justify-content', 'align-items', 'gap', 'flex-wrap'],
    sections: [
      texte('Quand l’utiliser', 'Flexbox est excellent pour une barre d’actions, une navigation, un groupe de cartes sur une dimension ou le centrage d’un composant. Pour contrôler simultanément lignes et colonnes, Grid est souvent plus direct.'),
      code('Exemple responsive', 'CSS', '.barre-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}'),
      decomposition('Axes et propriétés', [
        { terme: 'flex-direction', explication: 'définit l’axe principal : row par défaut, ou column.' },
        { terme: 'justify-content', explication: 'aligne ou distribue le long de l’axe principal.' },
        { terme: 'align-items', explication: 'aligne sur l’axe secondaire.' },
        { terme: 'gap', explication: 'espace cohérent entre les enfants sans marges compensatoires.' },
        { terme: 'flex: 1', explication: 'raccourci permettant notamment à un enfant d’occuper l’espace disponible.' }
      ]),
      alerte('erreur', 'Erreur fréquente', 'justify-content ne signifie pas toujours “horizontal”. Son axe dépend de flex-direction. Avec flex-direction: column, il agit verticalement.'),
      liens({ label: 'MDN — Flexbox', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Flexbox' })
    ],
    associes: ['css-grid', 'css-box-model', 'css-responsive']
  }),
  fiche({
    id: 'css-grid', domaine: 'css', categorie: 'Mise en page', titre: 'CSS Grid',
    resume: 'Définir une grille en deux dimensions et laisser les éléments s’y placer proprement.',
    tags: ['display grid', 'grid-template-columns', 'minmax', 'fr', 'gap'],
    sections: [
      code('Grille fluide', 'CSS', '.grille {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: 1rem;\n}'),
      decomposition('Décomposition', [
        { terme: 'repeat()', explication: 'répète une définition de piste.' },
        { terme: 'auto-fit', explication: 'crée autant de colonnes que l’espace permet et replie les pistes vides.' },
        { terme: 'minmax()', explication: 'borne la largeur minimale et maximale d’une piste.' },
        { terme: '1fr', explication: 'une fraction de l’espace disponible.' },
        { terme: 'min(100%, 16rem)', explication: 'évite qu’une largeur minimale fixe déborde sur un très petit écran.' }
      ]),
      comparaison('Flexbox ou Grid ?', ['Besoin', 'Choix courant', 'Pourquoi'], [
        ['Aligner sur un axe', 'Flexbox', 'Distribution linéaire'],
        ['Lignes et colonnes coordonnées', 'Grid', 'Contrôle bidimensionnel'],
        ['Composants de largeur variable', 'Les deux', 'Le contenu décide souvent'],
        ['Ordre logique', 'HTML d’abord', 'Ne pas réordonner au détriment du clavier']
      ]),
      liens({ label: 'MDN — CSS Grid', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Grids' })
    ],
    associes: ['css-flexbox', 'css-responsive', 'html-tableaux']
  }),
  fiche({
    id: 'css-responsive', domaine: 'css', categorie: 'Responsive', titre: 'Responsive design et media queries',
    resume: 'Construire une mise en page fluide qui s’adapte au contenu, puis ajouter des points de rupture utiles.',
    tags: ['responsive', 'media query', 'mobile first', 'clamp', 'viewport'],
    sections: [
      texte('Approche recommandée', 'Commencer par une mise en page simple adaptée aux petits écrans, employer des unités et grilles fluides, puis introduire une media query quand le contenu ne respire plus. Un breakpoint répond à un problème de composition, pas à un modèle de téléphone.'),
      code('Exemple mobile-first', 'CSS', '.contenu {\n  width: min(100% - 2rem, 72rem);\n  margin-inline: auto;\n}\n\n.titre {\n  font-size: clamp(2rem, 5vw, 4.5rem);\n}\n\n@media (min-width: 48rem) {\n  .mise-en-page {\n    display: grid;\n    grid-template-columns: 18rem 1fr;\n  }\n}'),
      alerte('bonne-pratique', 'Tester le contenu', 'Réduire la fenêtre progressivement : les mots longs, tableaux, blocs de code et menus révèlent mieux les vrais points de rupture qu’une liste d’appareils prédéfinis.'),
      liens({ label: 'MDN — Responsive design', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/CSS_layout/Responsive_Design' })
    ],
    associes: ['css-grid', 'css-flexbox', 'html-document']
  }),
  fiche({
    id: 'css-variables', domaine: 'css', categorie: 'Architecture', titre: 'Propriétés personnalisées CSS',
    resume: 'Nommer et réutiliser des valeurs CSS tout en profitant de la cascade.',
    tags: ['custom properties', 'var', 'root', 'design tokens', 'variables'],
    sections: [
      code('Syntaxe', 'CSS', ':root {\n  --couleur-accent: #5eead4;\n  --espace-4: 1rem;\n}\n\n.bouton {\n  color: var(--couleur-accent);\n  padding: var(--espace-4);\n}\n\n.zone-danger {\n  --couleur-accent: #fb7185;\n}'),
      texte('Fonctionnement', 'Une propriété personnalisée appartient à un élément et est héritée par ses descendants. La valeur est résolue au moment où var() est utilisée, ce qui permet de modifier un thème ou un composant localement.'),
      decomposition('Décomposition', [
        { terme: '--couleur-accent', explication: 'nom sensible à la casse, précédé de deux tirets.' },
        { terme: 'var(--couleur-accent)', explication: 'lit la valeur calculée dans le contexte de l’élément.' },
        { terme: 'var(--inconnue, blue)', explication: 'blue sert de valeur de repli si la propriété est absente ou invalide.' }
      ]),
      alerte('attention', 'Ce n’est pas Sass', 'Ces variables existent dans le navigateur, participent à la cascade et peuvent changer à l’exécution. Elles ne sont pas remplacées une fois pour toutes lors d’une compilation.'),
      liens({ label: 'MDN — Propriétés personnalisées', url: 'https://developer.mozilla.org/fr/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties' })
    ],
    associes: ['css-selecteurs', 'css-responsive', 'css-outils-comparaison']
  }),
  fiche({
    id: 'css-typographie', domaine: 'css', categorie: 'Présentation', titre: 'Typographie lisible en CSS',
    resume: 'Régler taille, hauteur de ligne et largeur de lecture sans sacrifier l’accessibilité.',
    tags: ['font', 'line-height', 'rem', 'ch', 'lisibilité'],
    sections: [
      code('Base raisonnable', 'CSS', 'body {\n  font-family: system-ui, sans-serif;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\n.prose {\n  max-width: 68ch;\n}\n\nh1 {\n  font-size: clamp(2rem, 6vw, 4rem);\n  line-height: 1.05;\n}'),
      liste('Repères', ['rem suit généralement la taille de police racine et respecte les réglages utilisateur.', 'Une ligne de texte trop longue fatigue ; une largeur en ch borne approximativement le nombre de caractères.', 'line-height sans unité s’adapte aux tailles héritées.', 'Le contraste, les états de focus et le zoom à 200 % font partie de la lisibilité.']),
      alerte('erreur', 'Erreur fréquente', 'Désactiver le zoom ou figer toute la typographie en pixels pénalise les personnes qui adaptent leur affichage.'),
      liens({ label: 'MDN — Mise en forme du texte', url: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Text_styling/Fundamentals' })
    ],
    associes: ['html-texte-listes', 'css-responsive']
  })
];
