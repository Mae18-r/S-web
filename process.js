/* S-WEB — frise du processus. L'axe descend depuis l'etape 01 : sa hauteur
   suit le nombre d'etapes revelees (N/5), sans ecouteur de defilement. Un flou
   court se dissipe a chaque croissance, sur le trait de 1 px et rien d'autre. */
(function () {
  'use strict';

  var s = document.querySelector('.process');
  if (!s || !window.IntersectionObserver) return;

  var axe = s.querySelector('.process__axe');
  var etapes = [].slice.call(s.querySelectorAll('.process__etape'));
  if (!axe || !etapes.length) return;

  /* L'axe s'arrete au dernier noeud : on retranche ce qui suit son centre. */
  function borner() {
    var dernier = etapes[etapes.length - 1];
    axe.style.setProperty('--fin-axe', (dernier.offsetHeight - 10) + 'px');
  }
  borner();

  var minuteur;
  addEventListener('resize', function () {
    clearTimeout(minuteur);
    minuteur = setTimeout(borner, 150);
  });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  etapes.forEach(function (e) { e.classList.remove('est-revele'); });

  var atteint = 0;   /* jamais decroissant : remonter ne retracte rien */

  axe.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'filter') axe.style.willChange = '';
  });

  function etendre(n) {
    if (n <= atteint) return;
    atteint = n;
    axe.style.willChange = 'transform,filter';
    axe.style.transition = 'none';
    axe.style.filter = 'blur(6px)';
    void axe.offsetHeight;                       /* fige l'etat flou */
    axe.style.transition = '';
    axe.style.setProperty('--avancee', n / etapes.length);
    axe.style.filter = 'blur(0px)';
  }

  etapes.forEach(function (e, i) {
    var o = new IntersectionObserver(function (entrees) {
      if (!entrees[0].isIntersecting) return;
      o.disconnect();
      e.classList.add('est-revele');
      etendre(i + 1);
    }, { rootMargin: '0px 0px -25% 0px' });
    o.observe(e);
  });
})();
