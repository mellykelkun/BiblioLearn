import { echapperHTML as e } from './texte.mjs';

export function creerRouteur({ catalogue, contenu, rendre, terminer }) {
  let navigation = 0;
  return async function router() {
    const ticket = ++navigation;
    const [route = 'accueil', id] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    contenu.setAttribute('aria-busy', 'true');
    contenu.innerHTML = '<p role="status">Ouverture…</p>';
    try {
      const type = { fiche: 'fiche', terme: 'reference', atelier: 'atelier', erreur: 'erreur', projet: 'projet' }[route];
      if (type && id) await catalogue.charger(type, id);
      if (['bibliotheque', 'ateliers', 'erreurs', 'projets'].includes(route)) await catalogue.indexer();
      if (['installation', 'atelier', 'domaine'].includes(route) || (route === 'fiche' && !id?.startsWith('zero-'))) await catalogue.environnements();
      if (ticket !== navigation) return;
      rendre(route, id);
    } catch (erreur) {
      if (ticket !== navigation) return;
      contenu.innerHTML = `<section class="empty-page"><h1>Ce contenu n’a pas pu être ouvert</h1><p>${e(erreur.message)}</p><p>Hors ligne, seules les leçons déjà consultées ou téléchargées sont disponibles.</p><button class="primary-button" data-action="reessayer">Réessayer</button><button class="secondary-button" data-route="accueil">Revenir à l’accueil</button></section>`;
    }
    if (ticket !== navigation) return;
    contenu.setAttribute('aria-busy', 'false'); terminer();
  };
}
