
# Phase 2 — Branchement du back-end

## Objectif
Passer le MVP de "formulaires factices avec toast" à un vrai back-end : stockage des demandes en base, notification email au salon, et un mini back-office protégé pour Hanny.

## 1. Activer Lovable Cloud
Active Lovable Cloud (base PostgreSQL + auth + email + functions intégrés, sans compte externe).

## 2. Schéma de base de données

Trois tables, une par type de demande, pour rester simple et lisible côté admin.

```text
contact_messages
  id, created_at, name, email, phone?, subject?, message, status

appointment_requests   (perruques médicalisées)
  id, created_at, full_name, email, phone, preferred_date?, prescription (bool),
  message?, status

product_inquiries
  id, created_at, product_slug, product_name, name, email, phone?, message, status
```

`status` : `new | read | handled` (par défaut `new`).

**RLS** :
- Insertion publique (`anon` + `authenticated`) autorisée — ce sont des formulaires publics.
- Lecture / mise à jour réservées au rôle `admin` (via table `user_roles` + fonction `has_role`).

## 3. Wiring des formulaires
Remplacer le `toast` factice dans :
- `src/routes/contact.tsx`
- `src/routes/perruques-medicalisees.tsx`
- `src/routes/boutique.$productSlug.tsx`

Par un appel à un `createServerFn` qui :
1. Valide les données avec Zod (côté serveur).
2. Insère en base via `supabaseAdmin` (les formulaires sont publics, pas d'utilisateur connecté).
3. Déclenche un email transactionnel au salon (voir §4).
4. Retourne `{ ok: true }` → toast de succès, sinon toast d'erreur.

## 4. Notifications email
Utiliser **Lovable Email** (intégré) pour envoyer à `contact@hannytresse.fr` (configurable) un récap à chaque soumission :
- Sujet : ex. "Nouvelle demande perruque médicalisée — Marie D."
- Corps : tous les champs du formulaire + lien vers le back-office.

Reply-To = email du client → Hanny peut répondre directement depuis sa boîte.

## 5. Mini back-office `/admin`
Route protégée `src/routes/_authenticated/admin.tsx` :
- Login email/mot de passe (compte créé manuellement pour Hanny).
- 3 onglets : Contacts / RDV perruques / Demandes produits.
- Liste triée par date, badge de statut, clic = détail + bouton "marquer comme traité".
- Aucune exposition publique.

## 6. Hors-scope (gardé pour plus tard)
- Réservation en ligne avec calendrier temps réel.
- Paiement Stripe / boutique e-commerce complète.
- Compte client public.
- Migration des `products`/`services` vers la base (ils restent dans `src/data/` pour ce MVP — éditables par code).

## Détails techniques

- **Server functions** : `src/lib/submissions.functions.ts` (3 fonctions : `submitContact`, `submitAppointment`, `submitProductInquiry`). Helpers email dans `src/lib/email.server.ts`.
- **Admin queries** : `src/lib/admin.functions.ts` avec `requireSupabaseAuth` + check `has_role(user, 'admin')`.
- **Migrations** : 3 tables + enum `app_role` + table `user_roles` + fonction `has_role` + policies RLS.
- **Email destinataire** : stocké dans un secret `SALON_NOTIFICATION_EMAIL` (modifiable sans redeploy).

## Question avant de lancer
OK pour ce périmètre ? Deux points à confirmer :
1. **Email destinataire** des notifications : `contact@hannytresse.fr` ou une autre adresse ?
2. **Back-office admin** : on l'inclut maintenant, ou tu préfères que les demandes arrivent uniquement par email pour le MVP (plus rapide, on ajoute l'admin plus tard) ?
