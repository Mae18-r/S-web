/* S-WEB — retour en haut. Le bouton n'apparait qu'une fois l'en-tete sortie
   de l'ecran : en haut de page il n'aurait rien a faire.

   L'observateur porte sur l'en-tete existante plutot que sur un jalon ajoute
   pour l'occasion, et il n'y a aucun ecouteur de defilement.

   Sans JS le lien reste un <a href="#entete"> : il saute en haut, il est
   simplement toujours visible. */
(function () {
  'use strict';

  var bouton = document.querySelector('.haut');
  var entete = document.querySelector('.entete');
  if (!bouton || !entete || !window.IntersectionObserver) return;

  new IntersectionObserver(function (e) {
    bouton.classList.toggle('est-visible', !e[0].isIntersecting);
  }, { threshold: 0 }).observe(entete);

  bouton.addEventListener('click', function (e) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;  /* saut natif */
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    /* on ne laisse pas #entete trainer dans la barre d'adresse */
    history.replaceState(null, '', location.pathname + location.search);
  });
})();
