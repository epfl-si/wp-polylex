# Specifications / Rules

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
* Sous-rubrique: a une valeur par défaut.
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

L'admin peut tout faire. Il devrait avoir conscience des conséquences lors d'un changement sur les rubriques, sous-rubriques et responsables.

Cas d'utilisation n°1: Changement d'un responsable
Un responsable quitte l'EPFL. Un successeur doit "hériter" de tous ses lexes.

Cas d'utilisation n°2: Gestion des rubriques et sous-rubriques
Si on supprime une rubrique, il faut avoir conscience que tous les lexes liées à cette rubrique référenceront une rubrique qui n'existe plus.
