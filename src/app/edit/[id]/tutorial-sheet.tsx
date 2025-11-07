
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Code, GraduationCap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const LOCAL_STORAGE_KEY = 'codelabs-a11y-tutorial-step';

const tutorialSteps = [
  {
    title: 'Étape 1 : Sémantique et Structure',
    description: "La première étape consiste à remplacer les balises `<div>` génériques par des balises HTML sémantiques. Cela aide les technologies d'assistance à comprendre la structure et le rôle de chaque partie de la page.",
    changes: [
      { before: '<div class="header">', after: '<header class="header">', explanation: 'Utiliser `<header>` pour l\'en-tête principal de la page.' },
      { before: '<div class="nav">', after: '<nav class="nav">', explanation: 'Utiliser `<nav>` pour le bloc de navigation principal.' },
      { before: '<div class="container">', after: '<main class="container">', explanation: 'Utiliser `<main>` pour le contenu principal de la page.' },
      { before: '<div class="hero">', after: '<section class="hero">', explanation: 'Utiliser `<section>` pour regrouper des contenus thématiques.' },
      { before: '<div class="sponsors">', after: '<aside class="sponsors">', explanation: 'Utiliser `<aside>` pour les contenus connexes (sponsors).' },
      { before: '<div class="footer">', after: '<footer class="footer">', explanation: 'Utiliser `<footer>` pour le pied de page.' },
      { before: '<p class="title">', after: '<h1>', explanation: 'Utiliser `<h1>` pour le titre principal, crucial pour la hiérarchie.' },
      { before: '<div class="session-title">', after: '<h3>', explanation: 'Utiliser des balises de titre (`<h3>`) au lieu de `<div>` pour les titres de section.' },
      { before: '<b>', after: '<h2>', explanation: 'Remplacer `<b>` par des titres sémantiques comme `<h2>` pour structurer le contenu.' },
    ],
  },
  {
    title: 'Étape 2 : Attributs Aria et Accessibilité des Images',
    description: "Ajouter des attributs ARIA (Accessible Rich Internet Applications) pour enrichir la sémantique et rendre les composants interactifs plus clairs pour les lecteurs d'écran. Fournir des alternatives textuelles pour les images est également essentiel.",
    changes: [
      { before: '<nav>', after: '<nav aria-label="Navigation principale">', explanation: '`aria-label` donne un nom accessible à la navigation.' },
      { before: '<main>', after: '<main id="main-content">', explanation: 'Ajouter un `id` au contenu principal pour permettre les liens d\'évitement.' },
      { before: '<a href="#">Accueil</a>', after: '<a href="#main-content">Accueil</a>', explanation: 'Le premier lien doit permettre de "sauter au contenu principal".' },
      { before: '<img src="/map.png">', after: '<img src="/map.png" alt="">', explanation: 'Ajouter `alt=""` pour les images décoratives afin que les lecteurs d\'écran les ignorent.' },
      { before: '<img src="https://picsum.photos/id/91/150/150">', after: '<img ... alt="Photo de Patrice de Saint Steban.">', explanation: 'Fournir un texte alternatif descriptif pour les images informatives.' },
    ],
  },
  {
    title: 'Étape 3 : Rendre les Composants Interactifs Accessibles',
    description: "Les éléments avec lesquels l'utilisateur interagit, comme les accordéons, les boutons et les formulaires, nécessitent une attention particulière pour être utilisables par tous.",
    changes: [
      { before: '<div class="accordion-item">', after: 'Utilisation de `aria-expanded`, `aria-controls`, `hidden`', explanation: 'L\'accordéon doit indiquer son état (ouvert/fermé) avec `aria-expanded` et lier le bouton à son contenu avec `aria-controls`.' },
      { before: '<div class="favorite-btn">', after: '<button class="favorite-btn">', explanation: 'Remplacer les `div` cliquables par des `<button>`, qui sont nativement accessibles au clavier et sémantiques.' },
      { before: '<button ...>Favori</button>', after: '<button title="Ajouter ... aux favoris">', explanation: 'Utiliser `title` sur les boutons icônes pour fournir une description textuelle claire de leur action.' },
      { before: '<div class="session">', after: '<article class="session" tabindex="0">', explanation: 'Rendre les cartes de session focalisables avec `tabindex="0"` pour que les utilisateurs au clavier puissent y naviguer.' },
    ],
  },
  {
    title: 'Étape 4 : Accessibilité des Formulaires',
    description: "Les formulaires sont une source majeure de problèmes d'accessibilité. Il est crucial de lier correctement les étiquettes (`<label>`) aux champs de saisie (`<input>`) et de gérer les erreurs de manière accessible.",
    changes: [
      { before: '<div class="form-label">Nom</div><input>', after: '<label for="form-nom">Nom <input id="form-nom"></label>', explanation: 'Associer chaque `label` à son `input` avec l\'attribut `for` et un `id` correspondant. Cela permet de cliquer sur l\'étiquette pour activer le champ.' },
      { before: '<div class="form-section">', after: '<form onsubmit="validateForm(event)">', explanation: 'Utiliser une balise `<form>` pour encapsuler les champs de formulaire.' },
      { before: '<div id="form-error"></div>', after: '<div id="form-error" role="alert" aria-live="assertive">', explanation: '`role="alert"` et `aria-live="assertive"` forcent les lecteurs d\'écran à annoncer immédiatement les messages d\'erreur dès qu\'ils apparaissent.' },
      { before: '<input type="submit" onclick="validateForm()">', after: '<form onsubmit="..."><input type="submit"></form>', explanation: 'L\'événement de soumission doit être sur la balise `<form>` (`onsubmit`), pas sur le bouton (`onclick`).' },
    ],
  },
];


