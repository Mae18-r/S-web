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

  /* `novalidate` est pose ici, pas dans le HTML : sans JavaScript, le
     navigateur doit garder la main et refuser un envoi incomplet. Le mettre
     dans la page desactivait la verification pour tout le monde, y compris
     quand ce script ne tourne pas. */
  form.noValidate = true;

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

  /* --- Modules choisis sur la page Services -----------------------------
     La selection arrive en parametre d'adresse et, a defaut, dans
     localStorage. On pre-remplit la zone de texte plutot que d'ajouter un
     champ : la demande arrive ainsi dans le courriel comme le reste, sans
     traitement particulier.

     On n'ecrase jamais ce que la personne a deja ecrit. */
  /* Table explicite plutot qu'un slug remis en forme : « reservation-en-ligne »
     redonnerait « Reservation » sans accent. Les slugs sont stables, la table
     ne bouge que si un module change de nom. */
  var NOMS = anglais ? {
    'reservation-en-ligne': 'Online booking connected to your system',
    'formulaires-soumission': 'Quote request forms',
    'pages-de-service': 'Service pages, one per treatment or per product',
    'paiement-cartes-cadeaux': 'Payments and gift cards',
    'boutique-en-ligne': 'Online store',
    'promotions-autonomes': 'Promotions you edit yourself',
    'rappels-automatises': 'Automated reminders and follow-ups',
    'acces-autonome-contenu': 'Self-serve access to your content',
    'calculatrice-financement': 'Financing calculator',
    'receptionniste-ia': 'AI receptionist'
  } : {
    'reservation-en-ligne': 'R\u00e9servation en ligne branch\u00e9e \u00e0 votre syst\u00e8me',
    'formulaires-soumission': 'Formulaires de demande de soumission',
    'pages-de-service': 'Pages de service, une par traitement ou par produit',
    'paiement-cartes-cadeaux': 'Paiement et cartes cadeaux',
    'boutique-en-ligne': 'Boutique en ligne',
    'promotions-autonomes': 'Promotions que vous modifiez vous-m\u00eame',
    'rappels-automatises': 'Automatisation des rappels et des suivis',
    'acces-autonome-contenu': 'Acc\u00e8s autonome \u00e0 votre contenu',
    'calculatrice-financement': 'Calculatrice de financement',
    'receptionniste-ia': 'R\u00e9ceptionniste IA'
  };

  function nomsDesModules() {
    var bruts = [];
    try {
      var p = new URLSearchParams(window.location.search).get('modules');
      if (p) bruts = p.split(',');
    } catch (e) { /* adresse illisible, on passe */ }
    if (!bruts.length) {
      try {
        var m = localStorage.getItem('sweb-modules');
        if (m) bruts = m.split(',');
      } catch (e) { /* tant pis */ }
    }
    return bruts.filter(Boolean);
  }

  function preremplit() {
    var zone = form.querySelector('textarea');
    var slugs = nomsDesModules();
    if (!zone || !slugs.length || zone.value.trim()) return;

    var noms = slugs.map(function (s) { return NOMS[s] || s; });

    zone.value = (anglais
      ? 'Hello, I am interested in the following modules: '
      : 'Bonjour, je suis int\u00e9ress\u00e9(e) par les modules suivants : ')
      + noms.join(', ') + '.';
  }

  preremplit();

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
      try { localStorage.removeItem('sweb-modules'); } catch (e) { /* tant pis */ }
      dis(MOTS.merci, false, 'succes');
    }).catch(function () {
      dis(MOTS.echec, true, 'echec');
    }).then(function () {
      if (bouton) bouton.disabled = false;
      if (libelle) libelle.textContent = MOTS.envoyer;
    });
  });
})();
