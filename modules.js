/* S-WEB, les modules de la page Services.

   Trois choses ici : les panneaux qui se deplient, les cartes qu'on
   selectionne, et la barre qui apparait des qu'une carte est choisie.

   Sans JavaScript, les trois panneaux restent ouverts et toutes les cartes
   restent lisibles : l'etat replie est pose par ce script, jamais par la
   feuille de style. Les boutons d'ajout ne servent alors a rien, mais le lien
   « Reserver un appel » de fin de section, lui, fonctionne toujours.

   La selection survit a la navigation par localStorage. Elle est relue par
   formulaire.js, qui pre-remplit la demande sur la page Contact. */
(function () {
  'use strict';

  var CLE = 'sweb-modules';
  var section = document.querySelector('.modules__groupes');
  if (!section) return;

  var racine = section.closest('.sect') || document;
  var anglais = (document.documentElement.lang || 'fr').slice(0, 2) === 'en';

  var MOTS = anglais ? {
    ajouter: 'Add to my request',
    ajoute: 'Added',
    un: 'module selected',
    plusieurs: 'modules selected',
    effacer: 'Clear all',
    demander: 'Request a quote for this selection',
    region: 'Your selection'
  } : {
    ajouter: 'Ajouter à ma demande',
    ajoute: 'Ajouté',
    un: 'module sélectionné',
    plusieurs: 'modules sélectionnés',
    effacer: 'Tout effacer',
    demander: 'Demander une soumission pour cette sélection',
    region: 'Votre sélection'
  };

  var DESTINATION = anglais ? '/en/contact' : '/contact';

  /* --- Memoire ----------------------------------------------------------
     localStorage leve une exception en navigation privee sur certains
     navigateurs : on ne laisse jamais ca casser la page. */
  function lu() {
    try {
      var v = localStorage.getItem(CLE);
      return v ? v.split(',').filter(Boolean) : [];
    } catch (e) { return []; }
  }

  function ecrit(liste) {
    try {
      if (liste.length) localStorage.setItem(CLE, liste.join(','));
      else localStorage.removeItem(CLE);
    } catch (e) { /* tant pis */ }
  }

  /* --- Les panneaux ------------------------------------------------------ */

  var groupes = [].slice.call(section.querySelectorAll('.grp'));

  groupes.forEach(function (g, i) {
    var b = g.querySelector('.grp__declencheur');

    /* Le premier reste ouvert, les autres se replient. C'est ici que l'etat
       replie apparait : sans JS, les trois restent ouverts. */
    if (i > 0) {
      g.dataset.ouvert = 'false';
      b.setAttribute('aria-expanded', 'false');
    }

    b.addEventListener('click', function () {
      var ouvert = g.dataset.ouvert === 'true';
      g.dataset.ouvert = ouvert ? 'false' : 'true';
      b.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
    });
  });

  /* --- La selection ------------------------------------------------------ */

  var cartes = [].slice.call(racine.querySelectorAll('[data-slug]'));
  var choisis = lu().filter(function (s) {
    return cartes.some(function (c) { return c.dataset.slug === s; });
  });

  function nomDe(slug) {
    var c = cartes.filter(function (x) { return x.dataset.slug === slug; })[0];
    return c ? c.dataset.nom : slug;
  }

  function peint() {
    cartes.forEach(function (c) {
      var actif = choisis.indexOf(c.dataset.slug) !== -1;
      var b = c.querySelector('.mod__ajout');
      c.dataset.choisi = actif ? 'true' : 'false';
      b.setAttribute('aria-pressed', actif ? 'true' : 'false');
      b.querySelector('.mod__ajout-texte').textContent = actif ? MOTS.ajoute : MOTS.ajouter;
    });
    majBarre();
    ecrit(choisis);
  }

  cartes.forEach(function (c) {
    c.querySelector('.mod__ajout').addEventListener('click', function () {
      var i = choisis.indexOf(c.dataset.slug);
      if (i === -1) choisis.push(c.dataset.slug);
      else choisis.splice(i, 1);
      peint();
    });
  });

  /* --- La barre ----------------------------------------------------------
     Construite ici plutot qu'ecrite dans la page : elle n'a de sens que si le
     JavaScript tourne, puisque c'est lui qui compte la selection. */
  var barre = document.createElement('div');
  barre.className = 'barre-sel';
  barre.setAttribute('role', 'region');
  barre.setAttribute('aria-label', MOTS.region);
  barre.hidden = true;
  barre.innerHTML =
    '<div class="barre-sel__contenu">' +
      '<p class="barre-sel__compte">' +
        '<span class="barre-sel__n"></span> ' +
        '<button class="barre-sel__effacer" type="button"></button>' +
      '</p>' +
      '<a class="bouton bouton--primaire barre-sel__cta" href="' + DESTINATION + '">' +
        '<span class="bouton__texte"></span>' +
        '<svg class="bouton__fleche" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" ' +
        'focusable="false"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" ' +
        'stroke-width="2.25"/></svg>' +
      '</a>' +
    '</div>';
  document.body.appendChild(barre);

  var compteur = barre.querySelector('.barre-sel__n');
  var effacer = barre.querySelector('.barre-sel__effacer');
  var cta = barre.querySelector('.barre-sel__cta');
  effacer.textContent = MOTS.effacer;
  cta.querySelector('.bouton__texte').textContent = MOTS.demander;

  effacer.addEventListener('click', function () {
    choisis.length = 0;
    peint();
  });

  /* La barre est fixee en bas : sans cette reserve elle recouvre la fin de la
     page, et notamment les liens legaux du pied. On prend sa hauteur reelle
     plutot qu'une valeur en dur, puisqu'elle passe sur deux lignes en petit
     ecran. */
  function reserveLaPlace() {
    document.body.style.paddingBottom = barre.hidden ? '' : barre.offsetHeight + 'px';
  }

  function majBarre() {
    var n = choisis.length;
    barre.hidden = n === 0;
    document.body.classList.toggle('a-barre-sel', n > 0);
    reserveLaPlace();
    if (!n) return;
    compteur.textContent = n + ' ' + (n > 1 ? MOTS.plusieurs : MOTS.un);
    /* Les slugs vont en parametre, l'ancre apres : un fragment se place
       toujours en dernier dans une adresse. */
    cta.href = DESTINATION + '?modules=' + encodeURIComponent(choisis.join(',')) + '#reserver';
  }

  /* La hauteur de la barre change avec la largeur de l'ecran. */
  if (window.ResizeObserver) new ResizeObserver(reserveLaPlace).observe(barre);
  else window.addEventListener('resize', reserveLaPlace);

  peint();
})();
