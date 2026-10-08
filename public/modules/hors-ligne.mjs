export async function telechargerBibliotheque(catalogue, bouton) {
  const statut = document.querySelector('#telechargement-statut');
  if (!('caches' in window) || !('serviceWorker' in navigator)) { statut.textContent = 'Ce navigateur ne permet pas de conserver la bibliothèque hors ligne.'; return; }
  bouton.disabled = true;
  try {
    await navigator.serviceWorker.ready;
    const cache = await caches.open('bibliolearn-contenus-v1');
    const liste = await catalogue.json(`${catalogue.meta.base}/hors-ligne.json`);
    let curseur = 0, termines = 0;
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (curseur < liste.length) {
        const chemin = `${catalogue.meta.base}/${liste[curseur++]}`;
        // Le téléchargement manuel écrit la clé canonique lui-même. Cette
        // requête est ignorée par le SW pour éviter deux écritures concurrentes.
        const reponse = await fetch(`${chemin}?telecharger=1`);
        if (!reponse.ok) throw new Error('Connexion interrompue');
        await cache.put(chemin, reponse);
        statut.textContent = `${++termines} fichiers conservés sur ${liste.length}…`;
      }
    }));
    await cache.put('/catalogue/meta.json', new Response(JSON.stringify(catalogue.meta), { headers: { 'Content-Type': 'application/json' } }));
    const conserves = new Set((await cache.keys()).map(requete => new URL(requete.url).pathname));
    if (!conserves.has('/catalogue/meta.json') || liste.some(fichier => !conserves.has(`${catalogue.meta.base}/${fichier}`))) {
      throw new Error('Fichiers absents après écriture dans le cache');
    }
    if (!navigator.serviceWorker.controller) {
      await new Promise((resoudre, rejeter) => {
        const verifier = () => {
          if (!navigator.serviceWorker.controller) return;
          clearTimeout(minuterie);
          navigator.serviceWorker.removeEventListener('controllerchange', verifier);
          resoudre();
        };
        const minuterie = setTimeout(() => {
          navigator.serviceWorker.removeEventListener('controllerchange', verifier);
          rejeter(new Error('Service worker non actif sur cette page'));
        }, 5000);
        navigator.serviceWorker.addEventListener('controllerchange', verifier);
        verifier();
      });
    }
    statut.textContent = 'Bibliothèque téléchargée. Vous pouvez continuer à lire sans connexion sur cet appareil.';
  } catch (erreur) {
    console.error('Téléchargement hors ligne impossible', erreur);
    statut.textContent = 'Téléchargement incomplet : connexion ou espace de stockage insuffisant. Les fichiers déjà conservés restent disponibles. Vous pouvez réessayer.';
  } finally { bouton.disabled = false; }
}
