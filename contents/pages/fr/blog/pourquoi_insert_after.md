<!--VarStream
title=Pourquoi j'ai nommé ce blog InsertAfter
description=Je viens de m'apercevoir que je n'ai pas expliqué pourquoi ce blog\
 s'appelle InsertAfter, c'est le moment de palier à ce manque.
shortTitle=Pourquoi InsertAfter ?
shortDesc=Connaître les raisons d'un tel nom pour ce blog.
published=2012-05-08T14:23:29.000Z
lang=fr
location=FR
keywords.+=Vie du blog
categories.+=keywords.*
-->

## Pourquoi j'ai nommé ce blog InsertAfter

C'est en réfléchissant à créer un blog que ce nom m'est venu spontanément. En
 effet, pour moi, un blog est un endroit de partage, un lieu ou l'on peut donner
 quelques idées, ressources ou avis sur les technologies qu'on utilise.

Il ne s'agit pas de se regarder le nombril, j'ai d'ailleurs dû réfléchir
 intensivement sur les parties de ce blog où je parle de moi. Faut-il dire je,
 faut-il rester plus ou moins anonyme, faut-il mettre une photo ? Faut-il tout
 court ?

Après de longues hésitations, je me suis dit qu'un blog devait permettre à ceux
 qui le veulent de me rencontrer et que même si ce n'est pas trop dans mes
 habitudes, je me devais de mettre en avant ma personnalité car c'est bien comme
 cela qu'on se rencontre. Vous remarquerez d'ailleurs que j'ai
 [livré ça brute de taille](a_propos.html "Voir ma présentation"), à mon image
 ;).

Cependant, un blog est avant tout un lieu d'échange et il m'apparaissait évident
 qu'il fallait y laisser une place pour les commentaires. Ce seraient d'ailleurs
 ces mêmes commentaires qui rendraient cette expérience enrichissante pour moi.

InsertAfter par son sens purement littéral introduit ces deux dimensions. J'ai
 même été surpris que le nom de domaine n'ait pas déjà été réservé (d'où mon
 empressement à le réserver, plusieurs mois avant de créer ce blog).

Mais InsertAfter a un sens plus profond pour un développeur qui utilise
 fréquemment le <acronym title="Document Object Model" "lang=en">DOM</acronym>
 avec Javascript. En effet, à mes débuts avec cette API, je me suis posé une
 question bête. Pourquoi n'y a-t-il pas de fonction Node.insertAfter comme il y
 a une fonction Node.insertBefore ?[/p][p]Cette question est idiote car elle
 ferait doublon. En ce sens que le seul cas qui pourrait justifier une telle
 fonction serait l'ajout d'un nœud au sommet de la pile de la propriété
 `Node.childNodes` de type `DOMCollection`. Or ce cas est justement couvert par
 la fonction `Node.appendChild()`.

On peut donc facilement implémenter cette fonction :

```js
Node.prototype.insertAfter = function (newNode, afterNode) {
	return (afterNode ?
		this[
			this.childNodes.lastChild == afterNode ?
			'appendChild' :
			'insertBefore'
		](
			newNode,
			this.childNodes.lastChild==afterNode ?
				null :
				afterNode.nextSibling;
		);
}
```

La question est, est-ce une bonne idée ? On pourrait dire oui vu qu'une
 recherche de ce blog sur le web m'a fait apprendre que JQuery proposait cela.
 Mais en fait, c'est une mauvaise idée. Cela fait non-seulement doublon, mais
 en plus, cela mène à une méconnaissance du DOM et de ses fonctions natives,
 hors librairies Js.

Je considère cela comme une maturité de développeur JS que de ne pas penser
 qu'il manque insertAfter() dans l'API du DOM. C'est donc aussi en hommage à
 cette maturité et au chemin parcouru depuis que j'ai appelé ce blog ainsi.

Enfin, [Bruno Bichet](https://plus.google.com/104046041694416287579/about "Voir son compte Google Plus")
 et [Nicolas Paillard](http://ignorez-moi.fr/ "Voir son site") m'ont rappelé
 que cela pouvait aussi faire référence au sélecteur CSS `:after`, d'où
 l’identité visuelle du logo. La boucle est bouclée, InsertAfter n'a plus de
 secret pour vous.
