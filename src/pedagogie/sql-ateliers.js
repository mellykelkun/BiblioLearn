'use strict';

const amorces = {
  'atelier-sql-recherche-parametree': `import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE livres (id INTEGER PRIMARY KEY, titre TEXT NOT NULL, prix_cents INTEGER NOT NULL)")
db.executemany("INSERT INTO livres (titre, prix_cents) VALUES (?, ?)", [("Web", 1200), ("API", 2400), ("SQL", 1800)])

def chercher(titre):
    return db.execute("SELECT titre, prix_cents FROM livres WHERE titre = ?", (titre,)).fetchall()

print(chercher("Web"))
print(chercher("' OR 1=1 --"))
db.close()
`,
  'atelier-sql-jointure-compte': `import sqlite3

db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE auteurs (id INTEGER PRIMARY KEY, nom TEXT NOT NULL);
CREATE TABLE livres (id INTEGER PRIMARY KEY, titre TEXT NOT NULL, auteur_id INTEGER REFERENCES auteurs(id));
INSERT INTO auteurs VALUES (1, 'Awa'), (2, 'Léa');
INSERT INTO livres VALUES (1, 'Web', 1), (2, 'API', 1), (3, 'SQL', 2);
""")

requete = """SELECT auteurs.nom, COUNT(*) AS total
FROM auteurs JOIN livres ON livres.auteur_id = auteurs.id
GROUP BY auteurs.id, auteurs.nom ORDER BY auteurs.nom"""
print(db.execute(requete).fetchall())
db.close()
`,
  'atelier-sql-transaction': `import sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE mouvements (id INTEGER PRIMARY KEY, valeur INTEGER NOT NULL CHECK(valeur > 0))")

def enregistrer(valeurs):
    try:
        with db:
            for valeur in valeurs:
                db.execute("INSERT INTO mouvements (valeur) VALUES (?)", (valeur,))
        return True
    except sqlite3.IntegrityError:
        return False

print(enregistrer([10, 20]))
print(enregistrer([30, -1]))
print(db.execute("SELECT valeur FROM mouvements ORDER BY id").fetchall())
db.close()
`
};

const specifications = [
  { id: 'recherche-parametree', titre: 'Chercher un livre sans concaténer les entrées', niveau: 'Fondamental → autonome', duree: '50 min', lecons: ['sql-select-where', 'sql-parametre'],
    objectif: 'Ajouter un filtre de prix à une recherche paramétrée et prouver qu’une entrée ressemblant à du SQL ne change pas les lignes retournées.',
    attendu: "[(\'Web\', 1200)] puis []", defaut: 'Un titre malveillant ne doit pas devenir une condition SQL.',
    action: 'Ajoutez un argument prix_max et la condition prix_cents <= ? dans la requête ; liez les deux paramètres dans leur ordre.',
    preuve: 'Web avec plafond 1200 donne une ligne ; Web avec plafond 1000 donne une liste vide ; la chaîne de test avec apostrophe reste une donnée.' },
  { id: 'jointure-compte', titre: 'Relier auteurs et livres puis calculer un total', niveau: 'Autonome → intermédiaire', duree: '60 min', lecons: ['sql-jointure', 'sql-grouper-compter'],
    objectif: 'Modifier une jointure pour inclure les auteurs sans livre et afficher un compte zéro plutôt que les perdre.',
    attendu: "[(\'Awa\', 2), (\'Léa\', 1)]", defaut: 'Une jointure interne retire les auteurs sans livre.',
    action: 'Ajoutez un auteur sans livre. Remplacez JOIN par LEFT JOIN et comptez livres.id plutôt que COUNT(*).',
    preuve: 'Le nouvel auteur apparaît avec zéro ; Awa reste à deux, Léa à un. Un produit cartésien ne doit jamais apparaître.' },
  { id: 'transaction', titre: 'Annuler une opération de données incomplète', niveau: 'Intermédiaire', duree: '70 min', lecons: ['sql-transaction', 'sql-table-contrainte'],
    objectif: 'Exécuter une opération à deux écritures et vérifier qu’une seconde valeur invalide annule aussi la première.',
    attendu: 'True, False et [(10,), (20,)]', defaut: 'La valeur 30 ne doit pas rester après le refus de -1.',
    action: 'Ajoutez une troisième tentative [40, 50] et vérifiez le total final ; provoquez ensuite un échec sur la deuxième valeur.',
    preuve: 'La tentative valide ajoute deux lignes ; la tentative invalide n’en ajoute aucune. Expliquez la portée de with db.' }
];

const executions = { windows: 'py sql.py', linux: 'python3 sql.py', mac: 'python3 sql.py' };
const ateliers = specifications.map(s => ({
  id: `atelier-sql-${s.id}`, titre: s.titre, domaine: 'sql', niveau: s.niveau, duree: s.duree,
  objectif: s.objectif, outils: ['Python 3', 'Bibliothèque standard sqlite3', 'Terminal'],
  prerequis: ['Lire les leçons liées', 'Travailler dans un dossier d’essai ; aucune base distante n’est nécessaire'],
  prerequisIds: s.lecons, associes: s.lecons,
  structure: [`atelier-sql-${s.id}/README.md`, `atelier-sql-${s.id}/sql.py`], execution: executions,
  etapes: [
    { titre: 'Préparer le dossier', explication: 'Créez le dossier et les deux fichiers de départ exactement comme indiqués. Vérifiez Python avant de modifier le script.', langage: 'Terminal', code: 'Windows : py --version\nLinux/macOS : python3 --version' },
    { titre: 'Exécuter le point de départ', explication: `Lancez sql.py et expliquez chaque ligne de sortie. Résultat initial : ${s.attendu}.`, langage: 'Python', code: amorces[`atelier-sql-${s.id}`] },
    { titre: 'Modifier une seule règle', explication: s.action, langage: 'Consigne SQL', code: s.action },
    { titre: 'Vérifier le cas limite', explication: `${s.preuve} ${s.defaut}`, langage: 'Protocole', code: `1. Exécuter le cas initial.\n2. Modifier la règle : ${s.action}\n3. Comparer : ${s.preuve}\n4. Noter la panne évitée : ${s.defaut}` }
  ],
  validation: [s.preuve, s.defaut, 'La commande du système choisi est lancée depuis le dossier contenant sql.py ; le script reste reproductible.'],
  sources: [{ label: 'SQLite — documentation officielle', url: 'https://www.sqlite.org/docs.html' }]
}));

module.exports = { ateliers, amorces };
