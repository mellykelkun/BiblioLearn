'use strict';

const fs = require('node:fs');
const path = require('node:path');
const catalogue = require('../src/data');

const destination = path.join(__dirname, '..', 'public', 'documentation.json');
fs.writeFileSync(destination, JSON.stringify(catalogue));
console.log(`Catalogue statique synchronisé : ${catalogue.statistiques.nombreFiches} leçons et ${catalogue.statistiques.nombreAteliers} ateliers.`);
