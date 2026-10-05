/* S-WEB, index des realisations.

   Source unique : pour ajouter un projet, ajouter un objet a ce tableau.
   `image: null` fait basculer la ligne sur le gabarit raye automatiquement.

   Ordre : les sites qui ont leur propre domaine passent devant ceux qui
   vivent encore sur une adresse Vercel ou Netlify.

   Le secteur est donne dans les deux langues et choisi d'apres le `lang` de
   la page : le meme fichier sert /portfolio et /en/portfolio.

   Les captures ne se replient plus : les sept sont visibles d'un coup, en
   galerie. La carte grandit au survol, en CSS seul. */
(function () {
  'use strict';

  var PROJETS = [
    { nom: 'Paramédika',
      secteur: { fr: 'Clinique médico-esthétique', en: 'Medical aesthetics clinic' },
      url: 'https://beauteparamedika.com',
      image: 'assets/work/paramedikahero.jpg' },
    { nom: 'Chi Medical Aesthetics',
      secteur: { fr: 'Injections et soins de la peau', en: 'Injectables and skin care' },
      url: 'https://chimedicalaesthetics.com',
      image: 'assets/work/chihero.jpg' },
    { nom: 'Déclic',
      secteur: { fr: 'Conférences et événements', en: 'Conferences and events' },
      url: 'https://declicnow.com',
      image: 'assets/work/declichero.jpg' },
    { nom: 'Média Connexion',
      secteur: { fr: 'Musique et booking', en: 'Music and booking' },
      url: 'https://www.médiaconnexion.com',
      image: 'assets/work/mediaconnexionhero.jpg' },
    { nom: 'Seiko Loyalty',
      secteur: { fr: 'Mode et commerce en ligne', en: 'Fashion and online retail' },
      url: 'https://seikoloyalty.vercel.app',
      image: 'assets/work/seikohero.jpg' },
    { nom: 'X.Vision',
      secteur: { fr: 'Studio audiovisuel', en: 'Audiovisual studio' },
      url: 'https://xvision-flame.vercel.app',
      image: 'assets/work/xvisionhero.jpg' },
    { nom: 'Pose ta Pierre',
      secteur: { fr: 'Photographie', en: 'Photography' },
      url: 'https://symphonious-seahorse-b42192.netlify.app/#accueil',
      image: 'assets/work/Posetapierrehero.jpg' }
  ];

  var liste = document.querySelector('.index-proj');
  if (!liste) return;

  var langue = (document.documentElement.lang || 'fr').slice(0, 2) === 'en' ? 'en' : 'fr';
  var racine = liste.getAttribute('data-racine') || '';
  var etiquette = liste.getAttribute('data-visiter') || 'Visiter';
  var manquante = liste.getAttribute('data-manquante') || '';
  var gabaritAlt = langue === 'en' ? 'Home page of the %s site'
                                   : 'Page d\'accueil du site %s';

  function echappe(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  liste.innerHTML = '';

  PROJETS.forEach(function (p) {
    var a = document.createElement('a');
    a.className = 'proj';
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener';

    var apercu = p.image
      ? '<img class="proj__image" src="' + racine + p.image + '" ' +
        'alt="' + echappe(gabaritAlt.replace('%s', p.nom)) + '" loading="lazy">'
      : '<span class="proj__gabarit"><span class="proj__gabarit-texte">' +
        echappe(manquante) + '</span></span>';

    a.innerHTML =
      '<span class="proj__apercu">' + apercu + '</span>' +
      '<span class="proj__rangee">' +
        '<span class="proj__nom">' + echappe(p.nom) + '</span>' +
        '<span class="proj__secteur">' + echappe(p.secteur[langue]) + '</span>' +
        '<span class="proj__visiter">' + echappe(etiquette) + '&nbsp;&rarr;</span>' +
      '</span>';

    liste.appendChild(a);
  });
})();
