<!--VarStream
title=Installer/utiliser Notepad++ sous Debian GNU/Linux
description=L'univers windows est pour moi du passé, mais Notepad++ reste un\
 must-have sans lequel coder serait bien moins sympa. Découvrez comment\
 profiter de ce logiciel sous Linux.
shortTitle=Notepad++ sous Debian
shortDesc=Voir la marche à suivre pour profiter de Notepad++ sous Linux
published=2012-05-08T09:38:03.000Z
lang=fr
location=FR
keywords.+=GNU/Linux
categories.+=keywords.*
-->

## Installer/utiliser Notepad++ sous Debian GNU/Linux

Notepad++ est selon moi le meilleur éditeur de code de tous les temps. Bien-sûr,
 ce n'est pas un IDE complet qui fait le café, mais l'avantage est qu'il démarre
 au quart de tour, on code sans attendre. De plus, Notepad++ offre de nombreuses
 fonctionnalités facilement accessibles comme voir le code de deux fichiers
 simultanément, ou d'un seul cloné dans l'autre vue. De nombreux plugins sont
 disponibles et les fonctionnalités les plus utilisées sont immédiatement
 accessibles. Les raccourcis clavier son intuitifs et la navigation clavier est
 un pur bonheur. Enfin, il permet de capturer une action pour la rejouer sur
 plusieurs fichiers/lignes.

![Notepad++ sous Debian GNU/Linux](http://www.insertafter.com/images/capture.png)

Bref, c'est pour cela que lors de mon passage à Debian GNU/Linux, j'ai
 immédiatement commencé l'installation de Notepad++. Voici la marche à suivre :

### Installation : Wine est votre ami

Wine est un logiciel qui permet d'exécuter des programmes windows sous Linux.
 Pour l'installer, il suffit de taper la commande suivante dans une console
 administrateur :

```sh
nfroidure@laptop:/# sudo aptitude install wine
```

Vous pouvez aussi utiliser le gestionnaire de paquet : Système > Administration > Gestionnaire de paquets Synaptics.

Une fois cela fait, il vous suffit de vous rendre sur le
 [site officiel de Notepad++](http://notepad-plus-plus.org "Télécharger Notepad++")
 (vous pouvez faire une donation) pour télécharger le programme. A la fin du
 téléchargement, vous devriez normalement pouvoir installer le logiciel avec
 Wine par un simple double clic. La procédure d'installation dure quelques
 minutes en fonction de votre matériel et Notepad++ est prêt à l'emploi.

### Utilisation : Wine est votre meilleur ami, SSHFS aussi !

Lorsque j'ai commencé à utiliser Notepad++, je m'attendais à avoir des problèmes
 de stabilité, des fonctionnalités manquantes etc... C'est avec grand plaisir
 que j'ai découvert que Wine est un excellent logiciel, tout quasiment est
 disponible : copier/coller, drag n' drop...

Le seul problème que j'ai rencontré est que j'ai un serveur sur lequel je me
 connectais en SSH grâce à l'interface graphique de Debian. Malheureusement, il
 m'a été impossible d'accéder à ces fichiers avec Notepad++. J'ai contourné le
 problème en installant l'excellent SSHFS.

SSHFS est un outil basé sur la librairie Fuse qui permet de wrapper un protocole
 pour le faire passer pour un système de fichiers aux yeux de Linux. Pour
 installer SSHFS :

```sh
nfroidure@laptop:/# sudo aptitude install sshfs
```
Puis, pour monter un système de fichiers, cela se passe dans un shell utilisateur :

```sh
nfroidure@laptop:/# mkdir /home/nfroidure/Bureau/Server && sshfs root@server:/home/ /home/nfroidure/Bureau/Server
```

Bien sûr, le mkdir n'est à faire qu'une seule fois à moins que vous supprimiez
 le fichier en même temps que vous démontez le système de fichiers. Une fois le
 système de fichiers monté, il est accessible comme un lecteur de disque sous 
 Wine. Pour démonter le système de fichiers, un simple :

 ```sh
 nfroidure@laptop:/# fusermount -u /home/nfroidure/Bureau/Server
 ```

 Si vous avez besoin quasi systématiquement de monter ce système de fichier,
  vous pouvez utiliser l'outil Système > Préférences > Applications au démarrage
  pour entrer la ligne de commande qui sera exécuté à chaque démarrage de votre
  session utilisateur. Bien-sûr, dans ce genre de cas, mieux vaut utiliser
  l'authentification par clé publique/privée mais ce n'est pas le sujet de cet
  article.

Enfin, le clic-droit sur un onglet n'affiche pas l'habituel menu contextuel
 permettant par exemple de déplacer/cloner un fichier vers l'autre vue. J'ai
 découvert quasiment par erreur que glisser déposer l'onglet dans l'espace
 d'édition permet d'afficher ce menu contextuel.

Finalement je n'ai eu qu'un seul problème non-résolu, la fonction pratique de
 Notepad++ consistant à prévenir lorsqu'un fichier ouvert dans Notepad++ a été
 édité en dehors cause un bug qui ne se résout que par la fermeture manuelle
 du programme (kill). Autant dire qu'il ne vaut mieux pas lire vos fichiers de
 log avec Notepad++ :D.

### Conclusion

Ce qui est valable ici pour Debian l'est tout autant pour les distributions
 basées sur Debian (Ubuntu par exemple), voire même d'autres distributions en
 changeant les commandes concernant le gestionnaire de paquets par celles de
 votre distribution préférée.

Vous n'avez plus aucune excuse pour passer à Debian maintenant que votre éditeur
 de code préféré est disponible ! Vous utilisez Notepad++ sous Linux ? Laissez
 moi savoir comment vous l'utilisez ou vos petites astuces pour une meilleure
 utilisation, ça se passe dans les commentaires !
