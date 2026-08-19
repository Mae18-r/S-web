# S-WEB — Spec sheet du site
## Système de design / blocs de construction

**Version 1.0 · 2026-08-06 · INTERNE**
Base : Charte graphique v1.0 (2026-07-27). Cible : site public codé à la main (HTML/CSS/JS). Ce document traduit la charte en tokens et composants exécutables. Les décisions prises ici qui ne figurent pas dans la charte sont marquées **[DÉCISION]** et récapitulées en section 16.

---

## 01 — Fondations

Le site applique la charte sans la réinterpréter : base quasi-noire, un seul accent, angles droits, grille stricte, espace blanc structurant. Le principe directeur pour chaque composant : **l'Ambre pointe, il ne décore pas.** Toute surface, tout texte, tout état par défaut est neutre ; l'orange n'apparaît que là où il y a une action ou une donnée.

Règle de ratio héritée de la charte et applicable à chaque écran rendu : ≥ 90 % Encre + Blanc cassé + neutres, ≤ 5 % Ambre.

---

## 02 — Couleurs

### Tokens

```css
:root {
  /* Palette charte */
  --encre:           #14161A;  /* texte, fonds sombres, logo */
  --blanc-casse:     #F6F5F1;  /* fond de page */
  --gris-structure:  #6B6E76;  /* bordures fortes, texte secondaire */
  --gris-brume:      #E8E7E2;  /* bordures légères, fonds de section */
  --ambre:           #FF5A1F;  /* accent unique — CTA, données */

  /* Tokens dérivés [DÉCISION] */
  --blanc:           #FFFFFF;  /* surface des cartes (observé dans la charte, non nommé) */
  --ambre-texte:     #C23A00;  /* ambre assombri, réservé au texte sur fond clair */
}
```

### Rôles

| Token | Usage | Ne jamais utiliser pour |
|---|---|---|
| `--encre` | Texte courant, titres, fond du footer, logo, hover des boutons | — |
| `--blanc-casse` | Fond de page, texte sur Encre | Cartes (utiliser `--blanc`) |
| `--blanc` | Face des cartes, champs de formulaire | Fond de page pleine largeur |
| `--gris-brume` | Bordures de cartes, séparateurs, fonds de bandeau discrets | Texte |
| `--gris-structure` | Texte secondaire, bordures de champs, métadonnées | Texte < 16 px sur Blanc cassé sans vérif |
| `--ambre` | Fond de bouton primaire, chiffres clés, marqueurs, soulignés | **Texte sur fond clair — interdit (échec WCAG)** |
| `--ambre-texte` | Liens texte accentués, états d'erreur, texte orange sur fond clair | Fonds |

### Contrastes vérifiés (WCAG 2.1)

| Paire | Ratio approx. | Verdict |
|---|---|---|
| Encre sur Blanc cassé | ~15:1 | AA/AAA — texte courant |
| Blanc cassé sur Encre | ~15:1 | AA/AAA — footer, sections sombres |
| Gris Structure sur Blanc cassé | ~4,7:1 | AA texte normal — limite, pas en dessous de 14 px |
| Encre sur Ambre | ~5,9:1 | AA — texte de bouton primaire |
| Ambre sur Encre | ~5,9:1 | AA — liens et chiffres sur fond sombre |
| **Ambre sur Blanc cassé** | **~2,9:1** | **ÉCHEC — même en grand texte. Point ouvert 02 de la charte : tranché, il échoue.** |
| Ambre-texte sur Blanc cassé | ~4,9:1 | AA texte normal |

Conséquence pratique : l'Ambre pur ne porte jamais de texte sur fond clair. Sur fond clair, un élément orange est soit un **fond** (bouton, plaque) avec texte Encre, soit un **trait graphique épais** (souligné 2–3 px, barre latérale ≥ 4 px), soit remplacé par `--ambre-texte`.

---

## 03 — Typographie

Conforme charte : **29LT Zaria Serif Bold** (display), **Arial** (corps), **IBM Plex Mono** (données). Fallback Courier New pour le mono, Georgia pour le display.

```css
--font-display: "29LT Zaria Serif", Georgia, serif;        /* Bold 700 uniquement */
--font-corps:   Arial, "Helvetica Neue", sans-serif;        /* 400 corps, 500 boutons/liens, 700 H3+ */
--font-mono:    "IBM Plex Mono", "Courier New", monospace;  /* 400/500 — données, jamais un titre */
```

