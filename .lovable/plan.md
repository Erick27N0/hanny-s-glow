## Objectif

Remplacer le formulaire libre de la page **Perruques médicalisées** par un vrai calendrier de réservation avec créneaux disponibles en temps réel, confirmation automatique après paiement d'un **acompte de 30€ via Stripe** (remboursable si annulation > 48h).

Le périmètre est volontairement **limité aux perruques médicalisées**. La coiffure afro garde le lien Instagram. Une seule coiffeuse (Hanny).

## Règles métier

- **Horaires** : mardi → samedi, 10h-18h. Lundi/dimanche fermés.
- **Durée** : 1 RDV = 60 min, créneaux toutes les heures pleines (10h, 11h, … 17h).
- **Anti-collision** : un créneau confirmé bloque le slot. Les réservations `pending_payment` bloquent le slot pendant 15 min (TTL) puis libèrent si paiement non finalisé.
- **Acompte** : 30€ via Stripe Checkout, déduits du prix final en salon. Remboursable si annulation > 48h avant le RDV (géré manuellement depuis `/admin` pour le MVP).
- **Jours fermés exceptionnels** : gérables depuis `/admin` (table `closed_dates`).

## Parcours utilisateur

```text
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ /perruques-medic…   │ →  │ Sélection créneau   │ →  │ Formulaire client   │
│ "Réserver un RDV"   │    │ (calendrier 14j)    │    │ (nom, email, tél)   │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                                                │
                                                                ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ /booking/success    │ ←  │ Stripe Checkout     │ ←  │ Création booking    │
│ (confirmation)      │    │ (acompte 30€)       │    │ status=pending      │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
        │ webhook
        ▼
   status=confirmed
```

## Schéma base de données

Nouvelle table `bookings` (séparée de `appointment_requests` qui reste pour les demandes libres) :

| Champ | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slot_start` | timestamptz | début du créneau (UTC) |
| `slot_end` | timestamptz | début + 60min |
| `full_name`, `email`, `phone` | text | client |
| `notes` | text? | situation, prescription |
| `status` | enum | `pending_payment` / `confirmed` / `cancelled` / `completed` |
| `stripe_session_id` | text? | pour webhook |
| `deposit_amount_cents` | int | 3000 |
| `expires_at` | timestamptz | `created_at + 15min` pour les `pending_payment` |
| `created_at` | timestamptz | |

Index unique partiel : `(slot_start) WHERE status IN ('pending_payment','confirmed') AND (status != 'pending_payment' OR expires_at > now())` → garantit qu'on ne peut pas réserver deux fois le même créneau.

Nouvelle table `closed_dates` :
| Champ | Type |
|---|---|
| `id` | uuid PK |
| `date` | date unique |
| `reason` | text? |

RLS :
- `bookings` : INSERT public, SELECT/UPDATE admin uniquement. Les créneaux occupés sont exposés via une **fonction RPC publique** `get_available_slots(from_date, to_date)` qui ne retourne **que** les heures occupées (pas les PII).
- `closed_dates` : SELECT public, INSERT/UPDATE/DELETE admin.

## Pages & composants front

- **`/perruques-medicalisees`** : remplacer le formulaire actuel par un CTA « Réserver un RDV ».
- **`/reservation`** (nouvelle route) :
  1. Étape 1 : calendrier 14 jours glissants, affichage des créneaux dispos en vert / occupés en gris.
  2. Étape 2 : formulaire client (Zod + react-hook-form, mêmes patterns que les autres formulaires).
  3. Étape 3 : redirect vers Stripe Checkout.
- **`/reservation/success`** : page de confirmation (lit le `session_id` en query, affiche détails).
- **`/reservation/cancel`** : page si abandon, propose de réessayer.

Composant calendrier : utiliser `react-day-picker` (déjà présent via shadcn `Calendar`). Pour les créneaux horaires, grille custom simple.

## Server functions (TanStack)

`src/lib/booking.functions.ts` :
- `getAvailableSlots({ from, to })` — public, retourne `{ date, slots: ['10:00', '11:00', …] }[]` en croisant horaires fixes + `closed_dates` + `bookings` actifs.
- `createPendingBooking({ slot_start, full_name, email, phone, notes })` — public, insère `pending_payment`, crée Stripe Checkout Session, retourne `{ url }`.
- `getBookingBySession({ session_id })` — public, pour la page success.

`src/lib/admin.functions.ts` (étendre) :
- `listBookings()` — admin
- `updateBookingStatus({ id, status })` — admin (pour annuler / marquer completed)
- `addClosedDate({ date, reason })` / `removeClosedDate({ id })` — admin

## Paiement Stripe

Activer **Lovable Payments via Stripe** (intégration native, pas de clé à fournir). Créer 1 produit Stripe : « Acompte RDV Perruque médicalisée » à 30€.

Webhook Stripe `/api/public/webhooks/stripe` :
- `checkout.session.completed` → `bookings.status = 'confirmed'`
- `checkout.session.expired` → `bookings.status = 'cancelled'` (libère le slot)

## Back-office admin (extension)

Nouvel onglet **« Réservations »** dans `/admin` :
- Liste chronologique des bookings (filtres : à venir / passés / annulés).
- Actions : marquer comme `completed`, `cancelled`, lien vers le Stripe Dashboard pour remboursement.
- Section **« Jours fermés »** : ajouter/retirer des dates bloquées.

## Étapes d'implémentation (ordre)

1. Migration DB : tables `bookings`, `closed_dates`, enum `booking_status`, RPC `get_available_slots`, RLS.
2. Activation Stripe Payments (via `recommend_payment_provider` puis `enable_stripe_payments`).
3. Création du produit Stripe « Acompte 30€ ».
4. Server functions booking (lecture créneaux + création pending).
5. Page `/reservation` (calendrier + formulaire + redirection Stripe).
6. Webhook Stripe + pages success/cancel.
7. Extension `/admin` : onglet Réservations + gestion jours fermés.
8. Mise à jour `/perruques-medicalisees` : CTA vers `/reservation`.

## Hors scope (volontairement reporté)

- SMS de rappel J-1.
- Synchronisation Google Calendar.
- Self-service annulation client (pour le MVP, le client doit contacter le salon).
- Gestion multi-coiffeuses.