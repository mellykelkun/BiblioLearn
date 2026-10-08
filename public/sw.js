'use strict';
const VERSION = 'bibliolearn-shell-v12';
const CONTENUS = 'bibliolearn-contenus-v1';
const SHELL = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png',
  '/modules/catalogue.mjs', '/modules/recherche.mjs', '/modules/progression.mjs', '/modules/texte.mjs',
  '/modules/contenu.mjs', '/modules/entrainement.mjs', '/modules/accessibilite.mjs', '/modules/routeur.mjs',
  '/modules/vues-apprentissage.mjs', '/modules/vues-catalogue.mjs', '/modules/hors-ligne.mjs'];
self.addEventListener('install', event => {
  event.waitUntil(Promise.all([caches.open(VERSION).then(cache => cache.addAll(SHELL)), caches.open(CONTENUS).then(cache => cache.add('/catalogue/meta.json'))]).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('bibliolearn-') && ![VERSION, CONTENUS].includes(key)).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const requete = event.request, url = new URL(requete.url);
  if (requete.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.searchParams.has('telecharger')) return;
  const donnee = url.pathname.startsWith('/catalogue/');
  const navigation = requete.mode === 'navigate';
  if (!donnee && !navigation && !SHELL.includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(donnee ? CONTENUS : VERSION);
    const cle = navigation ? '/index.html' : requete;
    // Les fragments immuables sont servis du cache. Le manifeste et le shell se revalident.
    if (donnee && url.pathname !== '/catalogue/meta.json') {
      const deja = await cache.match(cle); if (deja) return deja;
    }
    try {
      const reponse = await fetch(requete);
      if (!reponse.ok) throw new Error('HTTP ' + reponse.status);
      if (donnee && !(reponse.headers.get('content-type') || '').includes('json')) throw new Error('Fragment invalide');
      const copie = reponse.clone();
      event.waitUntil(cache.put(cle, copie).catch(() => {}));
      return reponse;
    } catch {
      const conservee = await cache.match(cle);
      if (conservee) return conservee;
      // Conserver une leçon visitée avant une mise à jour du catalogue.
      const fragment = url.pathname.match(/^\/catalogue\/[a-f0-9]{16}\/(.+)$/)?.[1];
      if (donnee && fragment && fragment !== 'index-recherche.json') {
        const precedentes = (await cache.keys()).filter(r => new URL(r.url).pathname.endsWith('/' + fragment));
        if (precedentes.length) return cache.match(precedentes.at(-1));
      }
      return new Response(JSON.stringify({ erreur: 'Contenu non conservé sur cet appareil' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }
  })());
});
