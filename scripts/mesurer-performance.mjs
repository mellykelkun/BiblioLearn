import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { performance } from 'node:perf_hooks';
import { creerRecherche, normaliser } from '../public/modules/recherche.mjs';
const avant = execFileSync('git', ['show', '3a6731e:public/documentation.json'], { maxBuffer: 20000000 });
const metaTexte = fs.readFileSync('public/catalogue/meta.json');
const meta = JSON.parse(metaTexte);
const indexTexte = fs.readFileSync(`public${meta.base}/index-recherche.json`);
const ancien = JSON.parse(avant), index = JSON.parse(indexTexte);
const temps = fn => { const t = performance.now(); fn(); return +(performance.now() - t).toFixed(2); };
const requetes = ['map', 'class', 'route', 'server', 'token', 'index', 'process', 'div', 'erreur', 'fichier'];
let chercher;
const rapport = {
  contexte: 'Mesure locale Node, 10 recherches ; octets bruts et gzip calculés, pas mesure réseau en production.',
  accueil: { avant: avant.length, apres: metaTexte.length, reductionPourcent: +(100 * (1 - metaTexte.length / avant.length)).toFixed(2), gzipApres: gzipSync(metaTexte).length },
  indexRecherche: { octets: indexTexte.length, gzip: gzipSync(indexTexte).length },
  preparationIndexMs: temps(() => { chercher = creerRecherche(index); }),
  dixRecherchesAncienneSerialisationMs: temps(() => { for (const q of requetes) ancien.bibliotheque.filter(e => normaliser(JSON.stringify(e)).includes(q)); }),
  dixRecherchesIndexeesMs: temps(() => { for (const q of requetes) chercher(q); }),
  catalogueCompletOptionnel: fs.statSync('public/documentation.json').size
};
fs.writeFileSync('docs/mesures-performance.json', JSON.stringify(rapport, null, 2) + '\n'); console.log(rapport);
