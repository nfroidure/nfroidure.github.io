<!--VarStream
title=Migrer toute une base de données vers UTF8
description=Vous avez peut-être commencé votre application avec les caractères\
 latins et pour des besoins d'internationalisation, vous souhaitez passer vos\
 bases en UTF8 ? La solution tient en un seul script.
shortTitle=Passer une base en UTF8
shortDesc=En savoir plus sur ce script
published=2012-05-10T08:48:13.000Z
lang=fr
location=FR
keywords.+=MySQL
categories.+=keywords.*
keywords.+=Outils
categories.+=keywords.*
-->

## Migrer toute une base de données vers UTF8

Dans la série, je mets à disposition mes petits bouts de code sur GitHub, voici
 maintenant le tour de mes scripts d'administration système. L'un d'entre eux me
 permet de passer toute une base de donnée en UTF8 grâce à un simple script.
 L'opération était fastidieuse avec PHPMyAdmin et la ligne de commande, c'est
 quand même plus fluide.

Pour récupérer le script :

```sh
root@server:~# wget https://raw.github.com/nfroidure/MysqlUtils/master/setdatabasecollate.sh
```

Ce petit script s'utilise tout simplement :

```sh
root@server:~# setdatabasecollate.sh elitwork root yes
Enter password of user : root

# Setting UTF8 for database elitwork
## Converting table kikoolol
### Converting field href (varchar(50))
### Converting field title (varchar(200))
### C1onverting field description (varchar(200))
### Converting field shorttitle (varchar(100))
### Converting field shortdesc (varchar(150))
## Converting table kikoolol2
### Converting field contain (longtext)
### Converting field context (varchar(30))
```

Comme vous pouvez le remarquer, le script prend en argument le nom de la base à
 convertir, le nom de l'utilisateur (optionnel) et une option "verbose" qui
 permet d'afficher ce que le script fait.

Comme vous pouvez le voir, il détecte les champs de type texte et leur assigne
 leur nouveau format. N'hésitez pas à proposer des amélioration en
 [forkant le projet](https://github.com/nfroidure/MysqlUtils "Voir le projet sur GitHub").
