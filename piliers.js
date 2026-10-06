/* S-WEB, les trois panneaux dépliants.

   Au-dessus de 1024 px : trois tranches côte à côte, un seul ouvert à la
   fois, 56 % + 22 % + 22 %. Le survol ouvre, sur pointeur fin seulement ; le
   clic et le focus font la même chose, le survol n'est jamais le seul chemin.

   Sous 1024 px, téléphones et tablettes : les trois blocs sont repliés au
   départ et s'ouvrent au doigt, un seul à la fois. Un deuxième appui sur un
   bloc ouvert le referme, ce qu'on attend d'un accordéon et que la version
   large n'autorise pas, elle qui doit toujours garder une tranche ouverte
   pour que la répartition 56/22/22 tienne. */

(function () {
  'use strict';

  var rangee = document.querySelector('.piliers__rangee');
  if (!rangee) return;

  var piliers = [].slice.call(rangee.querySelectorAll('.pilier'));
  if (!piliers.length) return;

  /* Même seuil que la feuille de style : au-delà, les tranches sont côte à
     côte ; en deçà, elles sont empilées et repliées. */
  var empile = window.matchMedia('(max-width: 1023.98px)');
  var fin = window.matchMedia('(min-width: 1024px) and (pointer: fine)');

  function declencheur(p) { return p.querySelector('.pilier__declencheur'); }

  /* `cible` peut être null : tout se referme. Seul l'empilement s'en sert. */
  function appliquer(cible) {
    piliers.forEach(function (p) {
      var actif = p === cible;
      p.dataset.ouvert = actif ? 'true' : 'false';
      declencheur(p).setAttribute('aria-expanded', actif ? 'true' : 'false');
    });
  }

  piliers.forEach(function (p) {
    var b = declencheur(p);

    b.addEventListener('click', function () {
      if (empile.matches) {
        /* Bascule : un bloc ouvert se referme si on le réappuie. */
        appliquer(p.dataset.ouvert === 'true' ? null : p);
        return;
      }
      appliquer(p);
    });

    p.addEventListener('pointerenter', function (e) {
      if (empile.matches || !fin.matches) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      appliquer(p);
    });

    /* Parité clavier : tabuler jusqu'à une tranche l'ouvre, comme le survol.
       Empilé, on ne le fait pas : tabuler ne doit pas déplier sous le doigt. */
    b.addEventListener('focus', function () {
      if (empile.matches) return;
      appliquer(p);
    });
  });

  /* Flèches gauche/droite entre les onglets, comme un jeu d'onglets. */
  rangee.addEventListener('keydown', function (e) {
    if (empile.matches) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var i = piliers.indexOf(e.target.closest('.pilier'));
    if (i < 0) return;
    var suivant = piliers[(i + (e.key === 'ArrowRight' ? 1 : piliers.length - 1)) % piliers.length];
    appliquer(suivant);
    declencheur(suivant).focus();
    e.preventDefault();
  });

  function ajuster() {
    /* Les déclencheurs restent actionnables des deux côtés du seuil : c'est
       justement ce qui manquait à la version empilée. */
    piliers.forEach(function (p) { declencheur(p).disabled = false; });

    if (empile.matches) {
      appliquer(null);                 /* tout replié */
      return;
    }

    /* En repassant de l'empilement aux tranches, aucune n'est ouverte : il en
       faut exactement une, sinon la répartition 56/22/22 casse. */
    var ouvertes = piliers.filter(function (p) { return p.dataset.ouvert === 'true'; });
    appliquer(ouvertes.length === 1 ? ouvertes[0] : piliers[0]);
  }

  ajuster();
  if (empile.addEventListener) empile.addEventListener('change', ajuster);
  else empile.addListener(ajuster);
})();
