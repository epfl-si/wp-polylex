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
* Catégorie: a une valeur par défaut.
* Sous catégorie: a une valeur par défaut.
* Responsable: a une valeur par défaut.
* Date d'entrée en vigueur
* Date de révision



## Déployer une nouvelle version sur l'environnement de test d'openshift

On commence par builder l'image :

`docker build -t epflidevelop/polylex .`

On crée un tag pour cette image 

`docker tag epflidevelop/polylex:latest epflidevelop/polylex:0.1.10`

On pousse l'image dans dockerhub

`docker push epflidevelop/polylex:0.1.10`

`docker push epflidevelop/polylex:latest`

Ensuite on doit modifier la référence à cette image dans le déploiment openshift en éditant le fichier ansible/main.yml.

`
polylex_image_version: '0.1.10'
`

`cd ansible/`

`ansible-playbook playbook.yml -i hosts-test`




