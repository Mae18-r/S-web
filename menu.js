/* S-WEB — bascule du panneau de navigation mobile.
   Le panneau est ouvert/fermé par la classe `est-ouvert` sur l'en-tête ;
   toute la transition est en CSS (spec-sheet §14). */

(function () {
  'use strict';

  var entete = document.getElementById('entete');
  if (!entete) return;

  var bouton = entete.querySelector('.menu-bouton');
  var panneau = document.getElementById('menu-mobile');
  if (!bouton || !panneau) return;

  function definirEtat(ouvert) {
    entete.classList.toggle('est-ouvert', ouvert);
    bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
  }

  function estOuvert() {
    return bouton.getAttribute('aria-expanded') === 'true';
  }

  bouton.addEventListener('click', function () {
    definirEtat(!estOuvert());
  });

  // Échap ferme le panneau et rend le focus au bouton.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && estOuvert()) {
      definirEtat(false);
      bouton.focus();
    }
  });

  // Le panneau n'existe qu'en dessous du point de bascule : s'il disparaît
  // pendant qu'il est ouvert, on remet l'état à zéro pour que `aria-expanded`
  // ne mente pas sur la version desktop.
  var horsMobile = window.matchMedia('(min-width: 1176px)');
  var surChangement = function (e) {
    if (e.matches) definirEtat(false);
  };
  if (horsMobile.addEventListener) horsMobile.addEventListener('change', surChangement);
  else horsMobile.addListener(surChangement);
})();
