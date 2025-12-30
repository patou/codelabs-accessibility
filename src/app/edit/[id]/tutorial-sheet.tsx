
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Code, Lightbulb, Eye, EyeOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const STEP_STORAGE_KEY = 'codelabs-a11y-tutorial-step';
const HINTS_STORAGE_KEY = 'codelabs-a11y-tutorial-visible-hints';
const CODE_VISIBILITY_STORAGE_KEY = 'codelabs-a11y-tutorial-code-visibility';

const tutorialSteps = [
  {
    title: 'Étape 1 : Sémantique et structure',
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
    title: 'Étape 2 : Attributs aria et accessibilité des images',
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
    title: 'Étape 3 : Rendre les composants interactifs accessibles',
    description: "Les éléments avec lesquels l'utilisateur interagit, comme les accordéons, les boutons et les formulaires, nécessitent une attention particulière pour être utilisables par tous.",
    changes: [
      { before: '<div class="accordion-item"><button class="accordion-header">', after: '<details class="accordion-item"><summary class="accordion-header">', explanation: 'L\'accordéon peut être simplifié en utilisant la balise `details`, qui gère automatiquement son état (ouvert ou fermé).' },
      { before: '<div class="favorite-btn">', after: '<button class="favorite-btn">', explanation: 'Remplacer les `<div>` cliquables par des `<button>`, qui sont nativement accessibles au clavier et sémantiques.' },
      { before: '<button ...>Favori</button>', after: '<button title="Ajouter ... aux favoris">', explanation: 'Utiliser `title` sur les boutons icônes pour fournir une description textuelle claire de leur action.' },
      { before: '<div class="session">', after: '<article class="session" tabindex="0">', explanation: 'Rendre les cartes de session focalisables avec `tabindex="0"` pour que les utilisateurs au clavier puissent y naviguer.' },
    ],
  },
  {
    title: 'Étape 4 : Accessibilité des formulaires',
    description: "Les formulaires sont une source majeure de problèmes d'accessibilité. Il est crucial de lier correctement les étiquettes (`<label>`) aux champs de saisie (`<input>`) et de gérer les erreurs de manière accessible.",
    changes: [
      { before: '<div class="form-label">Nom</div><input>', after: '<label for="form-nom">Nom <input id="form-nom"></label>', explanation: 'Associer chaque `<label>` à son `<input>` avec l\'attribut `for` et un `id` correspondant. Cela permet de cliquer sur l\'étiquette pour activer le champ.' },
      { before: '<div class="form-section">', after: '<form onsubmit="validateForm(event)">', explanation: 'Utiliser une balise `<form>` pour encapsuler les champs de formulaire.' },
      { before: '<div id="form-error">', after: '<div id="form-error" role="alert" aria-live="assertive">', explanation: '`role="alert"` et `aria-live="assertive"` forcent les lecteurs d\'écran à annoncer immédiatement les messages d\'erreur dès qu\'ils apparaissent.' },
      { before: '<input type="submit" onclick="validateForm()">', after: '<form onsubmit="..."><input type="submit"></form>', explanation: 'L\'événement de soumission doit être sur la balise `<form>` (`onsubmit`), pas sur le bouton (`onclick`).' },
    ],
  },
  {
    title: 'Etape 5 : Derniers correctifs',
    description: "Les contrastes doivent être suffisamment élevés pour améliorer la lisibilité des textes et la disinction des couleurs.",
    changes: [
      { before: '.text-light { color: #7f8c8d; }', after: '.text-light { color: #6d797a; }', explanation: 'Vérifier les contrastes des textes via un outil adapté (`Wave`, `Contrast Finder`...), et adapter le style en conséquent.' },
      { explanation: 'Bravo, vous avez terminé le tutoriel ! Comparez votre travail avec la solution finale entièrement accessible pour voir toutes les améliorations en action.', }
    ],
    isSolution: true
  }
];