### Échelle

Base 16 px = 1 rem. Corps volontairement à 17 px : Arial gagne en présence une taille au-dessus du défaut.

| Rôle | Fonte / graisse | Desktop | Mobile | Interligne | Espacement |
|---|---|---|---|---|---|
| H1 | Zaria Bold 700 | 56–64 px `clamp(2.5rem, 5vw + 1rem, 4rem)` | 36–40 px | 1.05 | −0.01em |
| H2 | Zaria Bold 700 | 36–40 px `clamp(1.75rem, 3vw + .5rem, 2.5rem)` | 28 px | 1.15 | −0.005em |
| H3 | Arial 700 | 20 px | 18 px | 1.3 | 0 |
| Eyebrow / label de section | Plex Mono 400, MAJUSCULES | 13 px | 13 px | 1.4 | +0.08em |
| Corps | Arial 400 | 17 px | 16 px | 1.6 | 0 |
| Corps secondaire | Arial 400, `--gris-structure` | 15 px | 15 px | 1.55 | 0 |
| Bouton / lien nav | Arial 500 | 16 px | 16 px | 1 | +0.01em |
| Donnée / méta | Plex Mono 400 | 15 px | 14 px | 1.5 | +0.02em |
| Chiffre clé | Zaria Bold 700 | 56–72 px | 44 px | 1 | −0.01em |

**[DÉCISION]** La charte écrit « Bold 700 → H1 uniquement ». Les gabarits de la charte elle-même composent pourtant leurs titres de section en serif. Interprétation retenue : Zaria Bold porte H1 **et** H2 ; Arial prend le relais à partir de H3. Confiance 70 % — à confirmer.

Règles : jamais de Zaria en dessous de 28 px. Jamais de Plex Mono en titre. Largeur de lecture max : 70 caractères (`max-width: 65ch` sur les paragraphes). Pas d'italique — la voix de la marque souligne avec la structure, pas l'inclinaison.

---

## 04 — Espacement, grille, mise en page

### Échelle d'espacement (base 8 px)

```css
--sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
--sp-5: 24px;  --sp-6: 32px;  --sp-7: 48px;  --sp-8: 64px;
--sp-9: 96px;  --sp-10: 128px;
```

### Grille

Conforme charte : 12 colonnes strictes.

| Propriété | Desktop (≥ 1024 px) | Tablette (640–1023) | Mobile (< 640) |
|---|---|---|---|
| Marges extérieures min. | 64 px | 40 px | 24 px |
| Gouttière | 24 px | 24 px | 16 px |
| Conteneur max | 1200 px | fluide | fluide |
| Colonnes | 12 | 8 | 4 |

### Rythme vertical

Sections : `padding-block: 96px` desktop, `56px` mobile. Entre un H2 et son contenu : 32 px. Entre eyebrow et titre : 12 px. Entre paragraphes : 16 px. L'espace blanc fait le travail de séparation ; on n'ajoute une bordure que si deux blocs de même nature se touchent.

---

## 05 — Rayons, bordures, ombres

```css
--radius-ui: 0;      /* boutons, cartes, champs, images : angles droits, sans exception */
--radius-icone: 2px; /* joints d'icônes uniquement (charte : 2–4 px max) */

--bordure-legere: 1px solid var(--gris-brume);      /* cartes, séparateurs */
--bordure-forte:  1px solid var(--gris-structure);  /* champs, tableaux */

--ombre-plate: 0 1px 0 rgba(20, 22, 26, 0.06);      /* la seule ombre autorisée */
```

Défaut : pas d'ombre du tout — la hiérarchie se fait par bordure et par fond. `--ombre-plate` est réservée aux éléments flottants (menu mobile ouvert, éventuel sticky). Une seule, plate, jamais empilée (interdit charte).

---

## 06 — Boutons

Hauteur 48 px, padding horizontal 24 px, `--radius-ui: 0`, Arial 500 16 px. Un seul bouton primaire visible par écran.

