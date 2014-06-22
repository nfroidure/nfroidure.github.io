<!--VarStream
title=Décompiler/désassembler un paquet Android (.apk)
description=Grâce à la combinaison de deux outils simples et pratiques, il est\
 possible d'obtenir un code source assez fidèle à celui d'origine pour un\
  paquet Android.
shortTitle=Décompiler les APK
shortDesc=Voir l'astuce pour faire cette décompilation
keywords.+=Java
categories.+=keywords.*
keywords.+=Android
categories.+=keywords.*
published=2012-01-19T13:11:27.000Z
lang=fr
location=FR
-->

# Décompiler/désassembler un paquet Android (.apk)

Les applications Android sont packagées sous la forme d'une archive compressée
 .apk. A l'intérieur, le bytecode des fichiers Java sous la forme de fichiers
 d'extension .dex (bytecode généré pour Dalvik, la machine virtuelle Java
 utilisée par Android). Premier problème, les fichiers XML de description de
 l'interface et des ressources ne sont pas lisible à l'oeil nu puisque compilés
 eux aussi.

La première chose à faire est donc de les passer à la moulinette de Android
 [a hreflang=en title=Télécharger l'outil href=http://code.google.com/p/android-apktool/]APK Tool[/a]
 qui va gentiment vous restituer les fichiers XML sous un format texte.

Maintenant passons aux fichiers Dex. Sous cette forme, il n'existe pas encore
 d'outils permettant de décompiler ces fichiers. Il va donc falloir passer par
 un intermédiaire pour obtenir du bytecode comptatible avec la machine virtuelle
 Java habituelle.

Cet outil, c'est [dex2jar](href=http://code.google.com/p/dex2jar/ "Télécharger dex2jar").
 Grâce à ce dernier, vous serez en mesure de récupérer un code source Java
 relativement fidèle à l'original en utilisant
 [jd-gui](http://java.decompiler.free.fr/?q=jdgui "Télécharger cet outil").

Le [span lang=en]proof of concept[/span] de cet article est ce petit
 [client REST](https://github.com/nfroidure/SimpleRestAndroidClient "Voir ce client")
 que j'ai eu le malheur de développer sur un coin de table tant et si bien que
 je n'avais plus que le fichier apk.

