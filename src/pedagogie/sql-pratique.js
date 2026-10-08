'use strict';

// SQLite est ici piloté par la bibliothèque standard Python : aucun serveur ni
// compte distant n’est nécessaire. Chaque requête a un jeu de données fixé.
const socle = `CREATE TABLE auteurs (id INTEGER PRIMARY KEY, nom TEXT NOT NULL);
CREATE TABLE livres (id INTEGER PRIMARY KEY, titre TEXT NOT NULL, auteur_id INTEGER REFERENCES auteurs(id), prix_cents INTEGER NOT NULL CHECK(prix_cents >= 0));
INSERT INTO auteurs VALUES (1, 'Awa'), (2, 'Léa');
INSERT INTO livres VALUES (1, 'Web', 1, 1200), (2, 'API', 1, 2400), (3, 'SQL', 2, 1800);`;
const sujets = [
  {
    slug: 'table-contrainte', titre: 'Définir une table et refuser une valeur invalide', niveau: 2,
    contrat: 'CREATE TABLE nomme les colonnes et leurs contraintes. NOT NULL refuse une absence ; CHECK exprime une borne ; PRIMARY KEY identifie une ligne. La validation dans l’application reste utile pour un message compréhensible.',
    schema: 'CREATE TABLE livres (id INTEGER PRIMARY KEY, titre TEXT NOT NULL, prix_cents INTEGER NOT NULL CHECK(prix_cents >= 0));',
    requete: "INSERT INTO livres (titre, prix_cents) VALUES ('Web', 1200); SELECT id, titre, prix_cents FROM livres;",
    attendu: "[(1, 'Web', 1200)]", lecture: 'L’id est attribué par SQLite quand on omet la colonne INTEGER PRIMARY KEY. Le prix entier évite les ambiguïtés de représentation décimale pour ce petit exemple.',
    panne: 'Une insertion avec prix_cents = -1 lève une erreur de contrainte ; elle ne doit pas être traitée comme un achat gratuit.',
    exercice: 'Ajoutez une colonne stock entier dont la valeur par défaut est zéro et dont le contenu ne peut pas être négatif. Insérez un livre sans préciser stock.',
    correction: 'Déclarez `stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0)`. Une insertion sans stock reçoit 0 ; une insertion avec -1 échoue.',
    source: 'https://www.sqlite.org/lang_createtable.html'
  },
  {
    slug: 'select-where', titre: 'Lire seulement les colonnes et les lignes utiles', niveau: 2,
    contrat: 'SELECT choisit les colonnes ; WHERE filtre les lignes avant leur retour. Une requête ne devrait pas demander SELECT * quand le contrat de sortie n’a besoin que d’un titre et d’un prix.',
    schema: socle, requete: 'SELECT titre, prix_cents FROM livres WHERE prix_cents >= 1800 ORDER BY id;',
    attendu: "[('API', 2400), ('SQL', 1800)]", lecture: 'La condition garde les livres à 18,00 et plus ; ORDER BY id rend l’ordre vérifiable. Le résultat contient deux colonnes dans l’ordre annoncé, sans identifiant ni auteur.',
    panne: 'Omettre WHERE retourne aussi Web ; omettre ORDER BY ne garantit pas l’ordre des lignes.',
    exercice: 'Écrivez une requête qui donne uniquement les titres des livres dont le prix est strictement inférieur à 1800 cents, triés par titre.',
    correction: '`SELECT titre FROM livres WHERE prix_cents < 1800 ORDER BY titre;` retourne seulement Web. Le signe < exclut SQL à 1800.',
    source: 'https://www.sqlite.org/lang_select.html'
  },
  {
    slug: 'parametre', titre: 'Lier une valeur sans assembler du SQL utilisateur', niveau: 3,
    contrat: 'Le paramètre `?` marque une valeur transmise séparément de la requête. Le pilote SQLite traite cette valeur comme donnée, même si elle contient des caractères qui ressemblent à du SQL.',
    schema: socle, requete: 'SELECT titre FROM livres WHERE titre = ?', parametres: ["' OR 1=1 --"],
    attendu: '[]', lecture: 'La chaîne entière est comparée à titre ; elle ne modifie pas la structure du SELECT. Les noms de table et de colonne ne se lient pas comme des valeurs : choisissez-les dans le code, pas dans une entrée libre.',
    panne: 'Concaténer une valeur externe dans la chaîne de requête peut changer la condition WHERE et divulguer d’autres lignes.',
    exercice: 'Cherchez le livre API par un paramètre lié ; prédisez le résultat si le titre n’existe pas.',
    correction: '`db.execute("SELECT titre FROM livres WHERE titre = ?", ("API",)).fetchall()` rend [("API",)]. Un titre absent rend une liste vide.',
    source: 'https://docs.python.org/3/library/sqlite3.html#how-to-use-placeholders-to-bind-values-in-sql-queries'
  },
  {
    slug: 'jointure', titre: 'Relier un livre à son auteur avec JOIN', niveau: 3,
    contrat: 'Une clé étrangère conserve une relation entre tables. JOIN relie les lignes selon la clé, puis SELECT choisit les champs publics. Ne confondez pas la condition de jointure avec un filtre métier.',
    schema: socle, requete: 'SELECT livres.titre, auteurs.nom FROM livres JOIN auteurs ON auteurs.id = livres.auteur_id ORDER BY livres.id;',
    attendu: "[('Web', 'Awa'), ('API', 'Awa'), ('SQL', 'Léa')]", lecture: 'ON compare l’id de l’auteur à la référence portée par le livre. La requête retourne un titre et un nom par livre, sans dupliquer le nom dans la table livres.',
    panne: 'Oublier ON peut créer un produit cartésien : chaque livre se combine à chaque auteur.',
    exercice: 'Filtrez la jointure pour ne garder que les livres d’Awa, en triant par titre.',
    correction: 'Ajoutez `WHERE auteurs.nom = ? ORDER BY livres.titre` et liez Awa. Le résultat contient API puis Web ; l’entrée reste un paramètre.',
    source: 'https://www.sqlite.org/lang_select.html'
  },
  {
    slug: 'grouper-compter', titre: 'Compter les lignes par groupe et filtrer le total', niveau: 4,
    contrat: 'GROUP BY forme un groupe par valeur ; COUNT compte ses lignes ; HAVING filtre un résultat agrégé. WHERE filtre les lignes avant le groupement, ce qui répond à une autre question.',
    schema: socle, requete: 'SELECT auteur_id, COUNT(*) AS nombre FROM livres GROUP BY auteur_id HAVING COUNT(*) >= 2;',
    attendu: '[(1, 2)]', lecture: 'Awa, auteur 1, a deux livres ; Léa n’en a qu’un et n’apparaît pas. Le résultat est ordonné par aucune clause ; ici un seul groupe passe le seuil.',
    panne: 'Utiliser `WHERE COUNT(*) >= 2` est invalide pour cette étape : le total n’existe qu’après le groupement.',
    exercice: 'Affichez aussi le nom des auteurs ayant au moins deux livres. Quelle jointure et quel GROUP BY choisissez-vous ?',
    correction: 'Joignez auteurs à livres, groupez par auteurs.id et auteurs.nom, puis utilisez `HAVING COUNT(*) >= 2`. Le nom Awa accompagne le total 2.',
    source: 'https://www.sqlite.org/lang_select.html'
  },
  {
    slug: 'ordre-pagination', titre: 'Paginer avec un ordre stable et une limite', niveau: 4,
    contrat: 'LIMIT borne le nombre de lignes et OFFSET saute les premières lignes d’un ordre défini. Sans ORDER BY stable, une page peut changer d’un appel à l’autre. Une pagination par curseur est préférable pour de grands ensembles mouvants.',
    schema: socle, requete: 'SELECT id, titre FROM livres ORDER BY id LIMIT 2 OFFSET 1;',
    attendu: "[(2, 'API'), (3, 'SQL')]", lecture: 'L’ordre par id fixe la séquence 1, 2, 3. OFFSET 1 saute Web ; LIMIT 2 rend les deux lignes suivantes. Une API doit borner LIMIT reçu du client.',
    panne: 'Un LIMIT immense peut faire charger trop de lignes ; un OFFSET profond peut coûter cher sur une grande table.',
    exercice: 'Donnez la première page de deux livres, puis une page vide après le dernier id, avec un ordre explicite.',
    correction: '`ORDER BY id LIMIT 2 OFFSET 0` donne Web et API ; `OFFSET 3` ne rend aucune ligne. N’annoncez pas une erreur pour une page simplement vide.',
    source: 'https://www.sqlite.org/lang_select.html'
  },
  {
    slug: 'cle-etrangere', titre: 'Activer et tester l’intégrité référentielle SQLite', niveau: 5,
    contrat: 'Une FOREIGN KEY exprime qu’un identifiant référencé doit exister. Dans SQLite, le contrôle doit être activé sur chaque connexion avec PRAGMA foreign_keys = ON avant de compter sur la contrainte.',
    schema: 'PRAGMA foreign_keys = ON; CREATE TABLE auteurs (id INTEGER PRIMARY KEY); CREATE TABLE livres (id INTEGER PRIMARY KEY, auteur_id INTEGER NOT NULL REFERENCES auteurs(id)); INSERT INTO auteurs VALUES (1);',
    requete: 'INSERT INTO livres VALUES (1, 1); SELECT auteur_id FROM livres;', attendu: '[(1,)]',
    lecture: 'La ligne de livre référence l’auteur 1 existant. Le PRAGMA précède les écritures. Une suppression d’auteur lié doit aussi être pensée : refus, cascade ou autre règle explicitement choisie.',
    panne: 'INSERT INTO livres VALUES (2, 9) échoue seulement si l’intégrité référentielle est activée pour la connexion.',
    exercice: 'Essayez une insertion vers l’auteur 9 et notez le type d’erreur ; ne désactivez pas la contrainte pour faire passer le cas.',
    correction: 'L’insertion lève sqlite3.IntegrityError avec PRAGMA foreign_keys = ON. Créez d’abord un auteur valide ou refusez le livre.',
    source: 'https://www.sqlite.org/foreignkeys.html'
  },
  {
    slug: 'transaction', titre: 'Annuler plusieurs écritures qui forment une seule opération', niveau: 5,
    contrat: 'BEGIN ouvre une transaction ; COMMIT valide toutes les écritures ; ROLLBACK les annule. Une opération métier qui crée deux lignes liées ne doit pas laisser uniquement la première si la seconde échoue.',
    schema: 'CREATE TABLE mouvements (id INTEGER PRIMARY KEY, valeur INTEGER NOT NULL CHECK(valeur > 0));',
    requete: 'BEGIN; INSERT INTO mouvements(valeur) VALUES (10); ROLLBACK; SELECT COUNT(*) FROM mouvements;', attendu: '[(0,)]',
    lecture: 'La première insertion existe pendant la transaction mais disparaît après ROLLBACK. Le script pédagogique exécute BEGIN et ROLLBACK sur une connexion en mémoire pour isoler le résultat.',
    panne: 'Un second BEGIN avant COMMIT ou ROLLBACK échoue : les transactions SQL ordinaires ne se nichent pas ainsi dans SQLite.',
    exercice: 'Remplacez ROLLBACK par COMMIT et comparez le compte ; puis rétablissez ROLLBACK avant de poursuivre.',
    correction: 'Avec COMMIT, COUNT(*) vaut 1. Avec ROLLBACK, il vaut 0. Le choix dépend du succès de toute l’opération, pas d’une seule instruction.',
    source: 'https://www.sqlite.org/lang_transaction.html'
  },
  {
    slug: 'index-plan', titre: 'Créer un index après avoir observé le plan de requête', niveau: 6,
    contrat: 'Un index peut accélérer une recherche sur une colonne, mais ajoute un coût aux écritures et à l’espace occupé. EXPLAIN QUERY PLAN aide à observer une stratégie ; sur trois lignes, aucun gain de vitesse significatif ne peut être promis.',
    schema: socle, requete: 'CREATE INDEX livres_titre_idx ON livres(titre); EXPLAIN QUERY PLAN SELECT id FROM livres WHERE titre = ?;', parametres: ['Web'],
    attenduContient: 'INDEX livres_titre_idx', lecture: 'L’index porte sur titre. Le plan produit par SQLite doit mentionner son usage pour ce SELECT, mais son libellé exact peut varier selon la version. Un test de performance exige un jeu de données représentatif.',
    panne: 'Indexer chaque colonne par réflexe ralentit les écritures et n’aide pas forcément les requêtes réelles.',
    exercice: 'Supprimez l’index puis comparez le plan ; expliquez pourquoi vous ne pouvez pas déduire un gain de production de ce jeu de trois lignes.',
    correction: 'Sans l’index, le plan peut annoncer un parcours de table. Mesurez une requête réelle sur un volume représentatif avant de garder l’index.',
    source: 'https://www.sqlite.org/eqp.html'
  },
  {
    slug: 'migration-donnees', titre: 'Faire évoluer un schéma sans perdre les données existantes', niveau: 6,
    contrat: 'Une migration décrit un changement de structure reproductible. Avant d’ajouter une colonne obligatoire, il faut prévoir une valeur pour les lignes existantes ou une migration en plusieurs étapes.',
    schema: 'CREATE TABLE livres (id INTEGER PRIMARY KEY, titre TEXT NOT NULL); INSERT INTO livres VALUES (1, \'Web\');',
    requete: "ALTER TABLE livres ADD COLUMN langue TEXT NOT NULL DEFAULT 'fr'; SELECT id, titre, langue FROM livres;",
    attendu: "[(1, 'Web', 'fr')]", lecture: 'DEFAULT fournit une valeur aux lignes déjà présentes dans ce petit exemple. Une application réelle doit versionner la migration et vérifier le résultat sur une copie des données avant livraison.',
    panne: 'Ajouter directement une colonne NOT NULL sans défaut à une table déjà remplie peut échouer.',
    exercice: 'Ajoutez une deuxième ligne avant la migration et vérifiez que les deux reçoivent la valeur par défaut.',
    correction: 'Insérez un second livre dans le schéma initial, exécutez ALTER TABLE, puis SELECT ordonné par id. Les deux lignes ont langue = fr.',
    source: 'https://www.sqlite.org/lang_altertable.html'
  }
];

