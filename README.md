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

Pour que l'application puisse s'authentifier auprès de Firebase en local, vous devez utiliser une clé de compte de service via un fichier `.env.local`.

1.  **Générez une clé de compte de service Firebase** :
    - Dans la console Firebase, allez dans les **Paramètres du projet** (icône d'engrenage).
    - Allez dans l'onglet **Comptes de service**.
    - Cliquez sur le bouton **"Générer une nouvelle clé privée"**.
    - Un fichier JSON sera téléchargé (par exemple, `votre-projet-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`). **Conservez ce fichier dans un endroit sûr.**

2.  **Créez un fichier `.env.local`** :
    - À la racine de votre projet, créez un nouveau fichier nommé `.env.local`.
    - Ajoutez la ligne suivante dans ce fichier, en remplaçant `/path/to/your/keyfile.json` par le chemin **absolu** vers le fichier JSON que vous venez de télécharger :
      ```
      GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
      ```
    - **Exemple sur macOS/Linux :**
      ```
      GOOGLE_APPLICATION_CREDENTIALS="/Users/mon-nom/Documents/cles-firebase/votre-projet-adminsdk.json"
      ```
    - **Exemple sur Windows :**
      ```
      GOOGLE_APPLICATION_CREDENTIALS="C:\Users\MonNom\Documents\cles-firebase\votre-projet-adminsdk.json"
      ```

    **Note :** Le fichier `.env.local` est déjà listé dans `.gitignore`, donc il ne sera pas ajouté à votre dépôt Git. C'est la manière sécurisée de gérer les secrets en local avec Next.js.

### 4. Lancer le serveur de développement

1.  Clonez le dépôt (si ce n'est pas déjà fait) :
    ```bash
    git clone <url-du-repo>
    cd <nom-du-repo>
    ```

2.  Installez les dépendances :
    ```bash
    npm install
    ```

3.  Lancez le serveur de développement :
    ```bash
    npm run dev
    ```

L'application sera disponible à l'adresse [http://localhost:9002](http://localhost:9002). Next.js chargera automatiquement la variable d'environnement depuis `.env.local`, et le SDK Admin Firebase s'authentifiera avec succès.

## Déploiement

Ce projet est pré-configuré pour un déploiement facile sur **Firebase App Hosting**. En production, le SDK Admin détecte automatiquement les identifiants de l'environnement de manière sécurisée, sans avoir besoin de la variable d'environnement locale.

1.  Assurez-vous d'avoir la [Firebase CLI](https://firebase.google.com/docs/cli) installée et connectée à votre compte Google.

2.  Liez votre projet local à votre projet Firebase :
    ```bash
    firebase use <your-project-id>
    ```

3.  Déployez sur App Hosting :
    ```bash
    firebase apphosting:backends:deploy
    ```

Suivez les instructions de la CLI pour sélectionner le backend et la région.
