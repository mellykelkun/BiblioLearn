import { echapperHTML as e } from './texte.mjs';
import { LIBELLES } from './progression.mjs';

export function statut(progression, id) {
  return `<span class="progression-statut" data-statut="${e(id)}">${e(LIBELLES[progression.etat(id)] || 'À commencer')}</span>`;
}

export function entrainement(fiche, progression) {
  const n = progression.notion(fiche.id);
  const exercice = fiche.sections.find(s => s.type === 'exercice');
  if (!exercice) return '';
  return `<section class="pratique-personnelle" id="pratique" aria-labelledby="titre-pratique">
    <span class="eyebrow">Rappel actif</span><h2 id="titre-pratique">Essayer, expliquer, puis vérifier</h2>
    <p>${e(exercice.contenu)}</p>
    <form data-pratique="${e(fiche.id)}"><label for="reponse-pratique">Votre réponse, votre code ou le résultat de votre essai</label>
    <textarea id="reponse-pratique" name="reponse" rows="5" maxlength="16000" required placeholder="Expliquez votre démarche avant de lire le corrigé.">${e(n.reponse || '')}</textarea>
    <p class="aide">Cette trace reste sur cet appareil. Elle atteste une pratique, pas la justesse de la réponse.</p>
    <button class="primary-button" type="submit">Enregistrer mon essai</button><p class="feedback" data-retour-pratique role="status"></p></form>
    ${fiche.evaluation ? questionnaire(fiche, progression) : '<p>Cette leçon ne dispose pas encore d’évaluation. Votre essai peut être conservé, mais ne devient pas une compétence vérifiée.</p>'}
    <p class="aide">La vérification porte sur les questions proposées. La maîtrise demande trois réussites espacées après une pratique, avec au moins quatre jours entre la première et la dernière.</p>
    ${n.prochaineRevision ? `<p>Prochain rappel : <time datetime="${new Date(n.prochaineRevision).toISOString()}">${new Date(n.prochaineRevision).toLocaleDateString('fr-FR')}</time>.</p>` : ''}
  </section>`;
}

function questionnaire(fiche, progression) {
  const questions = fiche.evaluation.questions;
  const pratique = progression.auMoins(fiche.id, 'pratique');
  return `<div class="evaluation"><h3>Vérifier sans regarder la leçon</h3><p>${pratique ? 'Répondez de mémoire, puis comparez les explications.' : 'Enregistrez d’abord votre essai pour pouvoir valider ce questionnaire.'}</p>
    <form data-evaluation="${e(fiche.id)}">${questions.map((q, i) => `<fieldset><legend>${i + 1}. ${e(q.question)}</legend>${q.choix.map((choix, j) => `<label class="choix-reponse"><input type="radio" name="${e(q.id)}" value="${j}" required> <span>${e(choix)}</span></label>`).join('')}</fieldset>`).join('')}
      <button class="primary-button" type="submit">Vérifier mes réponses</button><div class="feedback" data-retour-evaluation role="status"></div>
    </form></div>`;
}

export function connecterEntrainement({ progression, obtenirFiche, compteur }) {
  const actualiser = id => {
    document.querySelectorAll('[data-statut]').forEach(el => { if (el.dataset.statut === id) el.textContent = LIBELLES[progression.etat(id)]; });
    compteur();
  };
  document.addEventListener('submit', event => {
    const form = event.target;
    if (form.dataset.pratique) {
      event.preventDefault();
      if (progression.pratiquer(form.dataset.pratique, new FormData(form).get('reponse'))) {
        form.querySelector('[data-retour-pratique]').textContent = 'Essai enregistré. Comparez votre raisonnement au corrigé, puis essayez le rappel actif.';
        actualiser(form.dataset.pratique);
      }
    }
    if (form.dataset.evaluation) {
      event.preventDefault();
      const id = form.dataset.evaluation, fiche = obtenirFiche(id), retour = form.querySelector('[data-retour-evaluation]');
      if (!progression.auMoins(id, 'pratique')) { retour.textContent = 'Enregistrez votre essai avant de vérifier vos réponses.'; return; }
      const reponses = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, Number(v)]));
      const resultat = progression.evaluer(id, fiche.evaluation.questions, reponses, fiche.evaluation.version);
      if (!resultat) return;
      retour.innerHTML = `<p><strong>${resultat.reussi ? 'Réponses justes.' : 'Une notion mérite d’être reprise.'}</strong> ${resultat.compte ? '' : 'Recommencer aujourd’hui ne crée pas une nouvelle preuve.'}</p>
        <ul>${resultat.details.map(r => `<li>${r.reussi ? 'Juste' : 'À reprendre'} : ${e(r.explication)}</li>`).join('')}</ul>
        <p>Prochaine révision : ${new Date(resultat.prochaineRevision).toLocaleDateString('fr-FR')}.</p>`;
      form.querySelector('button[type="submit"]').disabled = true;
      actualiser(id);
    }
  });
}
