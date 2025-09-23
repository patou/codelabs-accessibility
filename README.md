# HTML Alter - Éditeur HTML Interactif

HTML Alter est une application web Next.js qui fournit un éditeur HTML simple et efficace avec un aperçu en direct. Il est conçu pour le prototypage rapide, le débogage et l'expérimentation avec du code HTML, CSS et JavaScript. Le contenu est automatiquement sauvegardé dans Firebase Firestore, et chaque session d'édition est accessible via une URL unique.

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
- **Base de données** : [Firebase Firestore](https://firebase.google.com/docs/firestore)
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
2.  Dans votre projet, créez une application web.
3.  Copiez les identifiants de configuration de votre application Firebase.
4.  Créez une base de données **Firestore** dans votre projet.

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

3.  Créez un fichier d'environnement local. Vous pouvez copier le fichier `.env.local.example` (s'il existe) ou en créer un nouveau :
    ```bash
    touch .env.local
    ```

4.  Ajoutez vos identifiants Firebase dans le fichier `.env.local` :
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
    ```

### 4. Lancer le serveur de développement

Une fois l'environnement configuré, lancez le serveur :

```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:9002](http://localhost:9002).

## Déploiement

Ce projet est pré-configuré pour un déploiement facile sur **Firebase App Hosting**.

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
