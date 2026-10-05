/* S-WEB, envoi du formulaire de demande d'appel.

   Avant : action="#", aucun script. Le formulaire se rechargeait et la
   demande etait perdue sans que personne ne le sache, ni le prospect ni nous.

   L'envoi passe par Web3Forms, qui relaie la demande vers la boite de S-WEB.
   La cle d'acces n'est pas un secret : elle est publique par construction et
   ne sert qu'a diriger l'envoi vers le bon compte. Ce sont le champ piege
   `botcheck` et le quota du service qui tiennent les robots a distance.

   Avec JavaScript : envoi en arriere-plan, le visiteur ne quitte pas la page.
   Sans JavaScript : le formulaire poste directement vers Web3Forms, qui
   affiche sa propre page de confirmation.

   Si l'envoi echoue (reseau coupe, service indisponible), on affiche
   l'adresse courriel plutot que de laisser croire que c'est parti.

   Loi 25 : le passage par Web3Forms est declare dans la politique de
   confidentialite. Si ce point d'envoi change, cette page change. */
(function () {
  'use strict';

  var POINT_ENVOI = 'https://api.web3forms.com/submit';
  var COURRIEL = 's.webagencyca@gmail.com';

  var form = document.querySelector('.form');
  if (!form) return;

  var anglais = (document.documentElement.lang || 'fr').slice(0, 2) === 'en';

  var MOTS = anglais ? {
    envoi:   'Sending…',
    merci:   'Thank you, we have your request. We answer within 24 to 48 business hours.',
    echec:   'The send failed. Write to us at ',
    envoyer: 'Send'
  } : {
    envoi:   'Envoi en cours…',
    merci:   'Merci, votre demande est reçue. On répond en 24 à 48 h ouvrables.',
    echec:   'L’envoi a échoué. Écrivez-nous à ',
    envoyer: 'Envoyer'
  };

  /* Zone de reponse, annoncee aux lecteurs d'ecran des qu'elle se remplit. */
  var reponse = document.createElement('p');
  reponse.className = 'form__reponse';
  reponse.setAttribute('role', 'status');
  reponse.hidden = true;
  form.appendChild(reponse);

  var bouton = form.querySelector('button[type="submit"]');
  var libelle = bouton && bouton.querySelector('.bouton__texte');

  function dis(texte, avecCourriel, etat) {
    reponse.textContent = texte;
    if (avecCourriel) {
      var a = document.createElement('a');
      a.href = 'mailto:' + COURRIEL;
      a.textContent = COURRIEL;
      reponse.appendChild(a);
    }
    reponse.className = 'form__reponse' + (etat ? ' form__reponse--' + etat : '');
    reponse.hidden = false;
  }

  /* Validation : on s'appuie sur les contraintes deja posees dans le HTML
     (required, type="email") et sur les <p class="champ__erreur"> en place. */
  function valide() {
    var premier = null;
    [].forEach.call(form.elements, function (champ) {
      if (!champ.willValidate) return;
      var bloc = champ.closest('.champ');
      var ok = champ.checkValidity();
      champ.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (bloc) bloc.classList.toggle('est-invalide', !ok);
      if (!ok && !premier) premier = champ;
    });
    if (premier) premier.focus();
    return !premier;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valide()) return;

    if (bouton) bouton.disabled = true;
    if (libelle) libelle.textContent = MOTS.envoi;

    fetch(POINT_ENVOI, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    }).then(function (r) {
      return r.json().catch(function () { return { success: r.ok }; });
    }).then(function (recu) {
      /* Web3Forms porte l'echec dans le corps de la reponse autant que dans
         le code HTTP : on verifie les deux. */
      if (!recu || recu.success !== true) throw new Error('refus');
      form.reset();
      dis(MOTS.merci, false, 'succes');
    }).catch(function () {
      dis(MOTS.echec, true, 'echec');
    }).then(function () {
      if (bouton) bouton.disabled = false;
      if (libelle) libelle.textContent = MOTS.envoyer;
    });
  });
})();
