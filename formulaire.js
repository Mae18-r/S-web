/* S-WEB, envoi du formulaire de demande d'appel.

   La demande part vers le webhook du CRM de S-WEB (Twenty), en JSON, avec la
   mention source: SITE_WEB qui dit d'ou vient la fiche. Web3Forms ne sert
   plus : sa cle a ete retiree de la page.

   L'adresse du webhook est publique par construction, comme l'etait la cle
   precedente. C'est le champ piege `botcheck` qui tient les robots a
   distance : rempli, on n'envoie rien et on affiche quand meme le merci,
   pour ne pas apprendre au robot a quoi ressemble un refus.

   Le CRM n'a que sept champs. Le domaine d'activite, la reponse sur le logo
   et le texte libre n'en ont pas : ils sont assembles dans `message`, pour
   qu'aucune reponse du formulaire ne se perde en route.

   Avec JavaScript : envoi en arriere-plan, le visiteur ne quitte pas la page.
   Sans JavaScript : le formulaire poste vers la meme adresse, mais encode en
   formulaire et non en JSON. Les noms des champs du HTML ont donc ete alignes
   sur ceux du webhook (prenom, courriel, source, langue) pour que ce chemin
   ait une chance d'aboutir. A VERIFIER : si le webhook n'accepte que du JSON,
   ce chemin sans JavaScript n'arrive pas.

   Si l'envoi echoue (reseau coupe, service indisponible), on affiche
   l'adresse courriel plutot que de laisser croire que c'est parti.

   Loi 25 : la destination est declaree dans la politique de confidentialite.
   Si ce point d'envoi change, cette page change. */
(function () {
  'use strict';

  var POINT_ENVOI = 'https://twenty-production-ad61.up.railway.app/webhooks/workflows/6134c0ed-a527-44da-9d28-9614836f4da3/5f16e2ef-796e-4607-b72c-79c8b5c9ff93';
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
    envoyer: 'Send',
    /* La valeur des boutons radio reste en francais dans le HTML des deux
       langues : on la traduit ici seulement pour l'ecrire dans la fiche. */
    logo:    { oui: 'yes', non: 'no', refaire: 'to redo' }
  } : {
    envoi:   'Envoi en cours…',
    merci:   'Merci, votre demande est reçue. On répond en 24 à 48 h ouvrables.',
    echec:   'L’envoi a échoué. Écrivez-nous à ',
    envoyer: 'Envoyer',
    logo:    { oui: 'oui', non: 'non', refaire: 'à refaire' }
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

  /* --- Le message ---------------------------------------------------------
     Le CRM attend un seul champ libre. On y replie les reponses qui n'ont pas
     de case a eux, en les nommant, pour qu'elles restent lisibles dans la
     fiche. Une reponse vide ne laisse pas de ligne vide derriere elle. */
  function valeur(nom) {
    var champ = form.elements[nom];
    if (!champ) return '';
    /* Un groupe de boutons radio renvoie une RadioNodeList, dont `.value` est
       celui du bouton coche, ou '' si aucun ne l'est. */
    return (champ.value || '').trim();
  }

  function message() {
    var lignes = [];
    var domaine = valeur('domaine');
    var logo = valeur('logo');
    var details = valeur('details');

    if (domaine) lignes.push((anglais ? 'Industry: ' : "Domaine d'activit\u00e9 : ") + domaine);
    if (logo) lignes.push((anglais ? 'Logo: ' : 'Logo : ') + (MOTS.logo[logo] || logo));
    if (details) lignes.push((lignes.length ? '\n' : '') + details);

    return lignes.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Le piege : on remercie sans rien envoyer. */
    var piege = form.elements['botcheck'];
    if (piege && piege.checked) { dis(MOTS.merci, false, 'succes'); return; }

    if (!valide()) return;

    if (bouton) bouton.disabled = true;
    if (libelle) libelle.textContent = MOTS.envoi;

    var demande = {
      source: 'SITE_WEB',
      entreprise: valeur('entreprise'),
      prenom: valeur('prenom'),
      courriel: valeur('courriel'),
      telephone: valeur('telephone'),
      message: message(),
      langue: anglais ? 'EN' : 'FR'
    };

    fetch(POINT_ENVOI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demande)
    }).then(function (r) {
      /* Le webhook ne renvoie pas de corps exploitable : c'est le code HTTP
         qui fait foi, et lui seul. */
      if (!r.ok) throw new Error(String(r.status));
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