function programme(s) {
  const lignes = [
    'import sqlite3', 'db = sqlite3.connect(":memory:")',
    `db.executescript(${JSON.stringify(s.schema)})`
  ];
  if (s.slug === 'transaction') {
    lignes.push('db.execute("BEGIN")', 'db.execute("INSERT INTO mouvements(valeur) VALUES (10)")', 'db.rollback()', 'print(db.execute("SELECT COUNT(*) FROM mouvements").fetchall())');
  } else if (s.slug === 'index-plan') {
    lignes.push('db.execute("CREATE INDEX livres_titre_idx ON livres(titre)")', 'plan = db.execute("EXPLAIN QUERY PLAN SELECT id FROM livres WHERE titre = ?", ("Web",)).fetchall()', 'print(any("INDEX livres_titre_idx" in str(ligne) for ligne in plan))');
  } else if (s.requete.includes(';')) {
    const morceaux = s.requete.split(';').map(x => x.trim()).filter(Boolean);
    for (const sql of morceaux.slice(0, -1)) lignes.push(`db.execute(${JSON.stringify(sql)})`);
    lignes.push(`print(db.execute(${JSON.stringify(morceaux.at(-1))}).fetchall())`);
  } else {
    lignes.push(`print(db.execute(${JSON.stringify(s.requete)}${s.parametres ? `, ${JSON.stringify(s.parametres)}` : ''}).fetchall())`);
  }
  lignes.push('db.close()');
  return lignes.join('\n');
}