| Variante | Défaut | Hover | Focus visible | Désactivé |
|---|---|---|---|---|
| **Primaire** | fond `--ambre`, texte `--encre` | fond `--encre`, texte `--blanc-casse` | contour 2 px `--encre`, décalage 2 px | fond `--gris-brume`, texte `--gris-structure` |
| **Secondaire** | transparent, bordure 1 px `--encre`, texte `--encre` | fond `--encre`, texte `--blanc-casse` | idem | bordure et texte `--gris-structure` |
| **Tertiaire (lien-action)** | texte `--encre` + trait inférieur 2 px `--ambre` | texte `--ambre-texte`, trait maintenu | idem | `--gris-structure`, sans trait |

Transitions : `background-color, color, border-color 160ms ease-out`. Pas de translation, pas de scale, pas de changement d'ombre au hover — le mouvement n'est pas dans le vocabulaire de la marque.

Sur fond Encre (footer) : le primaire reste Ambre/Encre (contraste validé) ; le secondaire passe en bordure `--blanc-casse`.

---

## 07 — Liens

Dans le corps de texte : texte `--encre`, souligné 2 px `--ambre`, `text-underline-offset: 3px`. Hover : le texte passe à `--ambre-texte`, le souligné reste. Sur fond Encre : texte `--blanc-casse`, souligné `--ambre`, hover texte `--ambre` (validé ~5,9:1).

Jamais de lien orange nu sur fond clair — c'est la conséquence directe de l'échec de contraste mesuré en section 02.

---

## 08 — Navigation / header

**Desktop.** Barre 72 px, fond `--blanc-casse`, bordure inférieure 1 px `--gris-brume`. Pas de sticky par défaut **[DÉCISION]** : la marque est posée, pas insistante ; à réévaluer si les pages dépassent trois écrans de haut. À gauche : badge S (28 px) + wordmark S-WEB. À droite : liens Arial 500 16 px `--encre`, espacés de 40 px, puis le téléphone en Plex Mono `--gris-structure`, puis le CTA primaire en version 40 px. Lien hover : souligné 2 px `--ambre`, offset 6 px. Page active : souligné persistant.

**Mobile (< 640).** Barre 64 px, badge + wordmark, bouton menu en icône outline 24 px trait 1,5 px (jamais un hamburger arrondi « friendly »). Panneau : pleine largeur sous la barre, fond `--blanc-casse`, `--ombre-plate`, liens 20 px Arial 500 empilés avec séparateurs `--gris-brume`, CTA primaire pleine largeur en bas de panneau, téléphone en mono. Ouverture : 240 ms ease-out, translation verticale simple.

**Bilingue.** Commutateur FR/EN en texte mono 13 px MAJUSCULES dans la nav, à gauche du téléphone : `FR / EN`, langue active en `--encre`, inactive en `--gris-structure`. Pas de drapeaux.

---

## 09 — Footer

Fond `--encre`, texte `--blanc-casse` — c'est la seule surface sombre du site public, elle assoit la fin de page comme la couverture de la charte. Badge S en version blanche. Colonnes : identité + descripteur, liens de navigation, coordonnées en Plex Mono (téléphone, courriel, `45.4215° N, 75.6972° O` — la coordonnée géographique est un marqueur de marque, elle dit « local » en langage d'ingénieur). Mentions légales en mono 13 px `--gris-structure`. Liens : règle de la section 07, variante fond sombre.

---

## 10 — Cartes et blocs de contenu

**Carte standard** (services, étapes) : fond `--blanc`, bordure `--bordure-legere`, padding 32 px, radius 0, sans ombre. Titre H3 Arial 700, corps 15–17 px. Si la carte est cliquable : bordure hover `--gris-structure` + curseur — pas d'élévation.

**Carte statistique** (le bloc « +40 % » du gabarit) : eyebrow mono MAJUSCULES `--gris-structure`, chiffre en Zaria Bold `--encre` avec l'unité ou le symbole en `--ambre`, légende mono. C'est l'application canonique de « l'Ambre sert à pointer » : l'orange marque la donnée, pas le cadre.

**Bloc citation / encart** : fond `--gris-brume`, barre latérale 4 px `--ambre`, padding 24–32 px, label mono `--ambre-texte`, texte corps. Réplique de l'encart de la charte.

**Bandeau de section alterné** : pour rythmer une page longue, fond `--gris-brume` pleine largeur toutes les deux ou trois sections. Jamais deux bandeaux adjacents.

---

## 11 — Formulaires

