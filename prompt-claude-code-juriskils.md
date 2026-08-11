# PROMPT POUR CLAUDE CODE — Marketplace "Juriskils"

Copie-colle tout ce qui suit dans Claude Code (idéalement dans un dossier vide) pour lancer la construction du site.

---

## CONTEXTE DU PROJET

Construis une application web complète appelée **Juriskils**, une marketplace destinée aux étudiants en droit et aux professionnels du droit, qui vend des produits IA liés au juridique :
- **Prompts IA**
- **Skills IA**
- **Agents IA**

Le site doit avoir un style **futuriste, sobre et professionnel** (pas gaming/flashy) : dégradés bleu nuit / violet électrique, accents néon discrets, typographie moderne (ex: Space Grotesk / Inter), animations légères au survol, glassmorphism sur les cartes produits. L'objectif est d'inspirer confiance à un public de juristes tout en montrant l'innovation technologique.

La prise en main doit être **simple et commerciale** : parcours d'achat fluide, peu de friction, mise en avant claire du prix et de la valeur de chaque produit.

---

## STACK TECHNIQUE RECOMMANDÉE

- **Frontend** : Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Base de données** : PostgreSQL (via Supabase ou Prisma + Neon/Railway)
- **Authentification** : NextAuth.js (ou Supabase Auth) — comptes acheteurs + rôle admin séparé
- **Paiement** : Stripe (Checkout + Webhooks pour valider les achats)
- **Emails transactionnels** : Resend ou Postmark (facture + livraison du produit après achat, newsletters)
- **Stockage fichiers** (bannières produits, fichiers des prompts/skills/agents livrés) : Supabase Storage ou AWS S3
- **ORM** : Prisma

Si Claude Code juge une autre stack plus pertinente pour la rapidité de mise en œuvre, il peut proposer une alternative, mais doit rester sur du Next.js + Postgres pour garder un projet maintenable.

---

## STRUCTURE DU SITE (CÔTÉ CLIENT)

