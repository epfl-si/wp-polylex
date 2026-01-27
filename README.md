# wp-polylex

[![Test](https://github.com/epfl-si/wp-polylex/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/epfl-si/wp-polylex/actions/workflows/test.yml)
[![Build](https://github.com/epfl-si/wp-polylex/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/epfl-si/wp-polylex/actions/workflows/build.yml)

Cette application a pour but de stocker les textes légaux abrogés.

## Lancer l'application en local 

1) Se placer dans l'app : `cd app/`.

2) La première fois, installer les paquets : `meteor npm i` et copier le fichier *meteor-settings.example.json* puis le renommer en *meteor-settings.json*.

3) Exporter les variables utiles pour EntraID depuis */keybase/team/epfl_wppolylex/ansible_polylex_secrets.yml* : `export AUTH_ENTRA_<...>="..."`.

4) Lancer l'application : `meteor --settings meteor-settings.json` puis se rendre à l'adresse http://localhost:3000.

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
- Dans les fichiers d'inventaire Ansible ansible/inventory/*.yml
- On commit/push
- On crée le tag : `git tag -a <version> -m "polylex version <version>"`
- On push le tag : `git push --follow-tags`
Puis,
- `./ansible/polysible [--prod]`

## Autentification Entra ID et rôle

- Pour se connecter à l'application, il se faut s'authentifier avec Entra ID.
- Pour obtenir le rôle 'admin' il faut appartenir au groupe 'wp-polylex-admins' de l'application groups.epfl.ch
- Pour obtenir le rôle 'editor' il faut appartenir au groupe 'wp-polylex-editors' de l'application groups.epfl.ch

## Exécuter les tests en local

`TEST_WATCH=1 meteor test --driver-package meteortesting:mocha`

## Spécification de l'application
Voir [documentation](doc/SPECS.md)
