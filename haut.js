/* S-WEB, retour en haut. Le bouton n'apparait qu'une fois l'en-tete sortie
   de l'ecran : en haut de page il n'aurait rien a faire. Il se retire des
   que le bas du pied de page entre dans l'ecran, sinon il se pose sur les
   liens legaux, qui occupent le meme coin.

   Les observateurs portent sur des elements existants plutot que sur des
   jalons ajoutes pour l'occasion, et il n'y a aucun ecouteur de defilement.

   Sans JS le lien reste un <a href="#entete"> : il saute en haut, il est
   simplement toujours visible. */
(function () {
  'use strict';

  var bouton = document.querySelector('.haut');
  var entete = document.querySelector('.entete');
  if (!bouton || !entete || !window.IntersectionObserver) return;

  var legal = document.querySelector('.pied__legal');
  var horsEntete = false;
  var surLegal = false;

  function applique() {
    bouton.classList.toggle('est-visible', horsEntete && !surLegal);
  }

  new IntersectionObserver(function (e) {
    horsEntete = !e[0].isIntersecting;
    applique();
  }, { threshold: 0 }).observe(entete);

  if (legal) {
    new IntersectionObserver(function (e) {
      surLegal = e[0].isIntersecting;
      applique();
    }, { threshold: 0 }).observe(legal);
  }

  bouton.addEventListener('click', function (e) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;  /* saut natif */
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    /* on ne laisse pas #entete trainer dans la barre d'adresse */
    history.replaceState(null, '', location.pathname + location.search);
  });
})();