### 1. Page d'accueil
- Hero section avec présentation de Juriskils, accroche commerciale claire ("Équipez-vous des meilleurs outils IA pensés pour le droit")
- Mise en avant de produits phares / promotions en cours
- Bandeau de confiance (nombre d'utilisateurs, avis, etc.)

### 2. Navigation par onglets
Trois onglets principaux, toujours visibles dans la navigation :
- **Prompts IA**
- **Skills IA**
- **Agents IA**

Chaque onglet affiche une grille de toutes les cartes produits appartenant à cette catégorie (actuellement aucun produit n'existe : prévoir un **état vide élégant** avec message du type "Aucun produit disponible pour le moment — revenez bientôt" tant que l'admin n'a rien publié).

### 3. Carte produit (dans la grille)
Chaque produit s'affiche sous forme de carte avec :
- Bannière/image du produit
- Nom du produit
- Courte description
- Prix (avec **prix barré + badge de réduction en jaune vif** si une promotion est active — le badge doit être visuellement impossible à manquer : couleur jaune flashy, éventuellement une légère pulsation/animation)
- Note moyenne (étoiles) si des avis existent

### 4. Page produit (au clic sur une carte)
- Bannière/image en grand
- Nom + description complète
- Prix (avec réduction affichée en jaune si applicable, prix barré)
- Bouton d'achat clair ("Acheter maintenant")
- **Section unique combinée avis + commentaires** en bas de page :
  - Système de notation (étoiles, 1 à 5)
  - Zone de commentaire texte
  - Liste des avis existants avec note + commentaire + nom de l'utilisateur + date
  - Seuls les utilisateurs connectés peuvent noter/commenter

### 5. Compte utilisateur / acheteur
- Création de compte obligatoire avant achat (email, mot de passe, nom)
- Authentification sécurisée (mot de passe hashé — bcrypt/argon2)
- Espace "Mes achats" listant les produits achetés, avec accès aux factures et aux fichiers livrés
- Consentement RGPD à l'inscription pour recevoir la newsletter (case à cocher, non pré-cochée)

### 6. Bandeau cookies (RGPD)
- Bandeau de consentement aux cookies affiché au premier chargement (Accepter / Refuser / Personnaliser)
- Doit bloquer les cookies non essentiels (analytics, marketing) tant que le consentement n'est pas donné
- Stocker le choix de l'utilisateur (localStorage + cookie)

### 7. Processus d'achat
- Paiement sécurisé via Stripe Checkout
- À la confirmation du paiement (via webhook Stripe, pas seulement côté client) :
  1. Enregistrement de l'achat en base de données, lié au compte utilisateur
  2. Génération automatique d'une **facture PDF**
  3. Envoi automatique d'un **email** contenant : la facture PDF en pièce jointe + le produit acheté (fichier téléchargeable ou lien d'accès sécurisé selon le type de produit)
  4. Le produit reste aussi accessible en permanence depuis l'espace "Mes achats"

---

## ESPACE ADMINISTRATEUR

Accessible via une route dédiée non listée dans la navigation publique (ex: `/admin`), protégée par une authentification **séparée** de celle des clients.

### Sécurité des identifiants admin
- Ne jamais coder l'identifiant/mot de passe en clair dans le code source.
- Générer les identifiants comme suit et les stocker dans les variables d'environnement (`.env`, jamais commité dans Git) :
  - `ADMIN_EMAIL` = à définir par toi lors de l'installation
  - `ADMIN_PASSWORD_HASH` = hash bcrypt d'un mot de passe fort généré aléatoirement
- Demande à Claude Code de générer un mot de passe aléatoire fort (16+ caractères, majuscules/minuscules/chiffres/symboles) au moment de l'installation, de te l'afficher **une seule fois** dans le terminal, et de ne stocker que son hash.
- Ajouter une protection contre le brute-force (limitation du nombre de tentatives de connexion, ex: via rate limiting).
- Session admin avec expiration automatique.

### Fonctionnalités de l'espace admin
1. **Gestion des produits**
   - Ajouter un produit : catégorie (Prompt / Skill / Agent), nom, description, bannière/image, prix, fichier(s) livrable(s)
   - Modifier un produit existant
   - Supprimer un produit
2. **Gestion des réductions**
   - Appliquer un pourcentage ou un montant de réduction sur un produit, avec date de début/fin optionnelle
   - La réduction doit immédiatement se refléter côté client avec le badge jaune flashy et le prix barré
3. **Suivi des achats**
   - Liste de tous les achats : client, produit, prix payé, date, statut
   - Accès à la facture générée pour chaque achat
4. **Modération des avis/commentaires**
   - Voir tous les commentaires laissés sur tous les produits
   - Supprimer un commentaire jugé inapproprié
5. **Gestion des utilisateurs** (bonus utile) : liste des comptes clients, export pour newsletter

---

## MODÈLE DE DONNÉES (à titre indicatif pour Prisma)

- `User` (id, email, password_hash, nom, newsletter_opt_in, created_at, role: "client" | "admin")
- `Product` (id, category: "prompt" | "skill" | "agent", nom, description, image_url, prix, fichier_url, discount_percent, discount_start, discount_end, created_at)
- `Purchase` (id, user_id, product_id, prix_paye, invoice_url, stripe_payment_id, created_at)
- `Review` (id, user_id, product_id, note, commentaire, created_at)

---

## CONSIGNES DE DESIGN (rappel)

- Palette : fond sombre bleu nuit (#0B0F1A par ex.), accents violet/bleu électrique en dégradé, touches néon fines
- Réductions : badge **jaune vif** (#FFD500 par ex.), bien contrasté, immédiatement visible
- Typographie moderne, lisible, professionnelle malgré le style futuriste
- Cartes produits avec effet glassmorphism / légère lueur au survol
- Responsive obligatoire (mobile, tablette, desktop)

---

## LIVRABLE ATTENDU

Un projet Next.js fonctionnel, structuré, avec :
- Les 3 onglets fonctionnels affichant les produits (vides pour l'instant)
- Le système de compte client + authentification
- Le tunnel d'achat Stripe + génération facture + envoi email automatique
- Le bandeau cookies RGPD
- L'espace admin complet (produits, réductions, achats, modération)
- Un fichier `.env.example` listant toutes les variables d'environnement nécessaires (clés Stripe, base de données, service email, secrets admin) sans valeurs sensibles réelles
- Un `README.md` expliquant comment installer, configurer les clés (Stripe, base de données, email) et lancer le projet en local

Commence par mettre en place la structure du projet, le schéma de base de données et la navigation par onglets avec les états vides, avant de construire le tunnel d'achat et l'espace admin.
