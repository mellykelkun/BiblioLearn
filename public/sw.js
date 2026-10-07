'use strict';

const VERSION = 'bibliolearn-v6';
const SHELL = ['/', '/index.html', '/styles.css', '/app.js', '/documentation.json', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/icon-maskable.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('bibliolearn-') && key !== VERSION).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copie = response.clone();
        caches.open(VERSION).then((cache) => cache.put('/index.html', copie));
      }
      return response;
    }).catch(async () => (await caches.match('/index.html')) || Response.error()));
    return;
  }

  if (url.pathname === '/api/documentation' || url.pathname === '/documentation.json') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copie = response.clone();
        caches.open(VERSION).then((cache) => cache.put(request, copie));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('/documentation.json')) || new Response('Catalogue indisponible hors ligne', { status: 503 })));
    return;
  }

  if (SHELL.includes(url.pathname)) {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copie = response.clone();
        caches.open(VERSION).then((cache) => cache.put(request, copie));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || Response.error()));
  }
});
