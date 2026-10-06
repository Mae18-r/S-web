/* S-WEB, les trois panneaux dépliants.

   Au-dessus de 1024 px : trois tranches côte à côte, un seul ouvert à la
   fois, 56 % + 22 % + 22 %. Le survol ouvre, sur pointeur fin seulement, et
   uniquement quand la souris se déplace réellement, voir plus bas ; le clic
   et le focus font la même chose, le survol n'est jamais le seul chemin.

   Sous 1024 px, téléphones et tablettes : les trois blocs sont repliés au
   départ et s'ouvrent au doigt, un seul à la fois. Un deuxième appui sur un
   bloc ouvert le referme, ce qu'on attend d'un accordéon et que la version
   large n'autorise pas, elle qui doit toujours garder une tranche ouverte
   pour que la répartition 56/22/22 tienne. */

(function () {
  'use strict';

  var rangee = document.querySelector('.piliers__rangee');
  if (!rangee) return;

  var piliers = [].slice.call(rangee.querySelectorAll('.pilier'));
  if (!piliers.length) return;

  /* Même seuil que la feuille de style : au-delà, les tranches sont côte à
     côte ; en deçà, elles sont empilées et repliées. */
  var empile = window.matchMedia('(max-width: 1023.98px)');
  var fin = window.matchMedia('(min-width: 1024px) and (pointer: fine)');

  function declencheur(p) { return p.querySelector('.pilier__declencheur'); }

  /* `cible` peut être null : tout se referme. Seul l'empilement s'en sert. */
  function appliquer(cible) {
    piliers.forEach(function (p) {
      var actif = p === cible;
      p.dataset.ouvert = actif ? 'true' : 'false';
      declencheur(p).setAttribute('aria-expanded', actif ? 'true' : 'false');
    });
  }

  /* Derniere position reellement occupee par la souris, pour distinguer un
     survol voulu d'un bord qui a defile dessous. */
  var dernierX = null, dernierY = null;

  piliers.forEach(function (p) {
    var b = declencheur(p);

    b.addEventListener('click', function () {
      if (empile.matches) {
        /* Bascule : un bloc ouvert se referme si on le réappuie. */
        appliquer(p.dataset.ouvert === 'true' ? null : p);
        return;
      }
      appliquer(p);
    });

    /* Le survol ouvre, mais seulement si la souris a vraiment bouge.

       Ouvrir une tranche l'elargit et retrecit les autres : les bords
       defilent alors sous un curseur immobile, le navigateur signale une
       entree dans la tranche voisine, qui s'ouvre, qui redeplace tout. La
       boucle s'entretient toute seule une fois la souris arretee. Mesure sur
       un seul survol : 54 basculements, les tranches clignotaient.

       Le filtre tient en une comparaison : une entree provoquee par la mise
       en page porte exactement les memes coordonnees que la precedente,
       puisque la souris, elle, n'a pas bouge. On l'ignore. */
    p.addEventListener('pointerenter', function (e) {
      if (empile.matches || !fin.matches) return;
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (e.clientX === dernierX && e.clientY === dernierY) return;
      dernierX = e.clientX;
      dernierY = e.clientY;
      appliquer(p);
    });

    /* Parité clavier : tabuler jusqu'à une tranche l'ouvre, comme le survol.
       Empilé, on ne le fait pas : tabuler ne doit pas déplier sous le doigt. */
    b.addEventListener('focus', function () {
      if (empile.matches) return;
      appliquer(p);
    });
  });

  /* Flèches gauche/droite entre les onglets, comme un jeu d'onglets. */
  rangee.addEventListener('keydown', function (e) {
    if (empile.matches) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var i = piliers.indexOf(e.target.closest('.pilier'));
    if (i < 0) return;
    var suivant = piliers[(i + (e.key === 'ArrowRight' ? 1 : piliers.length - 1)) % piliers.length];
    appliquer(suivant);
    declencheur(suivant).focus();
    e.preventDefault();
  });

  /* Largeur qu'aura une tranche ouverte, posee en variable pour que le corps
     s'y compose une fois pour toutes. Elle se deduit de la rangee : largeur
     totale moins les deux gouttieres, repartie 2,545 / 1 / 1.

     C'est la seule mesure prise en JS, et elle evite la secousse verticale :
     sans elle, le texte se recompose pendant que la tranche s'elargit, et la
     hauteur du panneau change en cours de route. */
  function poseLargeurOuverte() {
    if (empile.matches) {
      rangee.style.removeProperty('--tranche-ouverte');
      return;
    }
    var gouttiere = parseFloat(getComputedStyle(rangee).columnGap) || 0;
    var distribuable = rangee.clientWidth - gouttiere * 2;
    if (distribuable <= 0) return;
    var ouverte = distribuable * 2.545 / 4.545;
    /* On retire le rembourrage horizontal du corps : la variable sert a
       dimensionner le contenu, pas la tranche. */
    var corps = piliers[0].querySelector('.pilier__corps');
    var cs = getComputedStyle(corps);
    var marges = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    rangee.style.setProperty('--tranche-ouverte', (ouverte - marges) + 'px');
  }

  /* La rangee prend la hauteur du plus grand des trois etats, une fois pour
     toutes. Sans ca elle changeait encore de 41 px selon la tranche ouverte :
     un titre ferme s'ecrit a la verticale et prend plus de haut qu'un titre
     ouvert, ecrit a l'horizontale. C'est ce reste de saut qu'on voyait. */
  function poseHauteur() {
    if (empile.matches) {
      rangee.style.removeProperty('min-height');
      return;
    }
    var avant = piliers.map(function (p) { return p.dataset.ouvert; });
    rangee.classList.add('est-mesuree');
    rangee.style.removeProperty('min-height');

    var haut = 0;
    piliers.forEach(function (cible) {
      piliers.forEach(function (p) {
        p.dataset.ouvert = (p === cible) ? 'true' : 'false';
      });
      haut = Math.max(haut, rangee.offsetHeight);
    });

    piliers.forEach(function (p, i) { p.dataset.ouvert = avant[i]; });
    rangee.offsetHeight;                 /* on reprend l'etat avant de rendre */
    rangee.classList.remove('est-mesuree');
    rangee.style.minHeight = haut + 'px';
  }

  function ajuster() {
    /* Les déclencheurs restent actionnables des deux côtés du seuil : c'est
       justement ce qui manquait à la version empilée. */
    piliers.forEach(function (p) { declencheur(p).disabled = false; });

    if (empile.matches) {
      appliquer(null);                 /* tout replié */
      return;
    }

    /* En repassant de l'empilement aux tranches, aucune n'est ouverte : il en
       faut exactement une, sinon la répartition 56/22/22 casse. */
    var ouvertes = piliers.filter(function (p) { return p.dataset.ouvert === 'true'; });
    appliquer(ouvertes.length === 1 ? ouvertes[0] : piliers[0]);
  }

  function tout() { ajuster(); poseLargeurOuverte(); poseHauteur(); }

  tout();
  if (empile.addEventListener) empile.addEventListener('change', tout);
  else empile.addListener(tout);

  /* La largeur depend de celle de la rangee : on la recalcule quand elle
     change, redimensionnement comme arrivee de la police. */
  function remesure() { poseLargeurOuverte(); poseHauteur(); }

  /* ResizeObserver sur la rangee s'auto-declencherait, puisqu'on change sa
     hauteur : on observe donc son parent, dont la largeur commande tout. */
  if (window.ResizeObserver) new ResizeObserver(remesure).observe(rangee.parentNode);
  else window.addEventListener('resize', remesure);

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remesure);
})();