function lecon(s) {
  const exemple = programme(s);
  const sortie = s.attenduContient ? 'True : le plan mentionne INDEX livres_titre_idx.' : s.attendu;
  return {
    id: `sql-${s.slug}`, domaine: 'sql', categorie: s.niveau <= 3 ? 'Fondations SQL' : s.niveau <= 5 ? 'Requêtes et intégrité' : 'Qualité et évolution',
    titre: s.titre, resume: s.contrat, niveau: s.niveau <= 3 ? 'Fondamental → autonome' : 'Intermédiaire → confirmé', niveauPedagogique: s.niveau,
    tempsEstime: 40, associes: [], maturiteEditoriale: 'enriched', provenance: 'redaction-specifique',
    sections: [
      { type: 'texte', titre: 'Comprendre le contrat', contenu: s.contrat },
      { type: 'code', titre: 'Fichier complet : sql.py', langage: 'Python / SQL', contenu: exemple, legende: 'Windows : py sql.py ; Linux ou macOS : python3 sql.py. Python et sa bibliothèque sqlite3 suffisent.' },
      { type: 'texte', titre: 'Suivre la requête et le résultat', contenu: `${s.lecture} Sortie à comparer : ${sortie}` },
      { type: 'code', titre: 'SQL isolé à relire', langage: 'SQL', contenu: s.requete, legende: 'Cette requête utilise le schéma initialisé dans le programme Python ; ce fragment seul ne crée pas les tables.' },
      { type: 'texte', titre: 'Essayer sur son système', contenu: `Créez sql.py dans un dossier d’essai et copiez le premier bloc entier. Windows : py sql.py. Linux/macOS : python3 sql.py. Résultat attendu : ${sortie}` },
      { type: 'alerte', variante: 'attention', titre: 'Panne à diagnostiquer', contenu: s.panne },
      { type: 'exercice', titre: 'Pratiquer une variation', contenu: s.exercice, indice: s.lecture },
      { type: 'solution', titre: 'Corrigé raisonné', contenu: s.correction },
      { type: 'liens', titre: 'Documentation officielle', elements: [{ label: 'SQLite — documentation officielle', url: s.source }] }
    ],
    sessions: [
      { id: 'contrat', titre: 'Comprendre', duree: '5 min', activite: 'Formulez la question posée aux données.', sections: [0] },
      { id: 'code', titre: 'Lire le programme', duree: '10 min', activite: 'Repérez schéma, données, requête et sortie.', sections: [1] },
      { id: 'essayer', titre: 'Exécuter', duree: '10 min', activite: 'Lancez la commande du système choisi et comparez la sortie.', sections: [4] },
      { id: 'pratiquer', titre: 'Modifier', duree: '10 min', activite: 'Faites la variation avant d’ouvrir la réponse.', sections: [6] },
      { id: 'corrige', titre: 'Vérifier', duree: '5 min', activite: 'Expliquez la différence observée.', sections: [7] }
    ]
  };
}

