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
        const reponse = await fetch(chemin);
        if (!reponse.ok) throw new Error('Connexion interrompue');
        await cache.put(chemin, reponse);
        statut.textContent = `${++termines} fichiers conservés sur ${liste.length}…`;
      }
    }));
    await cache.put('/catalogue/meta.json', new Response(JSON.stringify(catalogue.meta), { headers: { 'Content-Type': 'application/json' } }));
    statut.textContent = 'Bibliothèque téléchargée. Vous pouvez continuer à lire sans connexion sur cet appareil.';
  } catch {
    statut.textContent = 'Téléchargement incomplet : connexion ou espace de stockage insuffisant. Les fichiers déjà conservés restent disponibles. Vous pouvez réessayer.';
  } finally { bouton.disabled = false; }
}
