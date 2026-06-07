# HMI V2

HMI V2 is a React, TypeScript, and Vite application for building a modern human-machine interface dashboard. The project includes routed pages, reusable UI components, form validation, and Tailwind CSS styling.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Folder Structure](#project-folder-structure)
- [Available Scripts](#available-scripts)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/KeionDz/HMI-V2.git
cd HMI-V2
```

### Create or Switch Branches

Create a new branch:

```bash
git switch -c your-branch-name
```

Switch to an existing branch:

```bash
git switch your-branch-name
```

### Install Dependencies

```bash
npm i
```

### Run the Development Server

```bash
npm run dev
```

The app runs locally at:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite will show the available localhost URL in the terminal.

## Project Folder Structure

```text
HMI-V2/
+-- public/
|   +-- favicon.svg
|   +-- icons.svg
+-- src/
|   +-- assets/
|   |   +-- hero.png
|   |   +-- react.svg
|   |   +-- vite.svg
|   +-- components/
|   |   +-- layout/
|   |   |   +-- navbar.tsx
|   |   +-- pages/
|   |   |   +-- home.tsx
|   |   |   +-- login-page.tsx
|   |   +-- sections/
|   |   |   +-- camera-feed.tsx
|   |   |   +-- pallet-manager.tsx
|   |   |   +-- test-section.tsx
|   |   +-- ui/
|   |       +-- button.tsx
|   |       +-- card.tsx
|   |       +-- field.tsx
|   |       +-- input.tsx
|   |       +-- label.tsx
|   |       +-- layer-selector.tsx
|   |       +-- login-form.tsx
|   |       +-- navigation-menu.tsx
|   |       +-- separator.tsx
|   |       +-- stat-card.tsx
|   +-- lib/
|   |   +-- utils.ts
|   +-- routes/
|   |   +-- app-routes.tsx
|   +-- schemas/
|   |   +-- login-schema.ts
|   +-- App.css
|   +-- index.css
|   +-- main.tsx
+-- components.json
+-- eslint.config.js
+-- index.html
+-- package-lock.json
+-- package.json
+-- tsconfig.app.json
+-- tsconfig.json
+-- tsconfig.node.json
+-- vite.config.ts
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
