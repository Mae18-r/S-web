/* S-WEB — les trois panneaux dépliants.
   Un seul ouvert à la fois : 56 % + 22 % + 22 %. Sous 768 px tout est déplié
   et les déclencheurs sont désactivés — la mise en page mobile n'a pas d'états. */

(function () {
  'use strict';

  var rangee = document.querySelector('.piliers__rangee');
  if (!rangee) return;

  var piliers = [].slice.call(rangee.querySelectorAll('.pilier'));
  if (!piliers.length) return;

  var etroit = window.matchMedia('(max-width: 767.98px)');

  function declencheur(p) { return p.querySelector('.pilier__declencheur'); }

  function ouvrir(cible) {
    piliers.forEach(function (p) {
      var actif = p === cible;
      p.dataset.ouvert = actif ? 'true' : 'false';
      declencheur(p).setAttribute('aria-expanded', actif ? 'true' : 'false');
    });
  }

  /* Le survol ouvre, sur pointeur fin uniquement. Le clic et le focus font la
     même chose : le survol n'est jamais le seul chemin. */
  var fin = window.matchMedia('(min-width: 768px) and (pointer: fine)');

  piliers.forEach(function (p) {
    var b = declencheur(p);

    b.addEventListener('click', function () {
      if (etroit.matches) return;          /* pas d'états sous 768 px */
      ouvrir(p);
    });

    p.addEventListener('pointerenter', function (e) {
      if (etroit.matches || !fin.matches) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      ouvrir(p);
    });

    /* Parité clavier : tabuler jusqu'à une tranche l'ouvre, comme le survol. */
    b.addEventListener('focus', function () {
      if (etroit.matches) return;
      ouvrir(p);
    });
  });

  /* Flèches gauche/droite entre les onglets, comme un jeu d'onglets. */
  rangee.addEventListener('keydown', function (e) {
    if (etroit.matches) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var i = piliers.indexOf(e.target.closest('.pilier'));
    if (i < 0) return;
    var suivant = piliers[(i + (e.key === 'ArrowRight' ? 1 : piliers.length - 1)) % piliers.length];
    ouvrir(suivant);
    declencheur(suivant).focus();
    e.preventDefault();
  });

  /* Sous 768 px : tout ouvert, plus aucun déclencheur actionnable. */
  function ajuster() {
    var mobile = etroit.matches;

    if (mobile) {
      piliers.forEach(function (p) {
        var b = declencheur(p);
        b.disabled = true;
        p.dataset.ouvert = 'true';
        b.removeAttribute('aria-expanded');
      });
      return;
    }

    piliers.forEach(function (p) { declencheur(p).disabled = false; });

    /* En repassant du mobile au desktop, les trois tranches sont ouvertes :
       il faut en garder exactement une, sinon la répartition 56/22/22 casse. */
    var ouvertes = piliers.filter(function (p) { return p.dataset.ouvert === 'true'; });
    ouvrir(ouvertes.length === 1 ? ouvertes[0] : piliers[0]);
  }

  ajuster();
  if (etroit.addEventListener) etroit.addEventListener('change', ajuster);
  else etroit.addListener(ajuster);
})();
