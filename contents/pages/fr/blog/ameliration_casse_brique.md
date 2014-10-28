<!--VarStream
title=Amélioration d'un casse brique
description=J'ai cliqué via Twitter sur un lien vers un casse brique en\
 développement. Il avait des problèmes de performance étonnants. J'y ai mis\
 mon grain de sel.
shortTitle=Amélioration d'un casse brique
shortDesc=En savoir plus sur les modifs.
published=2012-05-08T20:09:31.000Z
lang=fr
location=FR
keywords.+=HTML5
categories.+=keywords.*
keywords.+=Jeux
categories.+=keywords.*
-->

## Amélioration d'un casse brique

Un casse [brique en création](https://github.com/jonathankowalski/CasseBriques)
 a donné du fil à retordre à mon CPU. Cela était assez étrange car pour
 l'instant, il n'y avait que la barre et un balle qui se balladait. Rien ne
 justifiant ce problème de perf.

 ![Casse brique](http://www.insertafter.com//images/1canimage.png)

Après un petit coup d'oeil sur la source, je me suis rendu compte qu'il y avait
 plusieurs problèmes de conception. Le premier était évident. A chaque boucle
 de jeu, le canvas était entièrement redessiné ce qui provoquait un écriture
 règulière de nombreux pixels blancs.[/p][p]Pour palier à ce problème, j'ai
 renforcé le modèle objet du petit jeu en déléguant à chaque objet la
 responsabilité d'effacer sa précédente impression avant de s'imprimer de
 nouveau.

Pour la gestion de la barre, le précédent programme écoutait l'évènement
 `onmousemove`, mettait à jour les coordonnées et la barre s'affichait
 perpétuellement dans la boucle principale du jeu. J'ai connecté directement
 le gestionnaire d'évènement à la méthode d'impression de la barre permettant
 un affichage uniquement en cas de changement de coordonnées.

Le jeu est maintenant très fluide et j'espère que son créateur sera content
 de mes petites modifications. C'est la magie de GitHub, on peut participer à
 des projets de manière épisodique et faire avancer le schmilbick ! Cela m'a
 pris une heure ou deux et j'imagine que ça peut relancer le projet de ce
 développeur. J'ai bien sûr fait un
 [pull request](https://github.com/jonathankowalski/CasseBriques/pull/1).

J'ai aussi rendu le jeu flexible, il suffit d'instancier un object Game en
 passant un élément HTML à son constructeur pour que le jeu s'affiche dedans
 et s'adapte à la taille que cet élément permet d'exploiter.

Il reste à créer une méthode de génération de briques s'adaptant à la taille et
  de gérer les collisions pour avoir un jeu jouable (j'ai aussi implémenté le
  rebond sur la barre). Je n'en ai pas le temps maintenant, mais pourquoi pas
  plus tard. A moins que vous ne le fassiez avant moi !

Information : Finalement, j'ai directement créé un
 [tutoriel complet pour la création d'un casse brique](articles-html5_casse_brique.html]).

