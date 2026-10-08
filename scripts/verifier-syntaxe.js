'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
function verifier(dossier) {
  for (const nom of fs.readdirSync(dossier)) {
    const cible = path.join(dossier, nom);
    if (fs.statSync(cible).isDirectory()) verifier(cible);
    else if (/\.(m?js)$/.test(nom)) execFileSync(process.execPath, ['--check', cible]);
  }
}
for (const dossier of ['src', 'public/modules', 'scripts']) verifier(dossier);
for (const cible of ['server.js', 'public/app.js', 'public/sw.js']) execFileSync(process.execPath, ['--check', cible]);
console.log('Syntaxe du serveur, des sources et des modules ES vérifiée.');
