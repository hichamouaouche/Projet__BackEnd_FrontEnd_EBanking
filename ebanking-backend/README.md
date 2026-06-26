# eBanking Backend (Spring Boot)

API REST de l'application eBanking.

## Prerequis

- Java 21
- Maven 3.9+ (ou utiliser le wrapper `mvnw` fourni)
- Aucune base externe n'est requise: le backend utilise H2 embarque

## Configuration

Le backend lit sa configuration dans `src/main/resources/application.properties`.

Configuration actuelle:

- Port API: `8085`
- Base de donnees: `jdbc:h2:mem:ebankingdb`
- Utilisateur H2: `sa`
- Mot de passe H2: vide (`spring.datasource.password=`)
- Console H2: `http://localhost:8085/h2-console`
- Strategie schema JPA: `create` (recree le schema au demarrage)

## Demarrer le backend

Depuis le dossier `ebanking-backend`:

```bash
./mvnw spring-boot:run
```

Sous PowerShell Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

L'API sera disponible sur:

- `http://localhost:8085`
- Exemple endpoint: `http://localhost:8085/customers`
- Console H2: `http://localhost:8085/h2-console`

## Redemarrer le backend

1. Arreter le serveur en cours avec `Ctrl + C` dans le terminal backend.
2. Relancer:

```powershell
.\mvnw.cmd spring-boot:run
```

## Build et tests

Depuis `ebanking-backend`:

```powershell
.\mvnw.cmd clean install
```

## URLs utiles

- API clients: `GET /customers`
- API comptes: `GET /accounts`

## Depannage rapide

- Si port occupe (`8085`), fermer l'ancien processus ou changer `server.port`.
- Si erreur DB, verifier la configuration H2 dans `application.properties` et relancer l'application.
- Le frontend attend le backend sur `http://localhost:8085`.
