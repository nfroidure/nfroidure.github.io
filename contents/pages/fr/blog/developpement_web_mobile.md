<!--VarStream
title=Tester ses sites web sur les mobiles
description=On ne peut pas toujours s'offrir un téléphone haut de gamme pour\
 tester son site web. Heureusement, les émulateurs sont là !
shortTitle=Tester son site mobile
shortDesc=Voir les astuces pour tester son site mobile
published=2012-05-09T19:47:14.000Z
lang=fr
location=FR
keywords.+=Outils
categories.+=keywords.*
-->

## Tester ses sites web sur les mobiles

### Fennec : Firefox pour les mobiles

![Capture d'écran de Fennec](http://www.insertafter.com/images/sans_titre.png)

Firefox mobile
 [propose un émulateur](http://www.mozilla.org/fr/mobile/ "Voir le site de Firefox Mobile")
 permettant de visualiser son site ou de développer des extensions. Un binaire
 est disponible pour toutes les plateformes. J'ai testé la version Linux. Aucun
 problème, il suffit d'exécuter le binaire et on se retrouve sur Fennec.

J'ai découvert ce navigateur qui semble prometteur. On retrouve cependant un
 des gros points noir de Gecko : le flexible box model qui est mal implémenté.
 Sinon, l'interface utilisateur est agréable, j'aime beaucoup le slide sur les
 côtés pour avoir des fonctions supplémentaires facilement (onglets à gauche,
 favoris à droite) ainsi que la taille des boutons qui sont pratiques pour les
 gros doigts.

Bon et puis bien sûr il y a le côté libre et ouvert de la communauté Mozilla,
 votre vie privée est respectée. En revanche, on ne retrouve Fennec que sur
 Maemo et Android. Et bientôt peut-être sur Boot2Gecko, le nouveau projet de
 téléphone full web de Mozilla.

Attention ! Il semble que Mozilla ne propose plus de nouvelles versions de
 Fennec à éxecuter directement. De plus, le terme émulateur n'est pas vraiment
 opportun puisqu'il s'agit d'un binaire exécutable comme Firefox. Mozilla
 recommande officieusement de faire tourner Fennec sur l'émulateur Android
 ou de compiler soi-même les nightly builds.

### Opera Mobile

![Capture d'écran d'Opéra Mobile](http://www.insertafter.com/images/4moys3w8.defaultmoz-screenshot.jpg)

Opéra a également créé son émulateur. Ce dernier est très semblable à celui de
 Fennec, il se distingue néanmoins par le fait qu'on peut choisir parmi une
 liste de différents types de téléphones afin de bénéficier de leur dimensions
 réèlles. Une fonction de retournement permet aussi de tester le comportement
 de votre site en fonction de l'orientation du périphérique.

Sur la [page de téléchargement](http://www.opera.com/developer/tools/mobile/ "Télécharger l'émulateur Opéra"),
 je n'ai le choix que pour Linux, mais j'imagine que Windows au moins est de la
 partie. Un navigateur très pratique lui aussi qui est présent dans le monde
 mobile depuis longtemps. Il existe une autre version d'Opéra Mobile, Opéra
 Mini, conçu pour les téléphones bas de gamme. Il dispose d'un
 [simulateur en ligne](http://www.opera.com/developer/tools/mini/ "Voir le similateur").

 ### Android Browser + Google Chrome

C'est tout de suite plus compliqué pour tester vos site avec le navigateur
 d'Android. En effet, il faut télécharger le SDK Android, puis, télécharger
 les différents packages correspondant aux différentes versions. Pour
 télécharger la version Béta de
 [Chrome for Android](http://www.google.com/intl/en/chrome/android/ "Voir la page dédiée à Chrome For Android")
 (ne fonctionne que sous Android 4.0), ce sera encore plus complqiué puisqu'il
 faudra le trouver dans le market (réputée peu efficace) et/ou se connecter
 à son compte Google.

Bien-sûr ces deux navigateurs embarquent le moteur de rendu webkit donc ils
 sont assez rapides et supportent bien les nouveautés de HTML5. Le
 [SDK d'Android](http://developer.android.com/sdk/index.html "Télécharger le SDK Android")
 est disponible pour MacOSX, Linux et Windows.

### Safari Mobile

Le SDK est uniquement disponible pour les possesseurs d'un Mac et est à trouver
 sur [leur site](https://developer.apple.com/ "Voir le site des développeurs Apple").
 Je ne l'ai pas testé car il faut un Mac et il faut s'incrire.

### Windows Mobile

Si vous avez Windows, vous pouvez aussi télécharger le
 [SDK de Windows](http://msdn.microsoft.com/en-us/windowsmobile "Voir la page du SDK Windows Mobile")
 Mobile pour tester vos sites sur ces téléphones.

Bref, ce n'est qu'un aperçu de la faune des navigateurs mobiles, mais il est
 assez représentatif de ceux que les utilisateurs utilisent vraiment. Par
 contre, rien ne vaut le test sur un appareil mobile réèl pour se rendre
 compte de la nécessité d'adapter votre site aux mobiles.