export function TutorialSheet() {
  const [openStep, setOpenStep] = useState<string | undefined>(undefined);

  useEffect(() => {
    const savedStep = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStep) {
      setOpenStep(savedStep);
    } else {
      setOpenStep('step-0');
    }
  }, []);

  const handleStepChange = (value: string) => {
    setOpenStep(value);
    localStorage.setItem(LOCAL_STORAGE_KEY, value);
  };


  return (
    <Sheet>
        <Tooltip>
            <TooltipTrigger asChild>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="p-2 md:px-3">
                        <GraduationCap className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Tutoriel</span>
                    </Button>
                </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
                <p>Tutoriel</p>
            </TooltipContent>
        </Tooltip>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-xl">Tutoriel d'Accessibilité</SheetTitle>
          <SheetDescription>
            Comment rendre votre page web accessible, étape par étape.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-6">
            <div className="grid gap-6">
              <Accordion 
                type="single" 
                collapsible 
                className="w-full"
                value={openStep}
                onValueChange={handleStepChange}
              >
                {tutorialSteps.map((step, index) => (
                  <AccordionItem key={index} value={`step-${index}`}>
                    <AccordionTrigger className="text-lg hover:no-underline">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pr-4">
                          <p className="text-muted-foreground">{step.description}</p>
                          {step.changes.map((change, changeIndex) => (
                            <div key={changeIndex} className="p-4 rounded-lg border bg-muted/30">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div>
                                  <p className="font-semibold text-destructive mb-1">Avant :</p>
                                  <code className="text-sm p-2 bg-destructive/10 text-destructive rounded-md block overflow-auto whitespace-pre-wrap">{change.before}</code>
                                </div>
                                <div>
                                  <p className="font-semibold text-green-600 mb-1">Après :</p>
                                  <code className="text-sm p-2 bg-green-600/10 text-green-700 rounded-md block overflow-auto whitespace-pre-wrap">{change.after}</code>
                                </div>
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground">
                                <span className="font-semibold">Pourquoi ?</span> {change.explanation}
                              </p>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="mt-8 text-center">
              <Card>
                <CardHeader>
                  <CardTitle>Voir la solution complète</CardTitle>
                  <CardDescription>
                    Vous avez terminé le tutoriel ? Comparez votre travail avec la solution finale entièrement accessible.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                  <Link href="/solution" passHref>
                    <Button size="lg">
                      <Code className="mr-2 h-5 w-5" />
                      Voir le code de la solution
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

