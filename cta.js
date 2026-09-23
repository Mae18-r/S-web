/* S-WEB — le CTA flottant se montre des qu'on a depasse le hero, et se retire
   quand on y revient. Un seul observateur, sur le hero. */
(function () {
  'use strict';
  var b = document.querySelector('.cta-flottant');
  /* On observe le jalon place apres le heros, pas le heros lui-meme : celui-ci
     est collant, il ne quitte jamais l'ecran et resterait toujours intersecte. */
  var jalon = document.querySelector('.hero__fin');
  if (!b || !jalon || !window.IntersectionObserver) return;

  new IntersectionObserver(function (e) {
    b.classList.toggle('est-visible', !e[0].isIntersecting);
  }, { threshold: 0 }).observe(jalon);
})();
