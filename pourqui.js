/* S-WEB — revelation mot a mot, une fois. Decalage 45 ms, continu. */
(function () {
  'use strict';
  var s = document.querySelector('.pourqui');
  if (!s || !window.IntersectionObserver) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var m = s.querySelectorAll('.word'), i;
  for (i = 0; i < m.length; i++) m[i].style.transitionDelay = i * 45 + 'ms';

  s.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'filter') e.target.style.willChange = '';
  });

  var o = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return;
    o.disconnect();
    for (i = 0; i < m.length; i++) m[i].style.willChange = 'opacity,filter,transform';
    s.classList.add('est-revele');
  }, { threshold: 0.3 });

  o.observe(s);
})();
