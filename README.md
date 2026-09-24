# epitexam.github.io

Portfolio personnel et blog technique. Développeur Full-Stack.  
Construit avec [Astro](https://astro.build), déployé sur [GitHub Pages](https://pages.github.com).

---

## Stack

| Couche    | Technologie                        |
| :-------- | :--------------------------------- |
| Framework | Astro (génération statique)        |
| Langages  | TypeScript, HTML, CSS, Tailwind    |
| CI/CD     | GitHub Actions, GitHub Pages      |

## Pages

| Route      | Contenu                                          |
| :--------- | :----------------------------------------------- |
| `/`        | Accueil + hero, projets GitHub, dernier article  |
| `/about`   | Parcours, expériences, centres d'intérêt         |
| `/blog`    | Articles techniques                              |
| `/project` | Présentation des projets                         |
| `/tools`   | Stack & outils                                   |
| `/contact` | Formulaire de contact                            |

## Articles

Les articles sont stockés dans `src/content/blog`. Pour publier le contenu
complet d'un article, utilisez `draft: false`. Pour annoncer un article qui
n'est pas encore finalisé, utilisez `teaser: true` : il restera visible et
cliquable dans le blog, mais sa page n'affichera que le champ `description`
(aperçu) et une mention indiquant qu'il est en préparation.

```yaml
---
title: "Mon article à venir"
description: "L'aperçu de l'article."
pubDate: '2026-09-01'
draft: false
teaser: true
progress: 35
---
```

Les deux options sont indépendantes : `draft: true` masque complètement
l'article, tandis que `teaser: true` conserve sa page et sa présentation dans
les listes. Le champ optionnel `progress` peut être ajouté pour afficher
l'avancement de l'article, avec une valeur entre 0 et 100.

---

## Développement

```sh
npm install      # Installation des dépendances
npm run dev      # Serveur local — http://localhost:4321
npm run build    # Build de production dans ./dist/
npm run preview  # Prévisualisation du build
```

---

Code source disponible librement. Textes et visuels soumis au droit d'auteur.