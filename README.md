# Juriskills

Marketplace IA pour étudiants et professionnels du droit : Prompts IA, Skills IA et Agents IA.

Stack : Next.js 14 (App Router) + TypeScript + Tailwind CSS, Prisma + PostgreSQL (Supabase), NextAuth.js, Stripe Checkout, Resend, Supabase Storage.

## 1. Prérequis

- Node.js 18.18+ (recommandé : 20+)
- Un projet [Supabase](https://supabase.com) (gratuit) pour la base de données et le stockage de fichiers
- Un compte [Stripe](https://stripe.com) (mode test suffit pour démarrer)
- Un compte [Resend](https://resend.com) pour l'envoi d'emails
- Le [Stripe CLI](https://stripe.com/docs/stripe-cli) pour tester les webhooks en local

## 2. Installation

```bash
npm install
```

## 3. Configuration

Copiez `.env.example` vers `.env.local` puis renseignez chaque variable :

```bash
cp .env.example .env.local
```

### 3.1 Base de données (Supabase)

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans **Project Settings → Database**, copiez :
   - la **Connection string** en mode "Transaction" (port 6543) → `DATABASE_URL`
   - la **Connection string** en mode "Session"/direct (port 5432) → `DIRECT_URL`
3. Dans **Project Settings → API**, copiez :
   - `Project URL` → `SUPABASE_URL`
   - `service_role` (clé secrète, jamais exposée au client) → `SUPABASE_SERVICE_ROLE_KEY`
4. Dans **Storage**, créez 3 buckets :
   - `product-images` (public)
   - `product-files` (privé)
   - `invoices` (privé)

### 3.2 Générer le schéma de base de données

```bash
npm run db:push
```

(ou `npm run db:migrate` pour conserver un historique de migrations versionné)

> **Note** : la CLI Prisma (`db:push`, `db:migrate`, `db:studio`) lit le fichier `.env` (pas `.env.local`, qui est
> une convention propre à Next.js). Dupliquez au minimum `DATABASE_URL` et `DIRECT_URL` dans un fichier `.env` à la
> racine du projet — ce fichier est aussi ignoré par Git.

### 3.3 Compte administrateur

Ne codez jamais l'identifiant/mot de passe admin en dur. Générez-les :

```bash
npm run admin:generate -- admin@votredomaine.fr
```

Le mot de passe généré s'affiche **une seule fois** dans le terminal — notez-le immédiatement. Copiez les lignes
`ADMIN_EMAIL` et `ADMIN_PASSWORD_HASH` affichées dans votre `.env.local`.

> **Piège à éviter** : Next.js applique une expansion des variables `$VAR` dans les fichiers `.env`, **même entre
> guillemets simples**. Le hash bcrypt contient des symboles `$` (ex : `$2a$12$...`) qui seront corrompus au
> chargement si chaque `$` n'est pas échappé avec un antislash. Écrivez toujours :
> ```
> ADMIN_PASSWORD_HASH="\$2a\$12\$votrehash..."
> ```
> `npm run admin:generate` génère directement la ligne dans ce format — copiez-la telle quelle. Un hash mal
> échappé fait échouer silencieusement toutes les connexions admin (erreur "Identifiants incorrects").

L'espace admin est accessible sur `/admin/login` (route volontairement absente de la navigation publique). Les
tentatives de connexion sont limitées à 5 essais / 15 minutes par email pour se prémunir du brute-force.

### 3.4 NextAuth

Générez un secret aléatoire :

```bash
openssl rand -base64 32
```

Collez le résultat dans `NEXTAUTH_SECRET`. Laissez `NEXTAUTH_URL=http://localhost:3000` en local.

### 3.5 Stripe

1. Récupérez vos clés de test dans le [Dashboard Stripe](https://dashboard.stripe.com/test/apikeys) →
   `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. En local, lancez le forward des webhooks dans un terminal séparé :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   La commande affiche un `whsec_...` à copier dans `STRIPE_WEBHOOK_SECRET`.
3. En production, créez un endpoint webhook Stripe pointant vers `https://votredomaine.fr/api/stripe/webhook`
   écoutant l'événement `checkout.session.completed`, et utilisez le secret généré par Stripe.

### 3.6 Resend

Créez une clé API sur [resend.com](https://resend.com) → `RESEND_API_KEY`, et vérifiez un domaine d'envoi pour
`EMAIL_FROM` (ex : `Juriskills <achats@votredomaine.fr>`).

## 4. Lancer le projet en local

```bash
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

Pour tester un tunnel d'achat complet en local : gardez `stripe listen` actif dans un terminal, ajoutez un produit
depuis `/admin/produits/nouveau`, puis achetez-le avec une [carte de test Stripe](https://stripe.com/docs/testing)
(ex : `4242 4242 4242 4242`).

## 5. Scripts disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarre le serveur de production |
| `npm run db:push` | Synchronise le schéma Prisma avec la base sans historique de migration |
| `npm run db:migrate` | Crée/applique une migration Prisma versionnée |
| `npm run db:studio` | Ouvre Prisma Studio pour explorer la base |
| `npm run admin:generate -- <email>` | Génère un mot de passe admin fort et son hash bcrypt |

## 6. Structure du projet

```
src/
  app/
    (site)/          # pages publiques (accueil, catalogue, produit, compte)
    admin/            # espace admin protégé (login séparé + middleware)
    api/               # routes API (auth, stripe, reviews, admin, téléchargements)
  components/          # composants réutilisables (layout, produits, avis, admin, ui)
  lib/                 # accès DB, auth, stripe, resend, storage, facturation, pricing
  types/               # types partagés
prisma/
  schema.prisma        # modèle de données (User, Product, Purchase, Review, LoginAttempt)
scripts/
  generate-admin.ts    # génération sécurisée des identifiants admin
```

## 7. Sécurité & RGPD

- Mots de passe hashés avec bcrypt (coût 12), jamais stockés en clair.
- Identifiants admin exclusivement en variables d'environnement (jamais dans le code).
- Rate limiting sur la connexion admin (table `LoginAttempt`).
- Achats validés uniquement via le webhook Stripe signé (jamais côté client).
- Bandeau cookies avec choix Accepter/Refuser/Personnaliser, stocké en cookie + `localStorage` ; les cookies non
  essentiels ne doivent être chargés qu'après consentement explicite (voir `src/lib/cookie-consent.ts`).
- Consentement newsletter non pré-coché à l'inscription.
