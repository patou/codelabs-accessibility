# Codelabs Accessibilité - Éditeur HTML Interactif

Codelabs Accessibilité est une application web Next.js qui fournit un éditeur HTML simple et efficace avec un aperçu en direct. Il est conçu pour le prototypage rapide, le débogage et l'expérimentation avec du code HTML, CSS et JavaScript. Le contenu est automatiquement sauvegardé dans Firebase Firestore, et chaque session d'édition est accessible via une URL unique.

## Fonctionnalités

- **Éditeur de code intégré** : Utilise Monaco Editor (le moteur derrière VS Code) pour une expérience d'édition riche.
- **Aperçu en direct** : Visualisez vos modifications HTML et CSS en temps réel dans un iframe juste à côté de l'éditeur.
- **Sauvegarde automatique** : Les modifications sont automatiquement sauvegardées dans la base de données Firestore après un court délai d'inactivité.
- **Partage par URL** : Chaque document possède une URL unique (`/edit/[id]`), ce qui facilite la reprise du travail.
- **Prévisualisation mobile** : Un code QR est disponible pour visualiser rapidement le rendu en direct sur un appareil mobile.
- **Création de nouveaux documents** : Un bouton "Nouveau" permet de générer une nouvelle page d'édition vierge.
- **Interface responsive** : L'interface de l'éditeur et le template HTML par défaut sont conçus pour fonctionner sur différentes tailles d'écran.
- **Raccourci de sauvegarde** : Intercepte le `Ctrl+S` / `Cmd+S` pour éviter l'ouverture de la boîte de dialogue "Enregistrer sous" du navigateur.

## Stack technique

- **Framework** : [Next.js](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Base de données** : [Firebase Firestore](https://firebase.google.com/docs/firestore) (utilisé via le SDK Admin côté serveur)
- **Composants UI** : [shadcn/ui](https://ui.shadcn.com/) & Radix UI
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Éditeur de code** : [@monaco-editor/react](https://www.npmjs.com/package/@monaco-editor/react)
- **Déploiement** : Prêt pour [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Démarrage du projet

Pour lancer le projet en local, suivez ces étapes.

### 1. Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### 2. Configuration de Firebase

Ce projet nécessite une connexion à un projet Firebase pour la persistance des données.

1.  Créez un projet sur la [console Firebase](https://console.firebase.google.com/).
2.  Créez une base de données **Firestore** dans votre projet.
3.  **Activez les règles de sécurité Firestore** pour permettre la lecture et l'écriture. Allez dans l'onglet `Règles` de Firestore et utilisez la configuration suivante (attention : c'est très permissif, à utiliser uniquement pour le développement) :
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /html_documents/{docId} {
          allow read, write: if true;
        }
      }
    }
    ```

### 3. Configuration de l'environnement local

1.  Clonez le dépôt :
    ```bash
    git clone <url-du-repo>
    cd <nom-du-repo>
    ```

2.  Installez les dépendances :
    ```bash
    npm install
    ```

3.  Créez un fichier d'environnement local :
    ```bash
    touch .env.local
    ```

4.  **Générez une clé de compte de service Firebase** :
    - Dans la console Firebase, allez dans les **Paramètres du projet** (icône d'engrenage en haut à gauche).
    - Allez dans l'onglet **Comptes de service**.
    - Cliquez sur le bouton **"Générer une nouvelle clé privée"**.
    - Un fichier JSON sera téléchargé. **Traitez ce fichier comme un mot de passe, ne le partagez jamais et ne le commitez pas dans Git.**

5.  Ouvrez le fichier JSON téléchargé et copiez les valeurs `project_id`, `client_email`, et `private_key`.

6.  Ajoutez ces valeurs dans votre fichier `.env.local` comme ceci :
    ```env
    FIREBASE_PROJECT_ID="votre-project-id"
    FIREBASE_CLIENT_EMAIL="votre-compte-de-service@...iam.gserviceaccount.com"
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...votre-clé-privée...\n-----END PRIVATE KEY-----\n"
    ```
    
    **ATTENTION : Formatage de `FIREBASE_PRIVATE_KEY`**
    La clé privée doit être sur **une seule ligne** et entourée de **guillemets doubles**. Les sauts de ligne de la clé originale doivent être remplacés par le caractère `\n`.
    
    *Exemple incorrect (multi-lignes) :*
    ```env
    # NE FAITES PAS ÇA
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
    MII...
    ...
    -----END PRIVATE KEY-----"
    ```
    
    *Exemple correct (sur une seule ligne avec \n) :*
    ```env
    # FAITES COMME CECI
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...contenu de la clé...\n-----END PRIVATE KEY-----\n"
    ```

### 4. Lancer le serveur de développement

Une fois l'environnement configuré, lancez le serveur :

```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:9002](http://localhost:9002).

## Déploiement

Ce projet est pré-configuré pour un déploiement facile sur **Firebase App Hosting**. L'environnement de production n'utilise pas les clés du fichier `.env.local` ; il s'authentifie automatiquement et de manière sécurisée.

1.  Assurez-vous d'avoir la [Firebase CLI](https://firebase.google.com/docs/cli) installée et connectée à votre compte Google.

2.  Liez votre projet local à votre projet Firebase :
    ```bash
    firebase use <your-project-id>
    ```

3.  Déployez sur App Hosting :
    ```bash
    firebase apphosting:backends:deploy
    ```

Suivez les instructions de la CLI pour sélectionner le backend et la région. Une fois le déploiement terminé, votre application sera accessible via l'URL fournie par Firebase.
