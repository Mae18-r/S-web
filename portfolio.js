/* S-WEB — index des realisations.

   Source unique : pour ajouter un projet, ajouter un objet a ce tableau.
   `image: null` fait basculer la ligne sur le gabarit raye automatiquement.

   L'ouverture de l'apercu est faite en CSS (:hover et :focus-within) plutot
   qu'en suivant un index en JS : le resultat est le meme — un seul apercu
   ouvert a la fois — et le clavier en beneficie aussi. */
(function () {
  'use strict';

  var PROJETS = [
    { nom: 'M\u00e9dia Connexion', secteur: 'Musique & booking',
      url: 'https://www.m\u00e9diaconnexion.com/fr',
      image: 'assets/work/mediaconnexion1.png' },
    { nom: 'Seiko Loyalty', secteur: 'Mode & e-commerce',
      url: 'https://seikoloyalty.vercel.app',
      image: 'assets/work/seikoloyalty1.png' },
    { nom: 'X.Vision', secteur: 'Studio audiovisuel',
      url: 'https://xvision-flame.vercel.app',
      image: 'assets/work/xvision1.png' },
    { nom: 'Pose ta Pierre', secteur: 'Photographie',
      url: 'https://symphonious-seahorse-b42192.netlify.app/#accueil',
      image: null }
  ];

  var liste = document.querySelector('.index-proj');
  if (!liste) return;

  var racine = liste.getAttribute('data-racine') || '';
  var etiquette = liste.getAttribute('data-visiter') || 'Visiter';
  var manquante = liste.getAttribute('data-manquante') || '';

  liste.innerHTML = '';

  PROJETS.forEach(function (p, i) {
    var a = document.createElement('a');
    a.className = 'proj';
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener';

    var num = String(i + 1).padStart(2, '0');
    var apercu = p.image
      ? '<img class="proj__image" src="' + racine + p.image + '" alt="" ' +
        'width="1770" height="600" loading="lazy">'
      : '<span class="proj__gabarit"><span class="proj__gabarit-texte">' +
        manquante + '</span></span>';

    a.innerHTML =
      '<span class="proj__rangee">' +
        '<span class="proj__num">' + num + '</span>' +
        '<span class="proj__nom">' + p.nom + '</span>' +
        '<span class="proj__secteur">' + p.secteur + '</span>' +
        '<span class="proj__visiter">' + etiquette + '&nbsp;&rarr;</span>' +
      '</span>' +
      '<span class="proj__apercu">' + apercu + '</span>';

    liste.appendChild(a);
  });
})();
