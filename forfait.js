/* S-WEB, le forfait de base : revelation des trois piliers.

   L'etat de depart est pose ici, jamais par la feuille de style : sans
   JavaScript les trois cartes sont simplement la, lisibles et mises en page,
   sans surcharge <noscript> a tenir a jour.

   Les cartes et les coches ne bougent qu'en transform et en opacity, donc
   aucune reprise de mise en page pendant l'animation. Le decalage entre les
   cartes et entre les coches est pose en CSS, pas ici.

   Sous 1024 px les trois piliers deviennent un accordeon : le premier reste
   ouvert, les deux autres se replient. Au-dessus, les trois panneaux sont
   toujours ouverts et les declencheurs ne servent plus. */
(function () {
  'use strict';

  var section = document.querySelector('.forfait__piliers');
  if (!section) return;

  var doux = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var empile = matchMedia('(max-width: 1023.98px)');

  /* --- L'accordeon, sous 1024 px ---------------------------------------- */

  var cartes = [].slice.call(section.querySelectorAll('.fp'));

  cartes.forEach(function (c) {
    var b = c.querySelector('.fp__declencheur');
    b.addEventListener('click', function () {
      if (!empile.matches) return;              /* en grille, tout reste ouvert */
      var ouvert = c.dataset.ouvert === 'true';
      c.dataset.ouvert = ouvert ? 'false' : 'true';
      b.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
    });
  });

  /* En grille, aucun panneau n'est replie : on remet tout a plat pour que
     repasser du telephone a l'ordinateur ne laisse pas deux cartes vides. */
  function ajuster() {
    if (empile.matches) return;
    cartes.forEach(function (c) {
      c.dataset.ouvert = 'true';
      c.querySelector('.fp__declencheur').setAttribute('aria-expanded', 'true');
    });
  }

  ajuster();
  if (empile.addEventListener) empile.addEventListener('change', ajuster);
  else empile.addListener(ajuster);

  /* Les trois cartes portent les ancres #site, #images et #plan, visees par la
     colonne Services du pied sur toutes les pages. Sous 1024 px deux d'entre
     elles sont repliees : on ouvre celle qu'on vient chercher, sinon le lien
     amene devant un panneau ferme. */
  function ouvreLAncre() {
    var id = location.hash.slice(1);
    if (!id) return;
    var c = document.getElementById(id);
    if (!c || c.className.indexOf('fp') === -1) return;
    c.dataset.ouvert = 'true';
    c.querySelector('.fp__declencheur').setAttribute('aria-expanded', 'true');
  }

  ouvreLAncre();
  window.addEventListener('hashchange', ouvreLAncre);

  if (doux || !window.IntersectionObserver) return;

  /* --- La cascade -------------------------------------------------------- */

  section.classList.add('est-masque');

  var o = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return;
    o.disconnect();                             /* une seule fois */
    section.classList.add('est-revele');
  }, { threshold: 0.2 });
  o.observe(section);

})();
