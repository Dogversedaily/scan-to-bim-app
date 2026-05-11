const CACHE_NAME = 'scan2bim-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js'
];

// Installation : on met en cache l'interface
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  // On ne met pas en cache les requêtes vers l'API Google (qui gère déjà son propre localStorage)
  if (event.request.url.includes('script.google.com')) {
    return; 
  }
  
  // Pour le reste (l'HTML, le design), on sert le cache si on est hors-ligne
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Retourne le fichier en cache
        }
        return fetch(event.request); // Sinon cherche sur internet
      })
  );
});