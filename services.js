/* S-WEB — les trois services apparaissent en fondu au defilement. L'etat de
   depart est pose par le script, jamais par la feuille de style : sans JS les
   blocs restent simplement visibles, sans surcharge <noscript>. */
(function () {
  'use strict';

  var blocs = [].slice.call(document.querySelectorAll('.service'));
  if (!blocs.length || !window.IntersectionObserver) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  blocs.forEach(function (b) { b.classList.add('est-masque'); });

  blocs.forEach(function (b) {
    var o = new IntersectionObserver(function (entrees) {
      if (!entrees[0].isIntersecting) return;
      o.disconnect();                              /* une seule fois */
      b.classList.add('est-revele');
    }, { rootMargin: '0px 0px -15% 0px' });
    o.observe(b);
  });

  document.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'opacity' && e.target.classList.contains('service')) {
      e.target.style.willChange = '';
    }
  });
})();
