import { creerRecherche } from './recherche.mjs';

export class Catalogue {
  constructor(lire = fetch) { this.lire = lire; this.promesses = new Map(); this.details = new Map(); }
  async json(url) {
    if (!this.promesses.has(url)) {
      this.promesses.set(url, this.lire(url).then(async r => {
        if (!r.ok) throw new Error('Ce contenu n’est pas disponible. Vérifiez votre connexion puis réessayez.');
        return r.json();
      }).catch(e => { this.promesses.delete(url); throw e; }));
    }
    return this.promesses.get(url);
  }
  async initialiser() {
    this.meta = await this.json('/catalogue/meta.json');
    this.documentation = { ...this.meta, ateliers: [], bibliotheque: [], erreurs: [], projets: [] };
    return this.documentation;
  }
  async indexer() {
    if (!this.index) {
      const data = await this.json(`${this.meta.base}/index-recherche.json`);
      this.index = data;
      this.chercher = creerRecherche(data);
      this.documentation.ateliers = data.filter(e => e.type === 'atelier');
      this.documentation.bibliotheque = data.filter(e => e.type === 'reference');
      this.documentation.erreurs = data.filter(e => e.type === 'erreur');
      this.documentation.projets = data.filter(e => e.type === 'projet');
    }
    return this.index;
  }
  async charger(type, id) {
    const cle = `${type}/${id}`;
    if (this.details.has(cle)) return this.details.get(cle);
    const liste = type === 'fiche' ? this.meta.fiches : await this.indexer();
    const resume = liste.find(e => e.id === id && (type === 'fiche' || e.type === type));
    if (!resume) return null;
    const fichier = await this.json(`${this.meta.base}/${resume.fichier}`);
    const element = Array.isArray(fichier) ? fichier.find(e => e.id === id) : fichier;
    if (!element || element.id !== id) throw new Error('Le contenu a changé. Rechargez la page pour continuer.');
    this.details.set(cle, element);
    const collection = { fiche: 'fiches', atelier: 'ateliers', reference: 'bibliotheque', erreur: 'erreurs', projet: 'projets' }[type];
    const position = this.documentation[collection].findIndex(e => e.id === id);
    if (position >= 0) this.documentation[collection][position] = element;
    return element;
  }
  async environnements() {
    this.documentation.environnements ||= await this.json(`${this.meta.base}/environnements.json`);
  }
}
