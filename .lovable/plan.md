# Plan — Fiches détail Perruques médicalisées

## Objectif
Ajouter un vrai catalogue de perruques médicales sur `/perruques-medicalisees`, avec fiches détaillées sous `/boutique/$slug` adaptées au contexte médical (essayage + question, pas commande).

## 1. Enrichir le catalogue (`src/data/products.ts`)
Garder les 2 modèles existants et ajouter 3 nouveaux modèles médicaux (réutilisation des images `product-wig-1.jpg` et `product-wig-2.jpg`) :
- **Perruque médicale — Courte carré** (lisse, 25 cm, lace front, ~590 €)
- **Perruque médicale — Longue avec frange** (lisse, 45 cm, monture confort, ~750 €)
- **Perruque médicale — Coloration châtain miel** (mi-longue, fibres premium, ~560 €)

Chaque produit garde la structure existante (`hairType`, `length`, `price`, `highlights`, `inStock`).

Helper ajouté : `getMedicalWigs()` qui filtre `category === "Perruques médicales"`.

## 2. Listing sur `/perruques-medicalisees`
Insérer une nouvelle section **"Nos modèles disponibles"** entre la pédagogie (3 cards) et "Votre parcours en 5 étapes" :
- Grille responsive 1 / 2 / 3 colonnes
- Cards produit : image, nom, longueur, prix indicatif, badge "Éligible Sécu", lien vers `/boutique/$slug`
- Note explicative : « Prix avant remboursement Sécu (classe I : -350 €) »
- CTA secondaire en bas : "Voir toutes les perruques médicales" (ancre interne, ou suppression si tout est déjà visible)

## 3. Adapter la fiche `/boutique/$productSlug`
Détection médicale via `product.category === "Perruques médicales"`. Quand vraie :
- **Encart Sécu** sous le prix : "Classe I : 350 € pris en charge à 100% par la Sécurité sociale. Reste à charge ~{price - 350} €."
- **Double CTA principal côte à côte** (remplace l'actuel "Commander ce produit") :
  - Primary : **Réserver un essayage** → `Link` vers `/reservation`
  - Outline : **Poser une question** → ouvre/affiche le formulaire (même `submitProductInquiry`, libellé "Question sur ce modèle")
- **Texte d'intro formulaire** adapté : "Une question sur ce modèle ? Notre équipe vous répond sous 24h."
- **Fil d'Ariane** : ajouter un retour conditionnel vers `/perruques-medicalisees` au lieu de `/boutique` quand catégorie médicale.

Les produits non-médicaux conservent leur comportement actuel (commande produit).

## 4. SEO
Les `head()` de `boutique.$productSlug.tsx` restent corrects (titre = nom produit). Pour la nouvelle section sur `/perruques-medicalisees`, pas de changement de `head()` nécessaire — la page existe déjà avec ses meta.

## Fichiers touchés
- `src/data/products.ts` — +3 produits, +helper `getMedicalWigs()`
- `src/routes/perruques-medicalisees.tsx` — +section listing
- `src/routes/boutique.$productSlug.tsx` — branche conditionnelle médicale (encart Sécu + double CTA + retour)

## Hors périmètre
- Pas de modification base de données / RLS
- Pas de génération d'images (réutilisation des assets existants)
- Pas de changement du flow `/reservation` ni `/admin`
