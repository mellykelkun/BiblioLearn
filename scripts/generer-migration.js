'use strict';
// Export de données uniquement : ne réécrit pas la migration historique appliquée.
const fs = require('node:fs');
const path = require('node:path');
const { empreinte: calculerEmpreinte } = require('../src/catalogue-distant');
const catalogue = require('../src/data');
const empreinte = calculerEmpreinte(catalogue);
const json = valeur => "'" + JSON.stringify(valeur).replaceAll("'", "''") + "'::jsonb";
const sql = `-- Export déterministe Bibliolearn v${catalogue.meta.version} (${empreinte}).
-- Prérequis : table bibliolearn_catalogue_meta de la migration historique.
-- Les tables, politiques et anciennes données ne sont ni supprimées ni remplacées.
begin;
insert into public.bibliolearn_catalogue_meta (key, value)
values ('catalogue-v${catalogue.meta.version}', ${json({ empreinte, catalogue })})
on conflict (key) do update set value = excluded.value;
commit;
`;
const destination = path.join(__dirname, '..', 'supabase', 'exports', `catalogue-v${catalogue.meta.version}.sql`);
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, sql);
console.log(`Export optionnel généré : ${destination}`);
module.exports = { sql, empreinte };
