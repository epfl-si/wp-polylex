# wp-polylex

[![Test](https://github.com/epfl-si/wp-polylex/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/epfl-si/wp-polylex/actions/workflows/test.yml)
[![Build](https://github.com/epfl-si/wp-polylex/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/epfl-si/wp-polylex/actions/workflows/build.yml)

Cette application a pour but de stocker les textes légaux abrogés.

## Lancer l'application en local 
Se placer dans l'app :

`cd app/`

Puis lancer la commande :

`meteor --settings settings.json`

Ensuite aller à l'adresse http://localhost:3000

Vous êtes alors redirigé sur une URL du type https://localhost:3000/?key=aop0wd1yo3abmhr0z5w1wbcz9sj6z9cc il suffit alors de supprimer le s de https://

## Utilisation du CLI

Le CLI permet d'importer les données de prod ou de test dans la DB locale.

Pour installer le CLI en local, il faut:
- Se placer dans le répetoire `cli/`
- Faire un `npm install`
- Faire un `npm install -g ./`

Lorsque le CLI est installé :
- Se placer à la racine du projet polylex
- On peut maintenant faire un `polylex-cli --help`

```
greg@epfl:~/workspace-idevfsd/wp-polylex$ polylex-cli --help 
Usage: polylex-cli [options] [command]

Options:
  -h, --help               display help for command

Commands:
  clean-all-documents      Delete all documents from the local MongoDB
  restore-test-db          Restore the test MongoDB on local MongoDB
  restore-prod-db          Restore the production MongoDB on local MongoDB
  restore-prod-db-on-test  Restore the production MongoDB on test MongoDB
  help [command]           display help for command
```

## Déployer une nouvelle version sur Openshift
Pour commencer, si ce n'est déjà fait, on doit changer le numéro de version :
- Dans le fichier app/package.json
- Dans le composant Header app/imports/ui/header/Header.jsx pour correspondre à la version du fichier app/package.json
- Dans les fichiers d'inventaire Ansible ansible/inventory/*.yml
- On commit/push
- On crée le tag : `git tag -a 1.0 -m "polylex version 1.0"`
- On push le tag : `git push --follow-tags`
Puis,
- `./ansible/polysible [--prod]`

## Plus d'info sur la configuration OpenShift

<a href="https://docs.google.com/document/d/165DWXhxMyjb4EY8wQMwvGlTYUddYvgMnaAP2OR7-Foo" target="_blank">Déploiement de Polylex sur OpenShift</a>

## Autentification Tequila et rôle

- Pour se connecter à l'application, il se faut s'authentifier Tequila.
- Pour obtenir le rôle 'admin' il faut appartenir au groupe 'wp-polylex-admins' de l'application groups.epfl.ch
- Pour obtenir le rôle 'editor' il faut appartenir au groupe 'wp-polylex-editors' de l'application groups.epfl.ch

ATTENTION :
A la différence de wp-veritas, la mise à jour de meteor 1.9 ne pose pas de problème. Donc dans le Dockerfile on utilise node en version 12
`FROM node:12.14.0-alpine`

## Exécuter les tests en local

`TEST_WATCH=1 meteor test --driver-package meteortesting:mocha`

## Mise à jour de paquet alanning:roles

La mise à jour du paquet `alanning:roles` de la version 1 à la version 3 a necessité des changements en DB.
En effet, il faut supprimer la collection `roles` et la re-créée via le fichier server/fixtures.js
De plus, le user n'a plus d'attributs roles mais une nouvelle collection `role-assignement`

### procédure de mise en prod

Lancer le déploiement => ce qui va exécuter `updateRoles` qui supprime la collection `roles` et qui supprime l'attribut roles dans chaque user. La collection est re-créée automatiquement.

## Spécification de l'application
Voir [documentation](doc/SPECS.md)
