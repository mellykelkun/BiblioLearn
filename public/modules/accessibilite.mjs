export function gererMenu({ sidebar, overlay, ouvrirMenu, fermerMenu }) {
  const mobile = matchMedia('(max-width: 940px)');
  const workspace = document.querySelector('.workspace');
  const synchroniser = () => { sidebar.inert = mobile.matches && !sidebar.classList.contains('is-open'); };
  function ouvrir() {
    sidebar.classList.add('is-open'); overlay.hidden = false; sidebar.inert = false;
    ouvrirMenu.setAttribute('aria-expanded', 'true');
    if (mobile.matches) { workspace.inert = true; document.body.style.overflow = 'hidden'; fermerMenu.focus(); }
  }
  function fermer(retour = true) {
    const etaitOuvert = sidebar.classList.contains('is-open');
    sidebar.classList.remove('is-open'); overlay.hidden = true; workspace.inert = false;
    document.body.style.overflow = ''; ouvrirMenu.setAttribute('aria-expanded', 'false');
    synchroniser(); if (retour && etaitOuvert && mobile.matches) ouvrirMenu.focus();
  }
  sidebar.addEventListener('keydown', event => {
    if (!mobile.matches || !sidebar.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); fermer(); }
    if (event.key === 'Tab') {
      const focusables = [...sidebar.querySelectorAll('button, a, input, summary')].filter(el => !el.disabled && el.getClientRects().length);
      const premier = focusables[0], dernier = focusables.at(-1);
      if (event.shiftKey && document.activeElement === premier) { event.preventDefault(); dernier.focus(); }
      else if (!event.shiftKey && document.activeElement === dernier) { event.preventDefault(); premier.focus(); }
    }
  });
  mobile.addEventListener('change', () => fermer(false)); synchroniser();
  return { ouvrir, fermer };
}

export function focaliserRoute(contenu) {
  const titre = contenu.querySelector('h1');
  if (titre) { titre.tabIndex = -1; titre.focus({ preventScroll: true }); document.title = `${titre.textContent} — Bibliolearn`; }
  else contenu.focus({ preventScroll: true });
  contenu.querySelectorAll('pre').forEach(el => { el.tabIndex = 0; el.setAttribute('aria-label', 'Code, défilement horizontal possible'); });
  contenu.querySelectorAll('.filter-chip').forEach(el => el.setAttribute('aria-pressed', String(el.classList.contains('is-active'))));
}
