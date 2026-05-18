# MVP Hanny Tresse — Phase 1 : Front-end uniquement

Construction de tout le front-end statique avec données mockées (TypeScript). Aucune activation de Lovable Cloud, aucune base de données, aucun formulaire connecté. Les formulaires affichent un toast de confirmation factice. Le back-end sera ajouté en phase 2 après ton approbation visuelle.

## 1. Design system (src/styles.css)

Palette terre / cuivre / or + blanc cassé, tout en `oklch` :
- `--background` : blanc cassé chaud (crème)
- `--foreground` : brun très sombre
- `--primary` : cuivre profond (CTA, accents forts)
- `--accent` : or doux
- `--secondary` : sable / terre claire
- `--muted` : beige neutre
- Radius : 14px par défaut
- Typo : titres en serif chaleureux (Fraunces ou Cormorant via Google Fonts), corps en sans-serif lisible (Inter)
- Mobile-first, contraste AA, focus visible

## 2. Routes (TanStack Start, un fichier par page)

| Route | Fichier |
|---|---|
| `/` | `src/routes/index.tsx` (remplace le placeholder) |
| `/coiffure-afro` | `src/routes/coiffure-afro.tsx` |
| `/perruques-medicalisees` | `src/routes/perruques-medicalisees.tsx` |
| `/boutique` | `src/routes/boutique.tsx` |
| `/boutique/$productSlug` | `src/routes/boutique.$productSlug.tsx` |
| `/a-propos` | `src/routes/a-propos.tsx` |
| `/contact` | `src/routes/contact.tsx` |

Chaque route a son propre `head()` (title, description, og:title, og:description) — pas de copier-coller du root.

## 3. Composants partagés (`src/components/`)

- `SiteHeader` : logo "Hanny Tresse", nav (Accueil, Coiffure afro, Perruques médicalisées, Boutique, À propos, Contact), CTA "Prendre RDV", menu mobile (Sheet shadcn).
- `SiteFooter` : adresse, horaires, liens sociaux (Facebook, Planity), liens rapides, mentions.
- `Hero` (accueil).
- `ServiceCard`, `SpecialtyCard`, `TestimonialCard`, `ProductCard`.
- `StepsList` (parcours Sécu / parcours patient).
- `FAQAccordion` (shadcn Accordion).
- `ContactActions` : boutons Tél / WhatsApp / "Prendre RDV".
- Layout dans `__root.tsx` : insérer `<SiteHeader />` + `<Outlet />` + `<SiteFooter />` (en conservant `Scripts`, `HeadContent`, `Outlet`).

## 4. Données mockées (TypeScript)

Fichiers `src/data/` :
- `services.ts` : ~8 prestations coiffure afro (nom, catégorie, description, durée, prix indicatif).
- `products.ts` : ~6 produits (perruques médicales, extensions, soins) avec slug, image, type cheveux, longueur, prix, dispo.
- `testimonials.ts` : 3 témoignages factices.
- `faq.ts` : 5–6 questions sur Sécu / mutuelle.
- `salonInfo.ts` : adresse Perpignan (placeholder), horaires, numéro tél / WhatsApp (placeholders à remplacer).

Pages lisent directement ces tableaux. Fiche produit : `src/data/products.ts` exporte `getProductBySlug(slug)`.

## 5. Contenu par page

**Accueil** : hero (slogan + photo + 2 CTA), "Nos spécialités" (3 cartes), "Pourquoi nous choisir" (4 points), témoignages (3), "Comment se déroule une prise en charge Sécu" (4 étapes), CTA final.

**Coiffure afro** : intro, grille de prestations (cartes avec durée + prix), CTA RDV.

**Perruques médicalisées** : pédagogie Sécu, parcours patient en 5 étapes, FAQ accordion, formulaire dédié (nom, contact, situation, centre d'oncologie, créneau) → mock submit.

**Boutique** : filtres par catégorie (perruques / extensions / soins), grille de cartes produits cliquables.

**Fiche produit** : galerie + description + caractéristiques + bouton "Demander ce produit" → mock submit.

**À propos** : histoire de Hanny, valeurs, adresse + horaires, iframe Google Maps (placeholder), liens Facebook / Planity.

**Contact** : formulaire (nom, email, tél, message) → mock submit + boutons Tél / WhatsApp.

## 6. Images

Génération de 4–5 visuels chaleureux placés dans `src/assets/` :
- Hero accueil (salon / coiffure afro)
- Visuel perruques médicalisées
- Visuel boutique
- 2–3 visuels produits génériques réutilisables

## 7. Formulaires (mock)

`react-hook-form` + `zod` pour la validation côté client.
À la soumission : `toast.success(...)` via sonner + reset. Aucune requête réseau. Un commentaire `// TODO Phase 2: brancher au backend` est laissé dans chaque handler.

## 8. SEO / accessibilité

- Un seul `<h1>` par page, hiérarchie correcte.
- `alt` sur toutes les images.
- Labels explicites sur tous les champs de formulaire.
- `head()` unique par route.

## 9. Hors périmètre de cette phase

- Pas de Lovable Cloud, pas de tables, pas de server functions.
- Pas de paiement, pas d'auth.
- Pas d'envoi réel d'email / WhatsApp depuis les formulaires.

## Phase 2 (après ton approbation visuelle)

Activation Lovable Cloud + tables (`appointment_requests`, `wig_requests`, `contact_messages`, `product_inquiries`, éventuellement `products` / `services` si tu veux les éditer sans redéploiement) + server functions + brancher les formulaires.

## À confirmer avant Phase 2 (pas bloquant pour le front)

- Numéro de téléphone / WhatsApp réel
- Adresse exacte du salon à Perpignan
- Liens Facebook et Planity
- Si tu veux à terme un mini back-office, ou si la gestion via le dashboard Cloud te suffit

Si tu valides, j'attaque par le design system + layout (header/footer) + page d'accueil, puis j'enchaîne les autres pages.
