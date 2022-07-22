# Billapp backend

================ FR ====================

## Comment lancer l'API en local:

### Cloner le projet:
```
git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

### Acceder au repertoire du projet :
```
cd Billed-app-FR-Back
```

### Installer les dépendances du projet :

```
npm install
```
npm i -g sequelize
```

npm i -g sequelize-cli
```

npm i -g jest
```

npm install -g win-node-env
```

Ouvrir le fichier « package.json » et ajouter 
    "test": "set NODE_ENV=test&& sequelize-cli db:migrate&& jest test -i tests/user.test.js --watch",
    "run:dev": "set NODE_ENV=development&& sequelize-cli db:migrate&& node server.js"


### Lancer l'API :

```
npm run run:dev
```

### Accéder à l'API :

L'api est accessible sur le port `5678` en local, c'est à dire `http://localhost:5678`

## Utilisateurs par défaut:

### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```

