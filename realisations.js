/* S-WEB, apparition des trois cartes de realisations.

   ECART DEMANDE (Mae, 2026-10-06) : §14 interdit « les apparitions au scroll
   generalisees ». Celle-ci a ete demandee explicitement, et reste bornee aux
   trois cartes de cette seule bande.

   L'etat de depart est pose par le script, jamais par la feuille de style :
   sans JavaScript les cartes restent simplement visibles, sans surcharge
   <noscript> a tenir a jour. */
(function () {
  'use strict';

  var cartes = [].slice.call(document.querySelectorAll('.realisations .rea'));
  if (!cartes.length || !window.IntersectionObserver) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cartes.forEach(function (c) { c.classList.add('est-masquee'); });

  cartes.forEach(function (c, i) {
    var o = new IntersectionObserver(function (entrees) {
      if (!entrees[0].isIntersecting) return;
      o.disconnect();                              /* une seule fois */
      c.style.transitionDelay = (i * 120) + 'ms';  /* decalage entre les cartes */
      c.classList.add('est-revelee');
    }, { threshold: 0.25 });
    o.observe(c);
  });
})();
