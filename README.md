# Kusina

Everyday recipes with an easy way to find the next dish worth cooking.

Kusina is a React + Vite single-page app that lets you search meals by name, browse by A–Z, explore ingredients and categories, save favorites, and sign in/up via Firebase Auth.

**Version:** 1.0.0

## Features

- Search recipes by name
- Browse recipes by letter (A–Z)
- Explore all categories and ingredients
- View full recipe details (ingredients, instructions, and YouTube video)
- Save favorites to Firebase Realtime Database
- Firebase Auth sign in / sign up

## Tech Stack

- [React](https://react.dev) 18 + [React Router](https://reactrouter.com) 6
- [Redux Toolkit](https://redux-toolkit.js.org) + React Redux
- [Vite](https://vitejs.dev) 5
- [Tailwind CSS](https://tailwindcss.com) 3 + [DaisyUI](https://daisyui.com)
- [Firebase Auth & Realtime Database](https://firebase.google.com)
- [TheMealDB](https://www.themealdb.com) API

## Project Structure

```
src/
├── App.jsx                    # Routes & layout shell
├── main.jsx                   # Entry point
├── index.css                  # Global styles
└── Components/
    ├── Pages/                 # Page-level components (Login, Signup, Dashboard, ...)
    ├── RecipeDashboard/       # Recipe list & card components
    ├── Redux/                 # Store and slices (UserInfoSlice, MealInfoSlice)
    ├── useAuth.js             # Auth session helpers (localStorage-backed)
    └── ...                    # Nav, footer, sidebar, helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication** (Email/Password) and **Realtime Database** enabled
- (Optional) A free TheMealDB API key — not required for search, the public data endpoint is used

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your Firebase project values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key — used for sign in / sign up |
| `VITE_FIREBASE_DB_URL` | Realtime Database URL (e.g. `https://my-app-default-rtdb.firebaseio.com`) — used for favorites |

### 3. Run the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment

This project includes a `vercel.json` with a rewrite so client-side routes work on Vercel. Push to Git and import the repo in Vercel with the framework preset set to Vite, then set the `VITE_FIREBASE_*` environment variables in the Vercel dashboard.

## Environment Variables

See `.env.example` for the required keys. All variables are prefixed with `VITE_` so they are exposed to the browser at build time.

## Changelog

### 1.0.0

- Initial release
- Recipe search (name), A–Z browse, categories, and ingredients
- Recipe detail view with video
- Firebase Auth with favorites persistence