const Explanation = ({ text }: { text: string }) => {
  const parts = text.split(/(`[^`]+`)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          const codeContent = part.slice(1, -1);
          let term = codeContent.replace(/[<>"']/g, '').trim().split(/[ =]/g)[0];
          
          const isAttribute = !codeContent.startsWith('<');
          const isAria = term.startsWith('aria-');
          const isAlertRole = codeContent == `role="alert"`;

          let url = "";
          if (codeContent === "Wave") {
            url = "https://wave.webaim.org/"
          } else if (codeContent === "Contrast Finder") {
            url = "https://app.contrast-finder.org/";
          } else {
            url = `https://developer.mozilla.org/fr/docs/Web/HTML/Element/${term}`;
            if (isAttribute) {
              if (isAria) {
                  url = `https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Attributes/${term.split("=")[0]}`;
              } else if (isAlertRole) {
                url = 'https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role';
              }
              else {
                switch(term) {
                  case "alt": url = `https://developer.mozilla.org/fr/docs/Web/API/HTMLImageElement/${term}`;break;
                  case "for": url = `https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Attributes/${term}`;break;
                  case "details": url = `https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/${term}`;break;
                  default: url = `https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Global_attributes/${term}`;break;
                };
              }
            }
          }
          return (
            <code key={index} className="text-sm p-1 bg-muted rounded-sm">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {codeContent}
              </a>
            </code>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};


export function TutorialSheet() {
  const [openStep, setOpenStep] = useState<string | undefined>(undefined);
  const [visibleHints, setVisibleHints] = useState<{ [key: string]: number }>({});
  const [codeVisible, setCodeVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
    setOpenStep(savedStep || 'step-0');

    try {
      const savedHints = localStorage.getItem(HINTS_STORAGE_KEY);
      if (savedHints) setVisibleHints(JSON.parse(savedHints));

      const savedCodeVisibility = localStorage.getItem(CODE_VISIBILITY_STORAGE_KEY);
      if (savedCodeVisibility) setCodeVisible(JSON.parse(savedCodeVisibility));
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
      localStorage.removeItem(HINTS_STORAGE_KEY);
      localStorage.removeItem(CODE_VISIBILITY_STORAGE_KEY);
    }
  }, []);

  const handleStepChange = (value: string | undefined) => {
    const newStep = value;
    setOpenStep(newStep);
    if (newStep) {
      localStorage.setItem(STEP_STORAGE_KEY, newStep);
    } else {
      localStorage.removeItem(STEP_STORAGE_KEY);
    }
  };
  
  const showHint = (stepKey: string, maxHints: number) => {
    setVisibleHints(prev => {
      const currentVisibleCount = prev[stepKey] || 0;
      if (currentVisibleCount < maxHints) {
        const newHints = {
          ...prev,
          [stepKey]: currentVisibleCount + 1,
        };
        localStorage.setItem(HINTS_STORAGE_KEY, JSON.stringify(newHints));
        return newHints;
      }
      return prev;
    });
  };

  const toggleCodeVisibility = (stepKey: string, hintIndex: number) => {
    const codeKey = `${stepKey}-${hintIndex}`;
    setCodeVisible(prev => {
      const newCodeVisibility = {
        ...prev,
        [codeKey]: !prev[codeKey]
      };
      localStorage.setItem(CODE_VISIBILITY_STORAGE_KEY, JSON.stringify(newCodeVisibility));
      return newCodeVisibility;
    });
  }

  return (
    <ScrollArea className="h-full">
      <div className="px-6 pb-8 pt-4">
         <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold">Tutoriel d'Accessibilité</h2>
            <p className="text-muted-foreground">Comment rendre votre page web accessible, étape par étape.</p>
        </div>
        <div className="grid gap-6">
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={openStep}
            onValueChange={handleStepChange}
          >
            {tutorialSteps.map((step, index) => {
              const stepKey = `step-${index}`;
              const numVisible = visibleHints[stepKey] || 0;
              const allHintsShown = numVisible === step.changes.length;

              return (
                  <AccordionItem key={index} value={stepKey}>
                  <AccordionTrigger className="text-lg hover:no-underline">
                      {step.title}
                  </AccordionTrigger>
                  <AccordionContent>
                      <div className="space-y-4 pr-4">
                          <p className="text-muted-foreground">{step.description}</p>
                          
                          {step.changes.slice(0, numVisible).map((change, changeIndex) => {
                              const codeKey = `${stepKey}-${changeIndex}`;
                              const isCodeVisible = codeVisible[codeKey] || false;
                              return (
                              <div key={changeIndex} className="p-4 rounded-lg border bg-muted/30 animate-in fade-in-50 duration-300">
                                  <div className="flex justify-between items-start gap-2">
                                      <p className="flex-1 text-sm text-muted-foreground">
                                          <Explanation text={change.explanation} />
                                      </p>
                                      {(!!change.before || !!change.after) &&
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => toggleCodeVisibility(stepKey, changeIndex)}>
                                                    {isCodeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{isCodeVisible ? "Masquer" : "Afficher"} le code</p>
                                            </TooltipContent>
                                        </Tooltip>
                                      }
                                  </div>
                                  
                                  {isCodeVisible && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mt-3 animate-in fade-in-0 duration-500">
                                          <div>
                                              <p className="font-semibold text-destructive mb-1">Avant :</p>
                                              <code className="text-sm p-2 bg-destructive/10 text-destructive rounded-md block overflow-auto whitespace-pre-wrap">{change.before}</code>
                                          </div>
                                          <div>
                                              <p className="font-semibold text-green-600 mb-1">Après :</p>
                                              <code className="text-sm p-2 bg-green-600/10 text-green-700 rounded-md block overflow-auto whitespace-pre-wrap">{change.after}</code>
                                          </div>
                                      </div>
                                  )}
                              </div>
                              )
                          })}

                      {!allHintsShown && (
                          <div className="mt-4 flex justify-center">
                              <Button onClick={() => showHint(stepKey, step.changes.length)}>
                                  <Lightbulb className="mr-2 h-4 w-4" />
                                  Voir un indice ({numVisible + 1}/{step.changes.length})
                              </Button>
                          </div>
                      )}
                        {(allHintsShown && !step.isSolution) && (
                          <p className="text-center text-sm text-green-600 font-semibold mt-4">
                              Vous avez vu tous les indices pour cette étape. Vous pouvez passer à l'étape suivante.
                          </p>
                      )}
                      {(allHintsShown && step.isSolution) && (
                          <div className="mt-4 flex justify-center">
                            <Link href="/solution" passHref>
                              <Button size="lg">
                                <Code className="mr-2 h-5 w-5" />
                                Voir le code de la solution
                              </Button>
                            </Link>
                          </div>
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
            })}
          </Accordion>
        </div>
      </div>
    </ScrollArea>
  );
}
