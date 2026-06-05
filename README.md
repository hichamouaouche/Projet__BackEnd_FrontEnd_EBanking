# Projet eBanking Enterprise — Rapport Technique

**Module :** Architecture JEE et Middleware  
**Filière :** SDIA — Semestre 2  
**Auteur :** Hicham Ouaouiche  
**Année universitaire :** 2025–2026

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Architecture globale](#2-architecture-globale)
3. [Technologies utilisées](#3-technologies-utilisées)
4. [Structure du projet](#4-structure-du-projet)
5. [Backend — Spring Boot](#5-backend--spring-boot)
6. [Sécurité JWT](#6-sécurité-jwt)
7. [Frontend — Angular 21](#7-frontend--angular-21)
8. [Fonctionnalités implémentées](#8-fonctionnalités-implémentées)
9. [API REST — Endpoints](#9-api-rest--endpoints)
10. [Démarrage du projet](#10-démarrage-du-projet)
11. [Configuration](#11-configuration)
12. [Améliorations apportées](#12-améliorations-apportées)

---

## 1. Présentation du projet

**eBanking Enterprise** est une application bancaire full-stack développée dans le cadre du module *Architecture JEE et Middleware*. Elle simule un système de gestion bancaire complet : création et gestion de clients, comptes courants et d'épargne, historique des opérations, authentification sécurisée par jeton JWT, et interface web professionnelle.

L'application est composée de deux parties indépendantes qui communiquent via une API REST :

- **Backend** : API REST Spring Boot 4 avec Spring Security 7 et JWT
- **Frontend** : SPA Angular 21 avec Angular Material, architecture standalone et signals

---

## 2. Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│                     Navigateur (port 4200)                  │
│                                                             │
│   Angular 21 SPA                                            │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │  Auth    │  │Dashboard │  │ Comptes  │  │  Clients │  │
│   │ Login /  │  │  KPIs    │  │ Détails  │  │  CRUD    │  │
│   │ Register │  │          │  │ Histori. │  │          │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                         │                                   │
│              AuthInterceptor (Bearer Token)                 │
└─────────────────────────┬───────────────────────────────────┘
                          │  HTTP / REST JSON
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (port 8085)                     │
│                                                             │
│   Spring Boot 4 — Spring Security 7                         │
│                                                             │
│   ┌─────────────────┐    ┌───────────────────────────────┐  │
│   │  JwtAuthFilter  │───▶│  SecurityFilterChain (CORS,   │  │
│   │  (Bearer Token) │    │  Session Stateless, JWT)      │  │
│   └─────────────────┘    └───────────────────────────────┘  │
│                                                             │
│   ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│   │ AuthCtrl     │  │ CustomerCtrl │  │ BankAccountAPI  │  │
│   │ /auth/**     │  │ /customers/**│  │ /accounts/**    │  │
│   └──────────────┘  └──────────────┘  └─────────────────┘  │
│                          │                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │    GlobalExceptionHandler (@RestControllerAdvice)   │   │
│   └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │          Service Layer (BankAccountServiceImpl)     │   │
│   └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│   ┌─────────────────────────────────────────────────────┐   │
│   │   JPA Repositories  ──▶  H2 In-Memory Database      │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technologies utilisées

### Backend

| Technologie | Version | Rôle |
|---|---|---|
| Java | 21 | Langage principal |
| Spring Boot | 4.0.6 | Framework applicatif |
| Spring Security | 7 | Authentification et autorisation |
| Spring Data JPA | 4.x | ORM et accès base de données |
| H2 Database | — | Base de données embarquée |
| JJWT | 0.12.6 | Génération et validation JWT |
| Lombok | — | Réduction code boilerplate |
| Maven | — | Gestionnaire de dépendances |

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| Angular | 21 | Framework SPA |
| Angular Material | 21 | Composants UI Material Design |
| TypeScript | 5.x | Langage typé |
| RxJS | 7 | Programmation réactive |
| Angular Signals | — | Gestion d'état réactive |

---

## 4. Structure du projet

```
digital-banking-frontEnd-web/
│
├── ebanking-backend/                  # API Spring Boot
│   └── src/main/java/org/sid/ebankingbackend/
│       ├── entities/                  # Entités JPA (BankAccount, Customer…)
│       ├── enums/                     # AccountStatus, OperationType
│       ├── exceptions/                # Exceptions métier
│       ├── dtos/                      # Objets de transfert (DTO)
│       │   ├── DebitRequest.java      # Requête débit
│       │   ├── CreditRequest.java     # Requête crédit
│       │   └── TransferRequest.java   # Requête virement
│       ├── mappers/                   # Conversion entité ↔ DTO
│       ├── repositories/              # Spring Data JPA
│       ├── services/                  # Logique métier
│       ├── security/                  # JWT, SecurityConfig, Filtre
│       └── web/                       # Contrôleurs REST
│           └── GlobalExceptionHandler.java  # Gestion centralisée des erreurs
│
└── ebanking-frontend/                 # SPA Angular
    └── src/app/
        ├── core/
        │   ├── auth/                  # AuthService, AuthGuard, modèles
        │   ├── services/              # BankingApiService, ThemeService…
        │   └── interceptors/          # Auth, Loading, Error
        ├── shared/models/             # Interfaces TypeScript
        └── features/
            ├── auth/                  # Login, Register
            ├── dashboard/             # Tableau de bord KPI
            ├── accounts/              # Liste comptes + détail
            ├── transactions/          # Historique opérations
            ├── users/                 # Gestion clients
            ├── admin/                 # Statistiques admin
            ├── profile/               # Profil utilisateur
            └── settings/              # Paramètres (thème…)
```

---

## 5. Backend — Spring Boot

### Modèle de données

Le modèle suit une hiérarchie avec héritage JPA (`TABLE_PER_CLASS`) :

```
Customer ─── 1:N ─── BankAccount (abstract)
                          ├── CurrentAccount  (overDraft)
                          └── SavingAccount   (interestRate)
                               │
                               └── 1:N ── AccountOperation
                                          (DEBIT / CREDIT)
```

### Couche service

`BankAccountServiceImpl` expose les opérations suivantes :

- `saveCustomer` / `updateCustomer` / `deleteCustomer`
- `listCustomers` / `searchCustomers(keyword)` ← recherche insensible à la casse
- `saveSavingBankAccount` / `saveCurrentBankAccount`
- `getAccountHistory(accountId, page, size)` ← pagination
- `debit(accountId, amount, description)`
- `credit(accountId, amount, description)`
- `transfer(accountIdSource, accountIdDest, amount)`

### Gestion des erreurs

Un `@RestControllerAdvice` (`GlobalExceptionHandler`) intercepte toutes les exceptions métier et retourne des réponses HTTP cohérentes :

| Exception | Code HTTP |
|---|---|
| `CustomerNotFoundException` | 404 Not Found |
| `BankAccountNotFoundException` | 404 Not Found |
| `BalanceNotSufficientException` | 400 Bad Request |

Format de réponse d'erreur :
```json
{
  "timestamp": "2026-06-05T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Customer not found"
}
```

---

## 6. Sécurité JWT

### Flux d'authentification

```
Client                    AuthController            JwtUtil
  │                            │                      │
  │── POST /auth/register ────▶│                      │
  │                            │─ BCrypt(password) ──▶│
  │                            │◀─ AppUser sauvé ─────│
  │                            │─ generateToken() ───▶│
  │◀── AuthResponse(token) ────│◀─ JWT signé ─────────│
  │                            │                      │
  │── POST /auth/login ───────▶│                      │
  │                            │─ validateCredentials▶│
  │◀── AuthResponse(token) ────│◀─ JWT signé ─────────│
  │                            │                      │
  │── GET /customers (Bearer)─▶│                      │
  │                     JwtAuthFilter extrait + valide │
  │◀── 200 OK (données) ───────│                      │
```

### Configuration Spring Security 7

```java
// Particularité Spring Security 7 : constructor injection obligatoire
DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
provider.setPasswordEncoder(new BCryptPasswordEncoder());

// Filter chain : stateless, JWT avant UsernamePasswordFilter
http.sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
    .authorizeHttpRequests(auth -> auth
        .requestMatchers("/auth/**", "/h2-console/**").permitAll()
        .requestMatchers("/customers/**", "/accounts/**").authenticated()  // protégé
        .anyRequest().authenticated());
```

### Structure du token JWT

```
Header  : { "alg": "HS256", "typ": "JWT" }
Payload : { "sub": "email", "role": "USER", "firstName": "...", "lastName": "...", "iat": ..., "exp": ...(+24h) }
Signature: HMAC-SHA256(secret ≥ 32 chars)
```

---

## 7. Frontend — Angular 21

### Architecture standalone et signals

Chaque composant est **standalone** (pas de NgModule). La gestion d'état utilise les **Signals** d'Angular 21 :

```typescript
// Signal réactif — mise à jour automatique du template
loading   = signal(false);
session   = signal<AppSession | null>(null);
darkMode  = signal(false);

// Computed — recalculé automatiquement quand session change
displayName = computed(() => this.session()?.firstName ?? 'Utilisateur');
initials    = computed(() => {
  const s = this.session();
  return s ? (s.firstName[0] + (s.lastName?.[0] ?? '')).toUpperCase() : '?';
});
```

### Filtre réactif avec toSignal

Pour connecter un `FormControl` à un `computed()` Angular, on utilise `toSignal` de `@angular/core/rxjs-interop` :

```typescript
// FormControl → Signal via toSignal
private readonly searchTerm = toSignal(this.search.valueChanges, { initialValue: '' });

// computed() réagit maintenant aux saisies de l'utilisateur
readonly filteredAccounts = computed(() => {
  const term = this.searchTerm().toLowerCase().trim();
  return !term ? this.accounts() : this.accounts().filter(...);
});
```

### Lazy Loading des routes

```typescript
{ path: 'dashboard',    loadComponent: () => import('./features/dashboard/...')  },
{ path: 'accounts',     loadComponent: () => import('./features/accounts/...')   },
{ path: 'transactions', loadComponent: () => import('./features/transactions/...')},
{ path: 'users',        loadComponent: () => import('./features/users/...')       },
{ path: 'admin',        loadComponent: () => import('./features/admin/...')       },
{ path: 'profile',      loadComponent: () => import('./features/profile/...')     },
{ path: 'settings',     loadComponent: () => import('./features/settings/...')    },
```

### Intercepteurs HTTP

| Intercepteur | Rôle |
|---|---|
| `AuthInterceptor` | Ajoute `Authorization: Bearer <token>` à chaque requête |
| `LoadingInterceptor` | Active/désactive l'indicateur de chargement global |
| `ErrorInterceptor` | Capture les erreurs HTTP et affiche une notification |

### Système de thème (light / dark)

```typescript
// ThemeService — applique data-theme sur <html>
setDark(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  this.darkMode.set(dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
```

### Mock login (développement uniquement)

Le fallback mock est désormais conditionnel à l'environnement :

```typescript
catchError((err) =>
  environment.production ? throwError(() => err) : this.mockLogin(payload),
)
```

En production (`environment.production = true`), toute erreur de login est propagée normalement. En développement, le mock permet de travailler sans backend.

---

## 8. Fonctionnalités implémentées

| Module | Fonctionnalités |
|---|---|
| **Authentification** | Inscription (Register), Connexion (Login), JWT, Protection des routes (AuthGuard) |
| **Dashboard** | KPI cards (clients, comptes, solde total, opérations), top 5 comptes, activité récente |
| **Comptes** | Liste des comptes (courant/épargne), recherche réactive, détail avec historique paginé |
| **Transactions** | Débit, Crédit, Virement via API REST — historique CREDIT/DEBIT |
| **Clients (Users)** | Liste, recherche par nom, ajout, modification, suppression de clients |
| **Détail client** | Fiche client avec ses comptes bancaires associés |
| **Admin** | Statistiques système, top 5 comptes par solde |
| **Profil** | Informations de session, avatar, rôle et date de connexion |
| **Paramètres** | Bascule Dark/Light mode persistante, informations de version |

---

## 9. API REST — Endpoints

### Authentification

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Non | Créer un compte utilisateur |
| `POST` | `/auth/login` | Non | Se connecter, retourne un token JWT |

**Corps de `/auth/login` :**
```json
{ "email": "user@exemple.com", "password": "motdepasse" }
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "user@exemple.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "USER",
  "expiresIn": 86400000
}
```

### Clients

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/customers` | Oui | Liste tous les clients |
| `GET` | `/customers/{id}` | Oui | Détail d'un client |
| `GET` | `/customers/search?keyword=X` | Oui | Recherche par nom (insensible à la casse) |
| `POST` | `/customers` | Oui | Créer un client |
| `PUT` | `/customers/{id}` | Oui | Modifier un client |
| `DELETE` | `/customers/{id}` | Oui | Supprimer un client |

### Comptes bancaires

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/accounts` | Oui | Liste tous les comptes |
| `GET` | `/accounts/{accountId}` | Oui | Détail d'un compte |
| `GET` | `/accounts/{accountId}/operations` | Oui | Historique complet |
| `GET` | `/accounts/{accountId}/pageoperations?page=0&size=5` | Oui | Historique paginé |
| `POST` | `/accounts/debit` | Oui | Effectuer un débit |
| `POST` | `/accounts/credit` | Oui | Effectuer un crédit |
| `POST` | `/accounts/transfer` | Oui | Effectuer un virement |

**Corps de `/accounts/debit` :**
```json
{ "accountId": "uuid", "amount": 500.0, "description": "Retrait DAB" }
```

**Corps de `/accounts/transfer` :**
```json
{ "accountSource": "uuid1", "accountDestination": "uuid2", "amount": 200.0 }
```

---

## 10. Démarrage du projet

### Prérequis

- **Java 21** (JDK)
- **Node.js LTS** + npm
- Aucune base de données externe requise (H2 embarqué)

### Lancer le Backend

```powershell
cd ebanking-backend
.\mvnw.cmd spring-boot:run
```

Le backend démarre sur `http://localhost:8085`.  
Console H2 accessible sur : `http://localhost:8085/h2-console`

### Lancer le Frontend

```powershell
cd ebanking-frontend
npm install
npm start
```

L'application ouvre sur `http://localhost:4200`.

### Ordre de démarrage obligatoire

```
1. Backend  (port 8085)  →  2. Frontend (port 4200)
```

---

## 11. Configuration

### Backend — `application.properties`

```properties
server.port=8085
spring.datasource.url=jdbc:h2:mem:ebanking
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.hibernate.ddl-auto=create-drop

# JWT
jwt.secret=ebanking-super-secret-jwt-key-must-be-at-least-32-chars!
jwt.expiration=86400000
```

### Frontend — `environment.ts`

```typescript
export const environment = {
  production: false,       // true en production — désactive le mock login
  appName: 'eBanking Enterprise',
  apiBaseUrl: 'http://localhost:8085',
};
```

---

## 12. Améliorations apportées

Cette section documente les corrections et améliorations appliquées sur la base du code initial.

### Backend

| # | Fichier | Problème | Correction |
|---|---|---|---|
| 1 | `SecurityConfig.java` | `/customers/**` et `/accounts/**` étaient `permitAll()` — données bancaires accessibles sans authentification | Changé en `.authenticated()` |
| 2 | `BankAccountRestAPI.java` | `POST /accounts/debit`, `/credit`, `/transfer` documentés mais absents du contrôleur | Endpoints ajoutés avec DTOs dédiés |
| 3 | `CustomerRestController.java` | `GET /customers/search` documenté mais absent | Endpoint ajouté |
| 4 | `CustomerRepository.java` | Pas de méthode de recherche | `findByNameContainsIgnoreCase(String)` ajouté |
| 5 | `BankAccountService.java` | Interface ne déclarait pas `searchCustomers` | Méthode ajoutée à l'interface et à l'implémentation |
| 6 | `BankAccountServiceImpl.java` | Pattern `orElse(null)` + null check manuel | Remplacé par `orElseThrow()` |
| 7 | `BankAccountServiceImpl.java` | Log `updateCustomer` affichait "Saving new Customer" | Corrigé en "Updating Customer" |
| 8 | `GlobalExceptionHandler.java` | Absence de gestionnaire d'erreurs global — codes HTTP incohérents | `@RestControllerAdvice` créé (404, 400) |
| 9 | `BankAccountRestAPI.java` | Annotation `@CrossOrigin("*")` redondante avec la config CORS globale | Supprimée |

### Frontend

| # | Fichier | Problème | Correction |
|---|---|---|---|
| 1 | `auth.service.ts` | Mock login actif inconditionnellement — tout login fonctionnait si le backend était down | Conditionné à `!environment.production` |
| 2 | `dashboard.component.ts` | Clients et comptes chargés en série (`switchMap`) — latence inutile | Remplacé par `forkJoin` (requêtes parallèles) |
| 3 | `accounts.component.ts` | `computed()` basé sur `search.value` (non réactif) — filtre jamais mis à jour | Remplacé par `toSignal(search.valueChanges)` |
| 4 | `banking-api.service.ts` | Méthodes `debit`, `credit`, `transfer`, `searchCustomers` absentes | Toutes les méthodes ajoutées avec types dédiés |

---

## Points techniques notables

**Spring Security 7 — breaking change :**  
Le constructeur `new DaoAuthenticationProvider()` sans argument a été supprimé. Il faut obligatoirement passer `UserDetailsService` au constructeur : `new DaoAuthenticationProvider(userDetailsService)`.

**CORS :**  
Configuré côté Spring via `CorsConfigurationSource` (bean) pour autoriser les requêtes `localhost:4200`. L'annotation `@CrossOrigin` sur les contrôleurs est redondante et supprimée.

**Sessions stateless :**  
Aucun cookie ni session serveur. L'état d'authentification est entièrement porté par le token JWT stocké dans `localStorage`.

**toSignal + computed() :**  
Pour rendre un `FormControl` RxJS compatible avec le système de Signals Angular, `toSignal()` de `@angular/core/rxjs-interop` fait le pont entre les deux paradigmes réactifs.

**GlobalExceptionHandler :**  
Le `@RestControllerAdvice` centralise la gestion des erreurs : les contrôleurs peuvent lancer leurs exceptions métier sans logique de catch, et le handler les convertit en réponses JSON structurées avec le bon code HTTP.

---

*Projet réalisé dans le cadre du module Architecture JEE et Middleware — SDIA S2 — 2025/2026*
