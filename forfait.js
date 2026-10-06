/* S-WEB, le forfait de base : revelation des trois piliers et du prix.

   L'etat de depart est pose ici, jamais par la feuille de style : sans
   JavaScript les trois cartes et le prix sont simplement la, lisibles et mis
   en page, sans surcharge <noscript> a tenir a jour.

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

  if (doux || !window.IntersectionObserver) return;

  /* --- La cascade -------------------------------------------------------- */

  section.classList.add('est-masque');

  var o = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return;
    o.disconnect();                             /* une seule fois */
    section.classList.add('est-revele');
  }, { threshold: 0.2 });
  o.observe(section);

  /* --- Le prix ----------------------------------------------------------- */

  var bloc = document.querySelector('.forfait__prix');
  var nombre = bloc && bloc.querySelector('.forfait__nombre');
  if (!nombre) return;

  var cible = parseInt(nombre.getAttribute('data-valeur').replace(/\D/g, ''), 10);
  if (!cible) return;

  /* L'espace du millier est repris du texte d'origine, pas devine. */
  var separateur = nombre.textContent.replace(/[\d]/g, '').charAt(0) || ' ';

  function ecrit(v) {
    nombre.textContent = v >= 1000
      ? String(Math.floor(v / 1000)) + separateur + ('00' + (v % 1000)).slice(-3)
      : String(v);
  }

  /* On ne remet pas le compteur a zero ici : si l'observateur ne se declenchait
     jamais, la page afficherait « A partir de 0 $ ». Le vrai prix reste donc
     ecrit jusqu'a la derniere seconde. Le paragraphe est deja aria-hidden dans
     le HTML, double par une version lisible : les lecteurs d'ecran annoncent
     toujours le bon montant, animation ou pas. */
  bloc.classList.add('est-masque');

  var op = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return;
    op.disconnect();
    bloc.classList.add('est-revele');

    ecrit(0);

    /* Filet de securite : si les images d'animation ne s'enchainent pas,
       onglet en arriere-plan ou navigateur qui bride, le compteur resterait
       sur une valeur intermediaire. Sur une page de prix, un « 0 $ » affiche
       est pire que pas d'animation du tout. Passe le delai, on pose la valeur
       finale quoi qu'il arrive. */
    var fini = false;
    function termine() {
      if (fini) return;
      fini = true;
      ecrit(cible);
    }

    var debut = null, duree = 900;
    function pas(t) {
      if (fini) return;
      if (debut === null) debut = t;
      var p = Math.min((t - debut) / duree, 1);
      if (p >= 1) { termine(); return; }
      ecrit(Math.round(cible * (1 - Math.pow(1 - p, 3))));   /* ease-out cubique */
      requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
    setTimeout(termine, duree + 200);
  }, { threshold: 0.2 });
  op.observe(bloc);
})();
