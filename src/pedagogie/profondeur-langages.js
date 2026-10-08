'use strict';

// Chaque entrée est un cas distinct : contrat, programme complet, variation,
// observation, panne et transfert. La référence reprend ce noyau pour la recherche.
const sujets = [
  {
    domaine: 'python', slug: 'dataclass-invariant', titre: 'Modéliser une donnée et défendre ses invariants', niveau: 4, langage: 'Python', fichier: 'livre.py', commande: 'python3 livre.py (Windows : py livre.py)',
    contrat: 'Une dataclass fournit une représentation et un constructeur à partir de champs déclarés. Elle ne valide pas automatiquement les règles métier : __post_init__ est appelé après la construction pour refuser un nombre de pages négatif.',
    principal: 'from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Livre:\n    titre: str\n    pages: int\n\n    def __post_init__(self):\n        if not self.titre.strip() or self.pages < 0:\n            raise ValueError("livre invalide")\n\nlivre = Livre("Web", 120)\nprint(livre.titre, livre.pages)',
    variante: 'try:\n    Livre("", -1)\nexcept ValueError as erreur:\n    print(type(erreur).__name__)  # ValueError',
    lecture: 'frozen=True empêche une réaffectation ordinaire après la création ; il ne remplace pas la validation. Le titre est contrôlé après suppression conceptuelle des espaces, sans modifier la valeur conservée. Si vous voulez normaliser le texte, faites-le explicitement avant de construire Livre.',
    attendu: 'Web 120, puis ValueError dans la variante.', panne: 'Créer Livre("", 10) doit échouer ; ne supposez pas qu’une annotation str interdit à elle seule une chaîne vide.',
    exercice: 'Ajoutez un champ prix_centimes entier non négatif. Prédisez ce que Livre("A", 1, -2) doit produire.', correction: 'Ajoutez prix_centimes: int, puis `or self.prix_centimes < 0` dans __post_init__. La construction invalide lève ValueError avant qu’un livre utilisable ne soit transmis.',
    source: 'https://docs.python.org/3/library/dataclasses.html'
  },
  {
    domaine: 'python', slug: 'sqlite-transaction', titre: 'Écrire dans SQLite avec une transaction et des paramètres', niveau: 5, langage: 'Python', fichier: 'stockage.py', commande: 'python3 stockage.py (Windows : py stockage.py)',
    contrat: 'sqlite3 accepte une base locale et des paramètres `?` pour séparer les données du SQL. Une transaction doit être validée ou annulée de manière explicite ; un contexte de connexion valide sur réussite et annule sur exception.',
    principal: 'import sqlite3\n\nwith sqlite3.connect(":memory:") as db:\n    db.execute("CREATE TABLE livres (id INTEGER PRIMARY KEY, titre TEXT NOT NULL)")\n    db.execute("INSERT INTO livres (titre) VALUES (?)", ("Web",))\n    ligne = db.execute("SELECT titre FROM livres WHERE id = ?", (1,)).fetchone()\n    print(ligne[0] if ligne else "Absent")',
    variante: 'titre = "\' OR 1=1 --"\nligne = db.execute("SELECT id FROM livres WHERE titre = ?", (titre,)).fetchone()\nprint(ligne)  # None',
    lecture: 'Le second argument de execute est un tuple de valeurs : la virgule de (1,) est indispensable. fetchone renvoie un tuple ou None. Le contexte gère la transaction ; la connexion doit être fermée si elle est conservée au-delà du petit essai.',
    attendu: 'Web ; la recherche de la variante ne trouve aucune ligne.', panne: 'Concaténer titre dans la chaîne SQL rend la requête dépendante de son contenu et ouvre une injection.',
    exercice: 'Ajoutez une colonne prix_centimes et insérez 2500 avec deux paramètres. Lisez le titre et le prix.', correction: 'Utilisez `INSERT INTO livres (titre, prix_centimes) VALUES (?, ?)` et le tuple `( "Web", 2500 )`. Lisez les deux colonnes via une requête paramétrée.',
    source: 'https://docs.python.org/3/library/sqlite3.html'
  },
  {
    domaine: 'java', slug: 'optional-absence', titre: 'Représenter une recherche absente avec Optional', niveau: 4, langage: 'Java', fichier: 'Bonjour.java', commande: 'javac Bonjour.java puis java Bonjour',
    contrat: 'Optional<T> décrit une valeur qui peut manquer sans inventer un objet vide. L’appelant doit choisir un repli ou traiter l’absence. Optional n’est pas un remplacement universel de tous les champs nullable.',
    principal: 'import java.util.Optional;\npublic class Bonjour {\n  static Optional<String> trouver(int id) {\n    return id == 1 ? Optional.of("Web") : Optional.empty();\n  }\n  public static void main(String[] args) {\n    System.out.println(trouver(1).orElse("Absent"));\n    System.out.println(trouver(2).orElse("Absent"));\n  }\n}',
    variante: 'var resultat = trouver(2);\nSystem.out.println(resultat.isPresent()); // false',
    lecture: 'of exige une valeur non nulle ; empty annonce une absence connue. orElse fournit un texte de repli pour l’affichage. Une vraie API pourrait traduire cette absence en 404 au lieu d’envoyer le mot Absent comme donnée.',
    attendu: 'Web puis Absent ; la variante affiche false.', panne: 'Appeler get() sans contrôle sur Optional.empty() lève NoSuchElementException.',
    exercice: 'Ajoutez trouver(3) et expliquez comment distinguer id absent d’une panne de base.', correction: 'trouver(3) renvoie Optional.empty() dans cet exemple. Une panne de base doit rester une erreur distincte ; ne la transformez pas silencieusement en absence.',
    source: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html'
  },
  {
    domaine: 'java', slug: 'map-frequences', titre: 'Compter avec Map sans confondre clé absente et valeur nulle', niveau: 4, langage: 'Java', fichier: 'Bonjour.java', commande: 'javac Bonjour.java puis java Bonjour',
    contrat: 'Map associe une clé à une valeur. getOrDefault fournit une valeur pour une clé absente ; merge combine une valeur existante avec une nouvelle. Un compteur n’a pas besoin de parcourir toutes les clés à chaque mot.',
    principal: 'import java.util.HashMap;\nimport java.util.Map;\npublic class Bonjour {\n  public static void main(String[] args) {\n    Map<String, Integer> comptes = new HashMap<>();\n    for (String mot : new String[]{"web", "api", "web"})\n      comptes.merge(mot, 1, Integer::sum);\n    System.out.println(comptes.getOrDefault("web", 0));\n  }\n}',
    variante: 'System.out.println(comptes.getOrDefault("css", 0)); // 0',
    lecture: 'merge insère 1 à la première apparition ; à la suivante, Integer::sum additionne l’ancien compte et 1. HashMap ne garantit pas un ordre de parcours : ce code lit une clé précise et n’en dépend pas.',
    attendu: '2 pour web ; 0 pour css.', panne: 'Utiliser `comptes.get(mot) + 1` quand la clé manque provoque une erreur de déballage de null.',
    exercice: 'Comptez aussi api deux fois et annoncez les valeurs attendues.', correction: 'Ajoutez "api" une seconde fois dans le tableau : getOrDefault("api", 0) vaut 2, tandis que web reste à 2.',
    source: 'https://dev.java/learn/api/collections-and-streams/collections-framework/'
  },
  {
    domaine: 'cpp', slug: 'vector-borne', titre: 'Choisir vector et vérifier un indice', niveau: 4, langage: 'C++', fichier: 'main.cpp', commande: 'Linux : g++ -std=c++20 -Wall -Wextra main.cpp -o atelier && ./atelier ; macOS : clang++ -std=c++20 -Wall -Wextra main.cpp -o atelier && ./atelier ; Windows : cl /EHsc /std:c++20 main.cpp puis .\\main.exe',
    contrat: 'std::vector conserve une suite de taille variable. operator[] suppose un indice valide ; at() vérifie la borne et lève std::out_of_range. Une saisie d’indice doit être contrôlée avant tout accès.',
    principal: '#include <iostream>\n#include <vector>\n#include <stdexcept>\nint main() {\n  const std::vector<int> notes{8, 12, 16};\n  try {\n    std::cout << notes.at(1) << "\\n";\n    std::cout << notes.at(9) << "\\n";\n  } catch (const std::out_of_range&) {\n    std::cout << "Indice absent\\n";\n  }\n}',
    variante: 'for (int note : notes) std::cout << note << " "; // 8 12 16',
    lecture: 'La taille est connue par notes.size(). at(1) renvoie le deuxième élément, car l’indice commence à zéro. La boucle for-each est préférable quand on veut lire chaque valeur sans gérer les indices.',
    attendu: '12 puis Indice absent ; la variante affiche 8 12 16.', panne: 'notes[9] a un comportement indéfini : ne l’utilisez pas pour démontrer une erreur contrôlée.',
    exercice: 'Avant at, refusez un indice négatif saisi en int ; expliquez aussi le cas d’un vecteur vide.', correction: 'Contrôlez `indice < 0` puis comparez sa conversion en size_t à notes.size() avant l’accès. Un vecteur vide n’a aucun indice valide.',
    source: 'https://learn.microsoft.com/en-us/cpp/standard-library/vector-class'
  },
  {
    domaine: 'cpp', slug: 'unique-ptr-propriete', titre: 'Transférer la propriété avec unique_ptr', niveau: 6, langage: 'C++', fichier: 'main.cpp', commande: 'Linux : g++ -std=c++20 -Wall -Wextra main.cpp -o atelier && ./atelier ; macOS : clang++ -std=c++20 -Wall -Wextra main.cpp -o atelier && ./atelier ; Windows : cl /EHsc /std:c++20 main.cpp puis .\\main.exe',
    contrat: 'std::unique_ptr possède seul un objet alloué dynamiquement et le libère quand son propriétaire disparaît. On le déplace avec std::move ; on ne le copie pas. N’allouez pas dynamiquement si une valeur locale suffit.',
    principal: '#include <iostream>\n#include <memory>\n#include <utility>\nstruct Livre { int pages; };\nint main() {\n  auto premier = std::make_unique<Livre>(Livre{120});\n  auto second = std::move(premier);\n  std::cout << second->pages << " " << (premier == nullptr) << "\\n";\n}',
    variante: 'Livre local{120};\nstd::cout << local.pages << "\\n"; // Aucun pointeur nécessaire',
    lecture: 'make_unique crée l’objet et son propriétaire. Après move, second le possède et premier est vide. Le destructeur de second libère l’objet. Le code ne doit pas déréférencer premier après le déplacement.',
    attendu: '120 1 ; la variante affiche 120.', panne: 'Tenter `auto second = premier` échoue à compiler, car unique_ptr n’est pas copiable.',
    exercice: 'Passez le propriétaire à une fonction prenant std::unique_ptr<Livre> et prédisez l’état du pointeur initial.', correction: 'Appelez `consommer(std::move(premier))`. Après le déplacement, premier ne possède plus l’objet ; la fonction le libère à la fin de sa portée.',
    source: 'https://learn.microsoft.com/en-us/cpp/cpp/how-to-create-and-use-unique-ptr-instances'
  },
  {
    domaine: 'csharp', slug: 'nullable-frontiere', titre: 'Vérifier une référence nullable avant usage', niveau: 4, langage: 'C#', fichier: 'Program.cs', commande: 'Dans un projet console créé par dotnet new console : dotnet run',
    contrat: 'Avec Nullable activé dans le projet, string? annonce une absence possible. Le compilateur suit les contrôles de null, mais une annotation ne valide pas la longueur ni le format d’une donnée reçue.',
    principal: 'string? nom = args.Length > 0 ? args[0] : null;\nif (string.IsNullOrWhiteSpace(nom))\n{\n    Console.WriteLine("Nom requis");\n    return;\n}\nConsole.WriteLine(nom.Trim().ToUpperInvariant());',
    variante: 'string? absent = null;\nConsole.WriteLine(absent?.Length ?? 0); // 0',
    lecture: 'Le garde traite null, vide et espaces avant Trim. `?.` saute un accès si la valeur est nulle et `??` choisit un repli. Activez `<Nullable>enable</Nullable>` dans le .csproj pour recevoir les avertissements utiles.',
    attendu: 'Sans argument : Nom requis ; avec Awa : AWA. La variante affiche 0.', panne: 'L’opérateur ! supprime un avertissement sans rendre une donnée non nulle à l’exécution.',
    exercice: 'Limitez le nom à 80 caractères après Trim ; prévoyez le message si la limite est dépassée.', correction: 'Après le garde, stockez `var propre = nom.Trim();` puis testez `propre.Length > 80` avant ToUpperInvariant. Le message doit expliquer la limite au lieu de tronquer.',
    source: 'https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/null-safety/nullable-reference-types'
  },
  {
    domaine: 'csharp', slug: 'annulation-task', titre: 'Annuler proprement une opération asynchrone', niveau: 6, langage: 'C#', fichier: 'Program.cs', commande: 'Dans un projet console créé par dotnet new console : dotnet run',
    contrat: 'CancellationToken porte une demande d’annulation entre l’appelant et l’opération. Il ne tue pas un thread ; l’opération doit observer ce signal et arrêter le travail au bon endroit.',
    principal: 'using var source = new CancellationTokenSource();\nsource.CancelAfter(TimeSpan.FromMilliseconds(50));\ntry\n{\n    await Task.Delay(TimeSpan.FromSeconds(2), source.Token);\n    Console.WriteLine("Terminé");\n}\ncatch (OperationCanceledException) when (source.IsCancellationRequested)\n{\n    Console.WriteLine("Annulé");\n}',
    variante: 'using var source = new CancellationTokenSource();\nawait Task.Delay(TimeSpan.FromMilliseconds(10), source.Token);\nConsole.WriteLine("Terminé");',
    lecture: 'CancelAfter programme la demande. Task.Delay reçoit le token et lève OperationCanceledException lorsqu’il est annulé. Le filtre when évite de classer toute autre erreur comme annulation voulue.',
    attendu: 'Le premier programme affiche Annulé ; la variante affiche Terminé.', panne: 'Oublier de transmettre source.Token à Task.Delay signifie que ce délai ne répond pas à la demande d’annulation.',
    exercice: 'Déplacez le délai à 10 ms et l’annulation à 2 s ; prédisez la branche exécutée.', correction: 'Le délai finit avant l’annulation et la branche Terminé s’exécute. Un test réel doit éviter de dépendre d’un timing trop serré.',
    source: 'https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads'
  },
  {
    domaine: 'php', slug: 'password-hash', titre: 'Stocker et vérifier un mot de passe sans le conserver en clair', niveau: 5, langage: 'PHP', fichier: 'index.php', commande: 'php index.php',
    contrat: 'password_hash produit un hachage adapté au stockage ; password_verify compare un mot de passe saisi au hachage. On ne déchiffre pas un hachage et on ne compare pas les mots de passe en clair en base.',
    principal: '<?php\n$motDePasse = "une-phrase-longue-a-remplacer";\n$hachage = password_hash($motDePasse, PASSWORD_DEFAULT);\nvar_export(password_verify($motDePasse, $hachage));\necho "\\n";',
    variante: 'var_export(password_verify("faux", $hachage));\necho "\\n"; // false',
    lecture: 'Le hachage change à chaque création grâce au sel géré par l’API. Conservez le hachage, jamais la variable en clair au-delà du traitement nécessaire. PASSWORD_DEFAULT peut évoluer : prévoyez une taille de colonne suffisante et password_needs_rehash lors d’une authentification.',
    attendu: 'true puis false ; les hachages produits ne doivent pas être identiques entre deux exécutions.', panne: 'Un SHA-256 direct et rapide n’est pas une stratégie adaptée au stockage de mots de passe.',
    exercice: 'Expliquez pourquoi deux hachages du même mot de passe peuvent différer tout en étant vérifiables.', correction: 'Un sel aléatoire est intégré dans le hachage. password_verify lit les paramètres nécessaires depuis ce hachage et refait la vérification.',
    source: 'https://www.php.net/manual/en/function.password-hash.php'
  },
  {
    domaine: 'php', slug: 'pdo-transaction', titre: 'Garantir deux écritures avec une transaction PDO', niveau: 6, langage: 'PHP', fichier: 'index.php', commande: 'Vérifiez pdo_sqlite avec php -m puis lancez php index.php',
    contrat: 'Une transaction regroupe plusieurs écritures : commit les valide ensemble ; rollBack les annule ensemble. Chaque valeur externe passe par un paramètre SQL, même à l’intérieur de la transaction.',
    principal: '<?php\n$pdo = new PDO("sqlite::memory:");\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n$pdo->exec("CREATE TABLE livres (id INTEGER PRIMARY KEY, titre TEXT NOT NULL)");\ntry {\n    $pdo->beginTransaction();\n    $requete = $pdo->prepare("INSERT INTO livres (titre) VALUES (:titre)");\n    $requete->execute(["titre" => "Web"]);\n    $requete->execute(["titre" => "API"]);\n    $pdo->commit();\n} catch (Throwable $erreur) {\n    if ($pdo->inTransaction()) $pdo->rollBack();\n    throw $erreur;\n}\necho $pdo->query("SELECT COUNT(*) FROM livres")->fetchColumn();',
    variante: '$pdo->beginTransaction();\n$pdo->exec("INSERT INTO livres (titre) VALUES (\'Essai\')");\n$pdo->rollBack();\n// La ligne Essai n’existe plus.',
    lecture: 'beginTransaction ouvre l’unité de travail ; execute lie les valeurs ; commit valide. En cas d’exception, rollBack revient à l’état antérieur. L’exemple en mémoire recommence à zéro à chaque exécution.',
    attendu: '2 lignes après commit ; la variante n’ajoute aucune ligne durable.', panne: 'Oublier rollBack après une écriture partielle peut laisser le contrat métier dans un état incohérent selon la suite de la requête.',
    exercice: 'Provoquez une violation NOT NULL sur la seconde insertion et vérifiez que la première insertion de la transaction disparaît.', correction: 'Passez `null` comme second titre, laissez l’exception déclencher rollBack, puis interrogez COUNT(*) après le catch dans un essai isolé : la transaction ne laisse aucune nouvelle ligne.',
    source: 'https://www.php.net/manual/en/pdo.transactions.php'
  },
  {
    domaine: 'springboot', slug: 'pagination-borne', titre: 'Borner une pagination avant de consulter les données', niveau: 5, langage: 'Java / Spring', fichier: 'src/main/java/com/example/demo/PageController.java', commande: 'Dans un projet Spring Boot avec Spring Web : ./mvnw spring-boot:run (Windows : .\\mvnw.cmd spring-boot:run), puis curl "http://localhost:8080/page?taille=20"',
    contrat: 'Un paramètre de pagination vient du client. Avant de charger des données, contrôlez ses bornes et appliquez un maximum documenté. Ce petit contrôleur démontre le contrat de taille ; il ne remplace pas une vraie requête paginée en base.',
    principal: 'package com.example.demo;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.RequestParam;\nimport org.springframework.web.bind.annotation.RestController;\nimport org.springframework.web.server.ResponseStatusException;\nimport org.springframework.http.HttpStatus;\n@RestController\nclass PageController {\n  @GetMapping("/page")\n  int page(@RequestParam(defaultValue = "20") int taille) {\n    if (taille < 1 || taille > 100)\n      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "taille entre 1 et 100");\n    return taille;\n  }\n}',
    variante: 'curl -i "http://localhost:8080/page?taille=1000"\n# Attendu : HTTP 400',
    lecture: 'Spring convertit la valeur de taille en int. La méthode rejette les valeurs hors bornes avec 400. Une valeur non numérique échoue déjà à la conversion ; le client doit voir une erreur cohérente.',
    attendu: 'La valeur 20 est retournée ; 1000 donne 400.', panne: 'Lire `taille=1000000` sans plafond peut conduire à charger trop de données et de mémoire.',
    exercice: 'Ajoutez un paramètre page entier de défaut 0 et refusez une valeur négative.', correction: 'Déclarez `@RequestParam(defaultValue = "0") int page`, puis le test `if (page < 0)` renvoie 400. Conservez la limite sur taille.',
    source: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestparam.html'
  },
  {
    domaine: 'springboot', slug: 'service-test-isole', titre: 'Tester une règle métier sans démarrer le serveur', niveau: 5, langage: 'Java / JUnit', fichier: 'src/test/java/com/example/demo/PrixServiceTest.java', commande: 'Dans un projet Spring Boot avec spring-boot-starter-test : ./mvnw test (Windows : .\\mvnw.cmd test)',
    contrat: 'Une règle sans dépendance HTTP se teste comme une classe Java ordinaire. Le test vérifie une sortie et une limite ; il n’a besoin ni de @SpringBootTest ni d’une base de données.',
    principal: 'package com.example.demo;\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\nclass PrixServiceTest {\n  @Test void calculeUnTotal() {\n    assertEquals(15, new PrixService().total(5, 3));\n  }\n  @Test void refuseUneQuantiteNegative() {\n    assertThrows(IllegalArgumentException.class,\n      () -> new PrixService().total(5, -1));\n  }\n}',
    variante: 'package com.example.demo;\nclass PrixService {\n  int total(int prix, int quantite) {\n    if (prix < 0 || quantite < 0) throw new IllegalArgumentException();\n    return Math.multiplyExact(prix, quantite);\n  }\n}',
    lecture: 'Placez la variante dans src/main/java/com/example/demo/PrixService.java et le test dans le chemin annoncé. assertThrows confirme le refus du cas invalide. Math.multiplyExact rend aussi un dépassement entier visible.',
    attendu: 'Deux tests passent ; une quantité négative lève IllegalArgumentException.', panne: 'Un test qui imprime seulement 15 sans assertion ne signale pas une régression.',
    exercice: 'Ajoutez un test du dépassement avec Integer.MAX_VALUE et 2. Exécutez-le, puis expliquez pourquoi ce cas ne doit pas retourner silencieusement un entier négatif.', correction: 'Utilisez `assertThrows(ArithmeticException.class, () -> new PrixService().total(Integer.MAX_VALUE, 2));`. Le test vérifie que le dépassement n’est pas silencieux.',
    source: 'https://docs.junit.org/current/user-guide/'
  }
];

