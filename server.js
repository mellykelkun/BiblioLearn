 'use strict';

const path = require('node:path');
const express = require('express');
const documentation = require('./src/data');

const app = express();
const port = Number(process.env.PORT) || 3000;
const dossierPublic = path.join(__dirname, 'public');

app.disable('x-powered-by');

app.use((requete, reponse, suivant) => {
  reponse.setHeader('X-Content-Type-Options', 'nosniff');
  reponse.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  suivant();
});

app.use(express.static(dossierPublic, {
  extensions: ['html'],
  // Le contenu change pendant les itérations de la documentation ;
  // on laisse Vercel revalider les fichiers à chaque nouvelle version.
  maxAge: 0
}));

app.get('/api/sante', (requete, reponse) => {
  reponse.json({ statut: 'ok', fiches: documentation.statistiques.nombreFiches });
});

app.get('/api/documentation', (request, response) => {
  response.json(documentation);
});

app.get('*', (request, response) => {
  response.sendFile(path.join(dossierPublic, 'index.html'));
});

const serveur = app.listen(port, () => {
  console.log(`\n  Bibliolearn est prêt sur http://localhost:${port}\n`);
});

function arreterProprement() {
  serveur.close(() => process.exit(0));
}

process.on('SIGINT', arreterProprement);
process.on('SIGTERM', arreterProprement);
