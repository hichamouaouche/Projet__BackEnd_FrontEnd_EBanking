# eBanking — Projet complet

Ce dépôt contient deux parties : le backend Spring Boot (`ebanking-backend`) et le frontend Angular (`ebanking-frontend`). Ce README centralise les étapes pour démarrer, redémarrer et dépanner rapidement les deux parties.

**Prérequis**

- Java 21
- Maven (ou utiliser le wrapper `mvnw` fourni)
- Le backend utilise H2 embarque, donc aucune base locale n'est requise
- Node.js (LTS recommandé) et `npm`

**Rappel des ports**

- Backend Spring Boot : `8085`
- Frontend Angular : `4200`

**1) Backend — résumé rapide**

- Dossier : [ebanking-backend/README.md](ebanking-backend/README.md)
- Configuration principale : `src/main/resources/application.properties` (base de données, port).

Démarrer en développement (Windows PowerShell) :

```powershell
.\mvnw.cmd spring-boot:run
```

Builder et tests :

```powershell
.\mvnw.cmd clean install
```

Redémarrer : arrêter le processus (Ctrl+C) puis relancer la commande ci-dessus.

**2) Frontend — résumé rapide**

- Dossier : [ebanking-frontend/README.md](ebanking-frontend/README.md)

Installer les dépendances et démarrer :

```bash
npm install
npm start
```

Ou équivalent avec l'Angular CLI :

```bash
ng serve
```

Redémarrer : arrêter le serveur (Ctrl+C) puis `npm start`.

**3) Ordre recommandé de démarrage**

1. Démarrer le backend (`8085`).
2. Démarrer le frontend (`4200`).

Le frontend appelle des endpoints comme `http://localhost:8085/customers`, donc le backend doit être disponible avant de lancer l'UI.

**4) Dépannage rapide**

- Si le backend ne démarre pas : vérifier la configuration H2 dans `ebanking-backend/src/main/resources/application.properties`.
- Si le frontend affiche des erreurs réseau ou CORS : vérifier que le backend est sur le port `8085` et que les contrôleurs autorisent les requêtes CORS (les controllers actuels utilisent `@CrossOrigin("*")`).
- Si un port est occupé : modifier `server.port` (backend) ou fermer l'autre processus (frontend `4200`).

**Fichiers utiles**

- README backend : [ebanking-backend/README.md](ebanking-backend/README.md)
- README frontend : [ebanking-frontend/README.md](ebanking-frontend/README.md)

Si tu veux, j'ajoute une section « déploiement » (docker / build production) ou j'automatise un script `start-all.sh`/`start-all.ps1` pour lancer backend+frontend ensemble. Veux-tu que je le fasse ?
