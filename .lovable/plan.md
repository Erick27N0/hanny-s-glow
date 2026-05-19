## Diagnostic

- L'utilisateur `ericknounga@ericknoungaei.onmicrosoft.com` (id `b9b52d9a-428d-4530-9517-e8d3917055ba`) existe bien dans l'auth (visible dans les logs).
- La table `public.user_roles` est vide → aucun admin déclaré.
- Résultat : login OK, mais `/admin` renvoie « Accès réservé aux administrateurs » car `has_role(auth.uid(), 'admin')` retourne `false`.

## Étape suivante proposée

**Attribuer le rôle `admin` à ton compte** en insérant une ligne dans `public.user_roles` :

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('b9b52d9a-428d-4530-9517-e8d3917055ba', 'admin');
```

Après ça :
1. Se déconnecter / reconnecter sur `/admin/login` pour rafraîchir le token.
2. Le dashboard `/admin` doit afficher les 3 onglets (Contacts / RDV / Produits).

## Vérifications complémentaires si ça ne passe toujours pas

- Confirmer que l'email est bien vérifié (`email_confirmed_at` non null) — l'auto-confirm est activé, donc normalement OK.
- Tester un envoi de formulaire côté public (page Contact) pour générer une ligne et valider le flux complet d'affichage admin.

## Hors scope (à valider plus tard)

- Créer une UI d'administration des rôles (ajouter d'autres admins depuis l'app plutôt qu'en SQL).
- Notifications email à chaque nouvelle demande (nécessite domaine d'envoi).