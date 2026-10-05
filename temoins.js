/* S-WEB, consentement aux temoins de mesure.

   Regle de base : rien n'est charge avant que la personne ait choisi. Le
   script de Google n'est meme pas telecharge tant que le consentement n'est
   pas donne, ce qui est la seule lecture defendable de la loi 25. Un refus
   ne charge rien du tout, et il est aussi facile a donner qu'un accord : les
   deux boutons ont le meme poids visuel, et « Refuser » vient en premier.

   Tant que MESURE est vide, il n'y a rien a mesurer, donc rien a demander :
   le bandeau ne s'affiche pas. Le site ne depose alors aucun temoin, ce que
   la politique de confidentialite dit deja.

   Le bandeau est construit ici plutot qu'ecrit dans les 16 pages : il n'a de
   sens que si le JavaScript tourne, puisque c'est le JavaScript qui chargerait
   la mesure. Sans JavaScript, rien n'est mesure et il n'y a rien a consentir.

   Le choix se garde dans localStorage, pas dans un temoin : c'est le seul
   stockage du site, il ne quitte jamais le navigateur, et il est strictement
   necessaire pour se souvenir d'un refus.

   La loi 25 demande qu'on puisse revenir sur son accord aussi simplement
   qu'on l'a donne : le lien « Temoins » ajoute au pied de page rouvre le
   choix sur toutes les pages. */
(function () {
  'use strict';

  /* Identifiant de mesure GA4, format G-XXXXXXXXXX.

     Vide = aucune mesure, aucun bandeau, aucun lien « Temoins » au pied de
     page : il n'y a rien a consentir, et le site ne depose rien.

     En le remplissant, il faut AUSSI ajouter Google Analytics a la politique
     de confidentialite, dans les deux langues : la loi 25 demande de dire
     quels renseignements partent et vers qui. Le site n'a pour l'instant
     aucun service tiers a declarer en dehors de Web3Forms. */
  var MESURE = '';

  var CLE = 'sweb-temoins';
  var anglais = (document.documentElement.lang || 'fr').slice(0, 2) === 'en';

  var MOTS = anglais ? {
    titre:   'We measure visits',
    texte:   'With your consent, we measure visits to improve the site. ' +
             'Nothing is loaded until you choose.',
    savoir:  'Learn more',
    refuser: 'Decline',
    accepter:'Accept',
    pied:    'Cookies',
    vie:     '/en/privacy-policy',
    region:  'Consent to measurement cookies'
  } : {
    titre:   'Nous mesurons les visites',
    texte:   'Avec votre accord, on mesure les visites pour améliorer le site. ' +
             'Rien n’est chargé tant que vous n’avez pas choisi.',
    savoir:  'En savoir plus',
    refuser: 'Refuser',
    accepter:'Accepter',
    pied:    'Témoins',
    vie:     '/politique-de-confidentialite',
    region:  'Consentement aux témoins de mesure'
  };

  /* localStorage leve une exception en navigation privee sur certains
     navigateurs : on ne laisse jamais ca casser la page. */
  function lu() {
    try { return localStorage.getItem(CLE); } catch (e) { return null; }
  }
  function ecrit(v) {
    try { localStorage.setItem(CLE, v); } catch (e) { /* tant pis */ }
  }

  function chargeMesure() {
    if (window.gtag) return;                       /* deja en place */
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MESURE;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    /* GA4 tronque les adresses IP d'office : rien a passer pour ca. */
    window.gtag('config', MESURE);
  }

  if (!MESURE) return;

  var bandeau = null;
  var ouvreur = null;                              /* qui a rouvert le choix */

  function ferme(choix) {
    if (choix) ecrit(choix);
    if (bandeau) { bandeau.remove(); bandeau = null; }
    document.body.classList.remove('a-temoins');
    document.removeEventListener('keydown', echappe);
    if (choix === 'oui') chargeMesure();
    if (ouvreur) { ouvreur.focus(); ouvreur = null; }
  }

  function echappe(e) {
    /* Fermer sans choisir ne vaut pas un accord : on refuse. */
    if (e.key === 'Escape') ferme('non');
  }

  function montre() {
    if (bandeau) return;

    bandeau = document.createElement('div');
    bandeau.className = 'temoins';
    bandeau.setAttribute('role', 'dialog');
    bandeau.setAttribute('aria-label', MOTS.region);
    bandeau.setAttribute('tabindex', '-1');

    bandeau.innerHTML =
      '<div class="temoins__contenu">' +
        '<div class="temoins__texte">' +
          '<p class="temoins__eyebrow">' + MOTS.titre + '</p>' +
          '<p class="temoins__phrase">' + MOTS.texte + ' ' +
            '<a href="' + MOTS.vie + '">' + MOTS.savoir + '</a>' +
          '</p>' +
        '</div>' +
        '<div class="temoins__boutons">' +
          '<button class="bouton bouton--secondaire" type="button" data-choix="non">' +
            MOTS.refuser + '</button>' +
          '<button class="bouton bouton--secondaire" type="button" data-choix="oui">' +
            MOTS.accepter + '</button>' +
        '</div>' +
      '</div>';

    bandeau.addEventListener('click', function (e) {
      var b = e.target.closest('[data-choix]');
      if (b) ferme(b.getAttribute('data-choix'));
    });

    document.body.appendChild(bandeau);
    document.body.classList.add('a-temoins');
    document.addEventListener('keydown', echappe);
    bandeau.focus();
  }

  /* Lien de reouverture, dans la ligne legale du pied de page. */
  function poseLienPied() {
    var ligne = document.querySelector('.pied__legal');
    if (!ligne) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pied__lien pied__lien--legal pied__lien--bouton';
    b.textContent = MOTS.pied;
    b.addEventListener('click', function () { ouvreur = b; montre(); });
    ligne.appendChild(b);
  }

  var choix = lu();
  if (choix === 'oui') chargeMesure();
  else if (choix !== 'non') montre();

  poseLienPied();
})();