function lecon(s) {
  const sections = [
    { type: 'texte', titre: 'Le contrat et la raison', contenu: s.contrat },
    { type: 'code', titre: `Fichier complet : ${s.fichier}`, langage: s.langage, contenu: s.principal, legende: s.commande },
    { type: 'texte', titre: 'Lire chaque décision', contenu: s.lecture },
    { type: 'code', titre: 'Variation à essayer', langage: s.langage, contenu: s.variante, legende: 'Ajoutez ce fragment si ses noms existent déjà ; sinon remplacez le bloc principal par cette variante. Les commandes HTTP se lancent dans un second terminal.' },
    { type: 'texte', titre: 'Exécuter et observer', contenu: `${s.commande}. Résultat attendu : ${s.attendu}` },
    { type: 'alerte', variante: 'attention', titre: 'Erreur à provoquer', contenu: s.panne },
    { type: 'exercice', titre: 'Transférer la notion', contenu: s.exercice, indice: s.contrat },
    { type: 'solution', titre: 'Corrigé raisonné', contenu: s.correction },
    { type: 'liens', titre: 'Documentation officielle', elements: [{ label: 'Lire la référence officielle', url: s.source }] }
  ];
  return { id: `${s.domaine}-${s.slug}`, domaine: s.domaine, categorie: s.niveau >= 6 ? 'Approfondissement' : 'Données et qualité', titre: s.titre, resume: s.contrat, niveau: 'Intermédiaire → confirmé', niveauPedagogique: s.niveau, tempsEstime: 45, sections, associes: [],
    sessions: [
      { id: 'contrat', titre: 'Définir le contrat', duree: '5 min', activite: 'Reformulez le résultat et la limite.', sections: [0] },
      { id: 'code', titre: 'Lire et exécuter', duree: '15 min', activite: 'Créez le fichier puis lancez la commande.', sections: [1, 2] },
      { id: 'variation', titre: 'Faire varier', duree: '10 min', activite: 'Prédisez la sortie avant le second essai.', sections: [3, 4] },
      { id: 'pratique', titre: 'Transférer', duree: '10 min', activite: 'Résolvez le nouveau cas sans regarder la solution.', sections: [5, 6] },
      { id: 'corrige', titre: 'Vérifier', duree: '5 min', activite: 'Comparez le comportement et le diagnostic.', sections: [7] }
    ], maturiteEditoriale: 'enriched', provenance: 'redaction-specifique' };
}

function reference(s) {
  return { id: `profondeur-${s.domaine}-${s.slug}`, terme: s.titre, categorie: s.domaine, famille: s.domaine,
    niveau: 'Intermédiaire → confirmé', aliases: [], associes: [], definition: s.contrat, resume: s.contrat,
    signature: s.fichier, langageSignature: s.langage, retour: s.attendu, article: [s.lecture],
    exemples: [{ titre: 'Programme principal', langage: s.langage, contenu: s.principal, explication: s.lecture }, { titre: 'Variation', langage: s.langage, contenu: s.variante, explication: s.attendu }],
    pourquoiUtiliser: [s.contrat], nePasUtiliser: [s.panne], avertissements: [s.panne],
    exercice: { objectif: s.exercice, contexte: s.commande, etapes: [s.exercice], validation: [s.correction] },
    sources: [{ label: 'Documentation officielle', url: s.source }], maturiteEditoriale: 'enriched', provenance: 'redaction-specifique', source: { id: `${s.domaine}-${s.slug}`, fiche: s.titre } };
}

module.exports = { lecons: sujets.map(lecon), references: sujets.map(reference), creerLecon: lecon, creerReference: reference };