function reference(s, index) {
  return { id: index < 2 ? `pratique-sql-${s.slug}` : `profondeur-sql-${s.slug}`, terme: s.titre, categorie: 'sql', famille: 'sql',
    niveau: s.niveau <= 3 ? 'Fondamental' : 'Intermédiaire → confirmé', aliases: [], associes: [],
    definition: s.contrat, resume: s.contrat, signature: s.requete, langageSignature: 'SQL', retour: s.attendu || s.attenduContient,
    article: [s.lecture], exemples: [{ titre: 'Programme autonome', langage: 'Python / SQL', contenu: programme(s), explication: s.lecture }, { titre: 'Requête SQL', langage: 'SQL', contenu: s.requete, explication: s.attendu || s.attenduContient }],
    pourquoiUtiliser: [s.contrat], nePasUtiliser: [s.panne], avertissements: [s.panne],
    exercice: { objectif: s.exercice, contexte: 'Exécutez le programme sql.py dans un dossier isolé.', etapes: [s.exercice], validation: [s.correction] },
    sources: [{ label: 'SQLite — documentation officielle', url: s.source }], source: { id: `sql-${s.slug}`, fiche: s.titre },
    maturiteEditoriale: 'enriched', provenance: 'redaction-specifique' };
}

module.exports = { lecons: sujets.map(lecon), references: sujets.map(reference) };
