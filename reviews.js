/* S-WEB : avis clients.

   Source unique. Ajouter un avis = ajouter un objet au tableau de la langue
   concernee, rien d'autre. La grille s'adapte seule au nombre de cartes.

   Un seul fichier partage par les deux langues, comme tous les autres
   scripts du site : les pages de en/ chargent ../reviews.js. La langue est
   lue sur <html lang> plutot que passee en data-attribut, parce que le
   texte des avis est trop long pour tenir dans un attribut. */
(function () {
  'use strict';

  var AVIS = {
    fr: [
      { rating: 5, label: 'Client vérifié',
        text: '« Une entreprise professionnelle, sérieuse et à l’écoute de ses clients. Une expérience très satisfaisante, avec un service de qualité et un accompagnement efficace du début à la fin. Je recommande vivement S-WEB pour son professionnalisme et la qualité de son travail. »' },
      { rating: 5, label: 'Client vérifié',
        text: '« Très rapide, et excellent. »' }
    ],
    en: [
      { rating: 5, label: 'Verified client',
        text: '“A professional, serious company that listens to its clients. A very satisfying experience, with quality service and effective support from start to finish. I highly recommend S-WEB for its professionalism and the quality of its work.”' },
      { rating: 5, label: 'Verified client',
        text: '“Very fast, and excellent.”' }
    ]
  };

  var ETOILE = 'M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6L12 16.9 6.6 19.7l1-6L3.2 9.4l6.1-.9z';

  var liste = document.querySelector('.avis__liste');
  if (!liste) return;

  var lang = (document.documentElement.lang || 'fr').slice(0, 2);
  var avis = AVIS[lang] || AVIS.fr;

  var gabarit = liste.getAttribute('data-note') || 'Note : {n} sur 5 étoiles';

  function etoiles(n) {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      var pleine = i <= n;
      out += '<svg class="avis__etoile" viewBox="0 0 24 24" width="16" height="16" ' +
             'aria-hidden="true" focusable="false">' +
             '<path d="' + ETOILE + '" fill="' + (pleine ? 'currentColor' : 'none') +
             '" stroke="currentColor" stroke-width="1.5" stroke-linejoin="miter"/></svg>';
    }
    return out;
  }

  liste.innerHTML = '';

  avis.forEach(function (a) {
    var carte = document.createElement('article');
    carte.className = 'avis';
    carte.innerHTML =
      '<p class="avis__note" role="img" aria-label="' +
        gabarit.replace('{n}', a.rating) + '">' + etoiles(a.rating) + '</p>' +
      '<blockquote class="avis__citation"><p>' + a.text + '</p></blockquote>' +
      '<p class="avis__etiquette">' + a.label + '</p>';
    liste.appendChild(carte);
  });
})();
