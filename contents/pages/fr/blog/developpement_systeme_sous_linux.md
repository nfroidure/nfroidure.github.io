<!--VarStream
title=Critique du livre "Développement système sous Linux" de Christophe Blaess
description=Cette semaine, j'ai lu l'un des livres les plus intéressants qu'il\
 m'ait été donné de lire.
shortTitle=Livre sur le dév. Linux
shortDesc=En savoir plus sur ce livre
published=2012-02-15T19:31:26.000Z
lang=fr
location=FR
keywords.+=C
categories.+=keywords.*
keywords.+=GNU/Linux
categories.+=keywords.*
keywords.+=Critiques de livres
categories.+=keywords.*
-->

# Critique du livre "Développement système sous Linux" de Christophe Blaess

J'ai déjà lu de nombreux livre sur Linux, notamment ceux de Raphaël Hertzog sur
 Debian GNU/Linux, ma distribution desktop et serveur. Mais là, j'ai découvert
 une perle qui surclasse tous les autres en terme de technicité.

Developpement système sous Linux est une mine d'or pour qui souhaite comprendre
 le fonctionnement de Linux. Je n'ai pas forcément vocation à écrire des
 programmes en C, mais cet ouvrage m'a permis d'avoir une compréhension très
 fine de la façon dont les programmes exploitent les capacités de Linux.

Autant j'ai eu beaucoup de plaisir à lire les livres sur l'aspect théorique de
 C++, autant celui-là m'a permis de me rapprocher au plus près de la plateforme.
 Je me sers maintenant quotidiennement des principes appris dans ce livre pour
 de l'administration système.

Comment fonctionnement les processus, qu'est-ce que les signaux, comment sont-il
 gérés ? Comment la mémoire est gérée ?

On en apprend aussi beaucoup sur les entrées sorties, le fonctionnement des
 pipes, les sockets etc...

Ce livre est un must-have, même pour ceux qui ne font pas du C tous les jours
 car il permet de savoir développer de petits programmes qui rendent bien
 service.

J'ai, par exemple, créé avec l'aide de ce livre, un
 [programme en ligne de commande](https://github.com/nfroidure/X1-GPS-Logger "Voir la source de ce programme")
 qui logge les positions GPS émises avec un boitier X1 Intellitrac (finalement,
 [j'ai fais un billet sur ce logger et xinetd](./xinetd_super_server.html "Lire ce billet sur le log des boitiers X1 Intellitrac")).
 En utilisant xinetd, j'ai pu créer un serveur simple et performant gérant une
 flotte d'une trentaine de véhicules.

