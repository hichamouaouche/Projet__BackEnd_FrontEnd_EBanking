# eBanking Frontend Enterprise (Angular 21)

Frontend completement reconstruit avec Angular moderne, Angular Material, architecture modulaire et integration directe avec le backend Spring Boot existant.

## Analyse backend prise en compte

Routes API detectees et connectees:

- `GET /customers`
- `GET /customers/{id}`
- `POST /customers`
- `PUT /customers/{id}`
- `DELETE /customers/{id}`
- `GET /accounts`
- `GET /accounts/{accountId}`
- `GET /accounts/{accountId}/operations`
- `GET /accounts/{accountId}/pageoperations?page={n}&size={n}`

Notes securite backend:

- Aucun endpoint JWT/refresh token detecte dans ce backend.
- Aucun module Spring Security/roles detecte.
- Le frontend inclut donc une couche auth/guard/interceptor prete, avec session locale de dev pour proteger les routes UI.

## Architecture frontend

- `src/app/core`: auth, guards, interceptors, services transverses
- `src/app/features/auth`: ecran login
- `src/app/features/dashboard`: KPI et activite recente
- `src/app/features/accounts`: liste + detail + historique operations
- `src/app/features/transactions`: operations par compte
- `src/app/features/users`: CRUD clients (users metier)
- `src/app/features/admin`: vue administration
- `src/app/features/profile`: profil session
- `src/app/features/settings`: mode clair/sombre
- `src/app/shared/models`: interfaces TypeScript mappees sur DTO backend

## Prerequis

- Node.js LTS (20+ recommande)
- npm

## Installation

Depuis `ebanking-frontend`:

```bash
npm install
```

## Lancement

```bash
npm start
```

Application: `http://localhost:4200`

## Build production

```bash
npm run build
```

## Redemarrage

1. Arreter le serveur avec `Ctrl + C`.
2. Relancer `npm start`.

## Depannage

- Si `Port 4200 is already in use`, repondez `Y` pour un autre port ou fermez l'autre processus.
- Si erreurs API, verifier que le backend tourne sur `http://localhost:8085`.
- Si CORS, verifier `@CrossOrigin("*")` sur les controllers backend.
