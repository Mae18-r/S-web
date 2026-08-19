/* S-WEB — le chiffre se pose, il ne défile pas.
   Une seule fois, puis l'observateur se déconnecte : jamais de rejeu.
   900 ms — ralentissement progressif jusqu'à ~600 ms, puis deux intervalles
   nettement plus longs, et on se pose sur la valeur déjà écrite dans le HTML.
   Le « × » n'est jamais touché : seuls les chiffres tournent. */

(function () {
  'use strict';

  var el = document.querySelector('.impact__valeur');
  if (!el || !window.IntersectionObserver) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var finale = el.getAttribute('data-valeur');
  var sep = finale.indexOf(',') > -1 ? ',' : '.';

  /* Phase 1 : 60 ms au départ, +6 % à chaque pas jusqu'à ~600 ms.
     Phase 2 : le reste des 900 ms en deux intervalles bien plus longs. */
  var pas = [], t = 0, d = 60;
  while (t + d < 600) { pas.push(d); t += d; d *= 1.06; }
  pas.push((900 - t) * 0.35, (900 - t) * 0.65);

  function alea() {
    return (1 + Math.random() * 9 | 0) + sep + (1 + Math.random() * 9 | 0);
  }

  var obs = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return;
    obs.disconnect();
    var i = 0;
    (function suivant() {
      if (i >= pas.length) { el.textContent = finale; return; }
      el.textContent = alea();
      setTimeout(suivant, pas[i++]);
    })();
  }, { threshold: 0.4 });

  obs.observe(el);
})();
