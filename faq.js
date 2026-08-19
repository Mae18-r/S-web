/* S-WEB — FAQ en accordeon. Plusieurs reponses peuvent rester ouvertes en
   meme temps : ouvrir l'une n'en ferme aucune autre.

   Le script ne fait que basculer aria-expanded et une classe ; l'ouverture
   elle-meme est une transition CSS sur grid-template-rows, donc aucune
   hauteur n'est calculee ici et rien ne touche au defilement.

   Le declencheur est un <button> natif : Entree et Espace fonctionnent sans
   qu'on ait a les gerer. */
(function () {
  'use strict';

  var items = [].slice.call(document.querySelectorAll('.faq__item'));
  if (!items.length) return;

  items.forEach(function (item) {
    var declencheur = item.querySelector('.faq__declencheur');
    if (!declencheur) return;

    declencheur.addEventListener('click', function () {
      var ouvert = declencheur.getAttribute('aria-expanded') === 'true';
      declencheur.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
      item.classList.toggle('est-ouvert', !ouvert);
    });
  });
})();
