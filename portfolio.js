/* S-WEB — recouvrement des cas au defilement. Chaque cas se fige quand sa fin
   atteint le bas de l'ecran, et le suivant remonte par-dessus.

   Le decalage vaut (hauteur d'ecran - hauteur du cas). Il ne peut pas s'ecrire
   en CSS : `top: calc(100vh - 100%)` se resout a 0 parce qu'un pourcentage de
   `top` ne se calcule pas contre un conteneur de hauteur automatique. Avec
   top: 0 un cas de plusieurs milliers de pixels se figerait des sa premiere
   ligne et le reste ne serait jamais lisible.

   Le collant est pose par le script, pas par la feuille de style : sans JS la
   page defile normalement. Le bloc conteneur est <main> : un element collant
   ne se deplace que dans son conteneur, et il faut ici qu'un cas reste fige
   pendant que les suivants defilent par-dessus. */
(function () {
  'use strict';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cas = [].slice.call(document.querySelectorAll('.cas'));
  if (!cas.length) return;

  function caler() {
    cas.forEach(function (c) {
      c.style.top = Math.min(0, innerHeight - c.offsetHeight) + 'px';
      c.classList.add('est-cale');
    });
  }
  caler();

  /* Les captures arrivent en differe : la hauteur d'un cas change apres coup. */
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(caler);
    cas.forEach(function (c) { ro.observe(c); });
  }

  var minuteur;
  addEventListener('resize', function () {
    clearTimeout(minuteur);
    minuteur = setTimeout(caler, 150);
  });
})();
