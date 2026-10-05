/* S-WEB, envoi du formulaire de demande d'appel.

   Avant : action="#", aucun script. Le formulaire se rechargeait et la
   demande etait perdue sans que personne ne le sache, ni le prospect ni nous.

   Deux chemins, selon POINT_ENVOI :

   - POINT_ENVOI rempli (Formspree, Web3Forms, fonction Vercel) : envoi en
     arriere-plan, le visiteur ne quitte pas la page.
   - POINT_ENVOI vide : on ouvre le logiciel de courriel du visiteur avec la
     demande deja ecrite, et on le dit clairement a l'ecran. C'est moins bon
     qu'un envoi direct, mais rien ne se perd en silence.

   Sans JavaScript, le formulaire garde son action mailto : le resultat est
   le meme, en moins soigne.

   Loi 25 : ce que le formulaire fait des coordonnees est decrit dans la
   politique de confidentialite. Si POINT_ENVOI change, cette page change. */
(function () {
  'use strict';

  var POINT_ENVOI = '';
  var COURRIEL = 's.webagencyca@gmail.com';

  var form = document.querySelector('.form');
  if (!form) return;

  var anglais = (document.documentElement.lang || 'fr').slice(0, 2) === 'en';

  var MOTS = anglais ? {
    sujet:   'Call request',
    envoi:   'Sending…',
    merci:   'Thank you, we have your request. We answer within 24 to 48 business hours.',
    courriel:'Your email program just opened with your request. Send it and we will answer '
           + 'within 24 to 48 business hours. If nothing opened, write to us at ',
    echec:   'The send failed. Write to us at ',
    envoyer: 'Send'
  } : {
    sujet:   'Demande d’appel',
    envoi:   'Envoi en cours…',
    merci:   'Merci, votre demande est reçue. On répond en 24 à 48 h ouvrables.',
    courriel:'Votre logiciel de courriel vient de s’ouvrir avec votre demande. Envoyez-le et '
           + 'on vous répond en 24 à 48 h ouvrables. Si rien ne s’est ouvert, '
           + 'écrivez-nous à ',
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

  /* Le nom lisible d'un champ. Les boutons radio n'ont ni id ni <label for>
     qui leur soit propre : leur intitule est la <legend> du fieldset, et leur
     valeur le texte affiche a cote du bouton, pas l'attribut value. */
  function intitule(champ) {
    var etiquette = champ.id && form.querySelector('label[for="' + champ.id + '"]');
    if (!etiquette) {
      var groupe = champ.closest('fieldset');
      etiquette = groupe && groupe.querySelector('legend');
    }
    if (!etiquette) return champ.name;
    /* L'intitule porte aussi la bulle d'aide et la mention (facultatif).
       On travaille sur une copie pour les retirer sans toucher a la page. */
    var copie = etiquette.cloneNode(true);
    [].forEach.call(copie.querySelectorAll('.aide, .champ__facultatif'), function (n) {
      n.remove();
    });
    return copie.textContent.replace(/\s+/g, ' ').trim();
  }

  function valeur(champ) {
    if (champ.type !== 'radio' && champ.type !== 'checkbox') return champ.value;
    var visible = champ.closest('label');
    visible = visible && visible.querySelector('.radio__texte');
    return visible ? visible.textContent.trim() : champ.value;
  }

  function contenu() {
    var lignes = [];
    [].forEach.call(form.elements, function (champ) {
      if (!champ.name || champ.type === 'submit') return;
      if ((champ.type === 'radio' || champ.type === 'checkbox') && !champ.checked) return;
      lignes.push(intitule(champ) + ' : ' + valeur(champ));
    });
    return lignes.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valide()) return;

    if (!POINT_ENVOI) {
      window.location.href = 'mailto:' + COURRIEL
        + '?subject=' + encodeURIComponent(MOTS.sujet)
        + '&body=' + encodeURIComponent(contenu());
      dis(MOTS.courriel, true, 'succes');
      return;
    }

    if (bouton) bouton.disabled = true;
    if (libelle) libelle.textContent = MOTS.envoi;

    fetch(POINT_ENVOI, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
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
