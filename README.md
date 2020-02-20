# wp-polylex

Cette application a pour but de stocker les textes légaux abrogés.

## Lancer l'application en local 

Se positionner dans le répertoire app/ et lancer la commande :

`cd app/`

`meteor --settings settings.json`

Ensuite aller à l'adresse http://localhost:3000

Vous êtes alors redirigé sur une URL du type https://localhost:3000/?key=aop0wd1yo3abmhr0z5w1wbcz9sj6z9cc il suffit alors de supprimer le s de https://

## Validation du formulaire du LEX

### Validation du champ LEX

* Un lex doit être au format x.x.x ou x.x.x.x avec x un nombre entier.
* Un lex doit être unique.

### Validation des URLs

* Vérification de la validité d'une URL
* Supprime l'éventuel "/" à la fin de l'URL

### Validation des champs obligatoires

Les champs obligatoires sont :
* Lex
* Titre en FR et EN 
* URL en FR et EN
* Description en FR et EN
* Rubrique: a une valeur par défaut.
* Sous rubrique: a une valeur par défaut.
* Responsable: a une valeur par défaut.
* Date d'entrée en vigueur
* Date de révision

## Roles 

Il existe 3 rôles :
- le rôle epfl-member 
- le rôle editor
- le rôle admin

Lorsque l'utilisateur s'authenfie la 1ère fois à l'application polylex, on lui attribue automatiquement le rôle epfl-member.
Avec ce rôle, l'utilisateur ne peut pour l'instant rien faire.

Un utilisateur avec le rôle éditeur peut lister, créer, éditer, supprimer des lexes mais ne peut pas gérer les rubriques, les sous-rubriques et les responsables.

L'admin peut tout faire. Il devrait avoir conscience des conséquences lors d'un changement sur les rubriques, sous rubriques et responsables.

Cas d'utilisation n°1: Changement d'un responsable 
Un responsable quitte l'EPFL. Un successeur doit "hériter" de tous ses lexes.

Cas d'utilisation n°2: Gestion des rubriques et sous-rubriques
Si on supprime une rubrique, il faut avoir conscience que tous les lexes liées à cette rubrique référenceront une rubrique qui n'existe plus.

## Déployer une nouvelle version sur l'environnement de test d'openshift

Pour commencer, on doit changer le numéro de version : 
- Fichier ansible/roles/epfl.polylex/vars/main.yml
- Dans le composant Header app/imports/ui/header/Header.jsx
- On commit/push 
- On crée le tag : `git tag -a 1.0 -m "polylex version 1.0"`
- On push le tag : `git push --follow-tags`

On commence par builder l'image :

`docker build -t epflsi/polylex .`

On crée un tag pour cette image 

`docker tag epflsi/polylex:latest epflsi/polylex:0.1.10`

On pousse l'image dans dockerhub

`docker push epflsi/polylex:0.1.10`

`docker push epflsi/polylex:latest`

Ensuite on doit modifier la référence à cette image dans le déploiment openshift en éditant le fichier ansible/main.yml.

`
polylex_image_version: '0.1.10'
`

`cd ansible/`

`ansible-playbook playbook.yml -i hosts-test`

## Déployer une nouvelle version sur l'environnement de prod d'openshift

`ansible-playbook playbook.yml -i hosts-prod`

## Plus d'info sur la configuration OpenShift

<a href="https://docs.google.com/document/d/165DWXhxMyjb4EY8wQMwvGlTYUddYvgMnaAP2OR7-Foo" target="_blank">Déploiement de Polylex sur OpenShift</a>

## Autentification Tequila et rôle

- Pour se connecter à l'application, il se faut s'authentifier Tequila.
- Pour obtenir le rôle 'admin' il faut appartenir au groupe 'wp-polylex-admins' de l'application groups.epfl.ch
- Pour obtenir le rôle 'editor' il faut appartenir au groupe 'wp-polylex-editors' de l'application groups.epfl.ch

ATTENTION :
Pour mettre à jour l'image avec FROM node:10.19-alpine 
On a du utiliser node version 10 car avec la 12 on avait un prob avec Fiber 
FROM node:10.19-alpine