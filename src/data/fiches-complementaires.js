'use strict';

const { fiche, texte, code, liste, decomposition, alerte, comparaison, liens } = require('./outils');

module.exports = [
  fiche({
    id: 'html-focus-accessible', domaine: 'html', categorie: 'Accessibilité', titre: 'Focus, tabindex et ordre de lecture',
    resume: 'Construire un parcours clavier cohérent sans fabriquer des contrôles impossibles à atteindre.',
    tags: ['focus', 'tabindex', 'clavier', 'accessibilité', 'button', 'lien'],
    sections: [
      texte('Le focus est un état de navigation', 'La touche Tab suit l’ordre du document et place le focus sur les contrôles interactifs natifs. Un bouton déclenche une action ; un lien mène vers une destination. Conserver cette distinction donne déjà un clavier prévisible.'),
      code('Structure préférable', 'HTML', '<a href="#contenu">Aller au contenu</a>\n<button type="button" id="ouvrir">Ouvrir le panneau</button>\n\n<main id="contenu" tabindex="-1">\n  <h1>Tableau de bord</h1>\n</main>'),
      comparaison('tabindex', ['Valeur', 'Effet', 'Conseil'], [['absent', 'Ordre naturel pour les éléments interactifs', 'Choix par défaut'], ['0', 'Ajoute un élément personnalisé à l’ordre naturel', 'À réserver à un composant réellement interactif'], ['-1', 'Focus programmatique, pas Tab', 'Utile pour une cible de contenu'], ['positif', 'Impose un ordre artificiel', 'À éviter']]),
      alerte('erreur', 'Ne pas supprimer l’outline', 'Un outline visible est l’équivalent visuel du curseur clavier. Si vous le remplacez, gardez un contraste et une épaisseur faciles à repérer.'),
      liens({ label: 'MDN — tabindex', url: 'https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/tabindex' })
    ], associes: ['html-semantique', 'html-liens-images', 'dom-evenements']
  }),
  fiche({
    id: 'css-proprietes-logiques', domaine: 'css', categorie: 'Mise en page', titre: 'Propriétés logiques et interfaces RTL',
    resume: 'Écrire des espacements et bordures qui s’adaptent à la direction de lecture.',
    tags: ['margin-inline', 'padding-block', 'writing-mode', 'rtl', 'CSS logique'],
    sections: [
      texte('Décrire la fonction, pas le côté', 'margin-left et margin-right supposent une interface gauche-droite. Les propriétés logiques parlent d’inline et de block : la même feuille peut accompagner une interface en arabe, en hébreu ou une autre direction.'),
      code('Espacements portables', 'CSS', '.article {\n  margin-inline: auto;\n  padding-block: 2rem;\n  padding-inline: 1.25rem;\n  border-inline-start: 4px solid #0f766e;\n}\n\n[dir="rtl"] .article {\n  text-align: start;\n}'),
      decomposition('Axes à retenir', [{ terme: 'inline', explication: 'axe du texte ; horizontal en écriture latine, mais pas nécessairement dans toutes les écritures.' }, { terme: 'block', explication: 'axe d’empilement des blocs.' }, { terme: 'start/end', explication: 'début et fin de l’axe, qui suivent la direction de lecture.' }]),
      alerte('bonne-pratique', 'Tester la direction', 'Ajoutez un attribut dir sur un conteneur de test et vérifiez les marges, les icônes et les alignements. Une interface RTL révèle souvent les hypothèses cachées dans le CSS.'),
      liens({ label: 'MDN — CSS logical properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values' })
    ], associes: ['css-box-model', 'css-flexbox', 'css-responsive']
  }),
  fiche({
    id: 'js-date-intl', domaine: 'javascript', categorie: 'Dates et internationalisation', titre: 'Dates, fuseaux et Intl',
    resume: 'Afficher une date pour une personne sans confondre instant UTC, fuseau et format local.',
    tags: ['Date', 'Intl.DateTimeFormat', 'timezone', 'UTC', 'locale'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Un instant, plusieurs affichages', 'Une date ISO avec Z décrit un instant en UTC. L’interface doit ensuite choisir une locale et un fuseau pour l’afficher. Évitez de découper des chaînes à la main : les mois, l’heure d’été et les conventions locales rendent cette approche fragile.'),
      code('Formater pour l’interface', 'JavaScript', 'const instant = new Date("2026-10-01T14:30:00Z");\nconst format = new Intl.DateTimeFormat("fr-FR", {\n  dateStyle: "medium",\n  timeStyle: "short",\n  timeZone: "Africa/Abidjan"\n});\n\nformat.format(instant); // 1 oct. 2026, 14:30'),
      comparaison('Choisir une représentation', ['Besoin', 'Format conseillé', 'Pourquoi'], [['Transport API', 'ISO 8601 en UTC', 'Non ambigu entre systèmes'], ['Stockage d’un instant', 'Timestamp ou timestamptz', 'Conserve un instant'], ['Affichage humain', 'Intl.DateTimeFormat', 'Respecte locale et fuseau'], ['Date sans heure', 'Valeur métier séparée', 'Une échéance n’est pas toujours un instant']]),
      alerte('erreur', 'Date sans fuseau', 'Une chaîne comme 2026-10-01T14:30:00 sans fuseau peut être interprétée selon l’environnement. Décidez explicitement si votre donnée représente un instant ou une date de calendrier.'),
      liens({ label: 'MDN — Intl.DateTimeFormat', url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat' })
    ], associes: ['js-types', 'js-json', 'js-erreurs']
  }),
  fiche({
    id: 'http-cookies-sessions', domaine: 'http', categorie: 'État et sécurité', titre: 'Cookies, sessions et attributs de sécurité',
    resume: 'Comprendre ce que transporte un cookie et limiter son exposition avec HttpOnly, Secure et SameSite.',
    tags: ['cookie', 'session', 'HttpOnly', 'Secure', 'SameSite', 'HTTP'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Le cookie n’est pas la session', 'Un cookie est un en-tête stocké et renvoyé par le navigateur. Une session est une continuité côté serveur, souvent identifiée par un cookie opaque. Ne placez pas de données sensibles ou de décision d’autorisation directement dans un cookie lisible par le client.'),
      code('Réponse et requête', 'HTTP', 'HTTP/1.1 200 OK\nSet-Cookie: session_id=opaque; HttpOnly; Secure; SameSite=Lax; Path=/\n\nGET /espace HTTP/1.1\nCookie: session_id=opaque'),
      liste('Attributs importants', ['HttpOnly empêche JavaScript de lire le cookie.', 'Secure exige HTTPS, sauf exceptions locales contrôlées.', 'SameSite limite les envois cross-site et réduit certains risques CSRF.', 'Max-Age ou Expires définit la durée de vie.', 'Path limite les chemins concernés.']),
      alerte('attention', 'Ne pas confondre authentification et autorisation', 'Un cookie prouve éventuellement qu’une session est retrouvée ; chaque route doit encore vérifier que cette identité a le droit d’accéder à la ressource demandée.'),
      liens({ label: 'MDN — Using HTTP cookies', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies' })
    ], associes: ['http-headers-cors', 'http-methodes', 'http-status']
  }),
  fiche({
    id: 'express-securite-base', domaine: 'express', categorie: 'API robuste', titre: 'Réduire la surface d’attaque Express',
    resume: 'Limiter les entrées, les réponses et les informations exposées par un serveur Express.',
    tags: ['Express', 'sécurité', 'payload', 'headers', 'secret', 'validation'],
    niveau: 'Intermédiaire',
    sections: [
      texte('La sécurité est une série de limites', 'Une API sûre limite la taille des corps, valide les types, évite de renvoyer des secrets et ne confond pas message de diagnostic et réponse publique. Aucun middleware ne remplace une analyse du modèle de menace, mais ces barrières réduisent les erreurs courantes.'),
      code('Barrières de base', 'JavaScript', 'const express = require("express");\nconst app = express();\n\napp.disable("x-powered-by");\napp.use(express.json({ limit: "32kb" }));\n\napp.get("/api/profil", (req, res) => {\n  const profil = obtenirProfil(req);\n  res.json({ id: profil.id, nom: profil.nom });\n});'),
      decomposition('Avant de déployer', [{ terme: 'Entrée', explication: 'taille, type, format et valeurs autorisées sont vérifiés.' }, { terme: 'Sortie', explication: 'seuls les champs nécessaires sont sérialisés.' }, { terme: 'Erreur', explication: 'les détails sont consignés côté serveur, pas exposés par défaut.' }, { terme: 'Secret', explication: 'les clés viennent de l’environnement et ne sont jamais commitées.' }]),
      alerte('erreur', 'CORS n’est pas une authentification', 'CORS contrôle ce que certains navigateurs autorisent à lire. Il ne bloque pas un client curl ou un script serveur. Les permissions doivent être vérifiées par l’API.'),
      liens({ label: 'Express — Security best practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html' })
    ], associes: ['express-middleware', 'express-erreurs', 'http-headers-cors']
  }),
  fiche({
    id: 'javascript-abort-controller', domaine: 'javascript', categorie: 'Asynchrone', titre: 'Annuler une requête avec AbortController',
    resume: 'Éviter qu’une réponse lente mette à jour une interface déjà abandonnée.',
    tags: ['AbortController', 'fetch', 'annulation', 'Promise', 'asynchrone'],
    niveau: 'Intermédiaire',
    sections: [
      texte('Annuler une intention devenue inutile', 'Une recherche lancée à chaque saisie peut laisser plusieurs requêtes en vol. AbortController permet de signaler que la précédente n’est plus attendue. L’annulation économise du travail mais ne remplace pas la gestion des erreurs et des courses entre réponses.'),
      code('Recherche annulable', 'JavaScript', 'let controleur;\n\nasync function rechercher(terme) {\n  controleur?.abort();\n  controleur = new AbortController();\n  try {\n    const response = await fetch("/api/recherche?q=" + encodeURIComponent(terme), {\n      signal: controleur.signal\n    });\n    return await response.json();\n  } catch (erreur) {\n    if (erreur.name !== "AbortError") throw erreur;\n    return null;\n  }\n}'),
      liste('À vérifier', ['Créer un contrôleur par intention.', 'Passer signal à fetch ou à l’API qui le supporte.', 'Ignorer explicitement AbortError.', 'Garder un état de chargement compréhensible pour la dernière requête.']),
      alerte('bonne-pratique', 'Le serveur peut continuer', 'Annuler fetch côté navigateur ne garantit pas que le serveur arrête son travail. Pour les opérations coûteuses, prévoyez aussi une stratégie côté serveur.'),
      liens({ label: 'MDN — AbortController', url: 'https://developer.mozilla.org/fr/docs/Web/API/AbortController' }, { label: 'MDN — Fetch API', url: 'https://developer.mozilla.org/fr/docs/Web/API/Fetch_API' })
    ], associes: ['js-fetch', 'js-promises', 'dom-evenements']
  })
];