Champs : hauteur 48 px, fond `--blanc`, bordure `--bordure-forte`, radius 0, padding 0 16 px, texte 16 px (minimum absolu — en dessous, iOS zoome). Label au-dessus, Arial 500 14 px `--encre`, marge 8 px. Aide : mono 13 px `--gris-structure`. Focus : bordure `--encre` + contour 2 px `--encre` décalé 2 px. Zone de texte : min 120 px.

Erreur **[DÉCISION]** : bordure et message en `--ambre-texte`, message en Arial 14 px, préfixé d'un marqueur `×` (vocabulaire des interdits de la charte). La palette ne contient pas de rouge ; introduire une sixième couleur pour les erreurs briserait la règle « un seul accent ». Confiance 60 % — si les tests utilisateurs montrent une confusion erreur/accent, un rouge dédié devra être tranché.

Le formulaire de contact type : Nom, Entreprise, Téléphone, Message, un seul bouton « Demander un audit ». Pas de placeholder porteur d'information (le placeholder disparaît à la saisie) ; l'exemple va dans l'aide en mono.

---

## 12 — Iconographie

Conforme charte : outline, trait 1,5–2 px, joints rayon 2 px, grille 24 px, couleur `--encre`. Rempli uniquement pour l'état actif. L'Ambre sur une icône signale un état, jamais une décoration. Jamais d'emoji. Jamais d'illustrations de personnages.

---

## 13 — Imagerie

Photos réelles de chantiers et de cliniques locales, lumière naturelle, cadrage droit, horizon jamais penché. Jamais de stock corporate. Ratios : 4:3 pour les vignettes, 16:9 pour les bandeaux. Traitement : aucun filtre, correction neutre uniquement. Logo sur photo : toujours sur plaque `--encre` (interdit charte : photo sans plaque de contraste). Texte sur photo : à éviter ; si nécessaire, sur plaque Encre pleine, jamais sur dégradé superposé.

---

## 14 — Mouvement

Le site est essentiellement statique ; le mouvement est un accusé de réception, pas un spectacle.

```css
--duree-micro: 160ms;  /* couleurs, bordures, soulignés */
--duree-panneau: 240ms; /* menu mobile, accordéons */
--courbe: cubic-bezier(0.2, 0, 0, 1); /* ease-out net, sans rebond */
```

Interdits : parallax, apparitions au scroll généralisées, compteurs animés, rebonds, hover qui déplace ou agrandit. Toléré : un fondu d'entrée unique sur le H1 au chargement (≤ 400 ms), et uniquement lui. `prefers-reduced-motion: reduce` désactive tout.

---

## 15 — Accessibilité (plancher non négociable)

Texte courant ≥ 4,5:1, grand texte et éléments graphiques ≥ 3:1 — voir table section 02. Focus visible sur tout élément interactif (contour 2 px `--encre`, décalage 2 px ; sur fond Encre : contour `--blanc-casse`). Navigation complète au clavier, ordre logique. `lang="fr"` / `lang="en"` correct par page — les lecteurs d'écran bilingues en dépendent. Cibles tactiles ≥ 44 px. Un seul H1 par page.

---

## 16 — Décisions prises dans ce document et points ouverts

| # | Décision | Statut / confiance |
|---|---|---|
| 01 | `--blanc` #FFFFFF ajouté comme surface de carte — la charte le montre sans le nommer | 70 % — à valider |
| 02 | `--ambre-texte` #C23A00 créé ; l'Ambre pur échoue au contraste texte sur fond clair (point ouvert 02 de la charte : tranché) | Mesuré — reste à vérifier sur écrans réels |
| 03 | Zaria Bold porte H1 + H2, pas seulement H1 | 70 % — contredit la lettre de la charte, suit sa pratique |
| 04 | Erreurs de formulaire en `--ambre-texte`, pas de rouge ajouté | 60 % — à tester |
| 05 | Header non sticky | Réversible |
| 06 | Descripteur « agency » conservé dans le lockup (décision Maé, 2026-08-06) — tension non résolue avec l'interdit « tagline soudée au logo » et avec la neutralité linguistique du wordmark | Risque accepté, à réévaluer |
| 07 | Portée du site (une page vs multi-pages) et usage de sections sombres hors footer : **non tranchés** — ce document suppose un site multi-pages léger (Services / Résultats / Contact) et un site clair avec footer Encre | En attente |
