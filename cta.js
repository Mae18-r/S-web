/* S-WEB — le CTA flottant se montre des qu'on a depasse le hero, et se retire
   quand on y revient. Un seul observateur, sur le hero. */
(function () {
  'use strict';
  var b = document.querySelector('.cta-flottant');
  var h = document.querySelector('.hero');
  if (!b || !h || !window.IntersectionObserver) return;

  new IntersectionObserver(function (e) {
    b.classList.toggle('est-visible', !e[0].isIntersecting);
  }, { threshold: 0 }).observe(h);
})();
