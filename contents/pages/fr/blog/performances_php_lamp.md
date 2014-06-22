<!--VarStream
title=Critique du livre "Performances PHP, audit et optimisation LAMP"
description=Afin de compléter mes compétences en administration système, j'ai\
 acheté le livre Performance PHP aux éditions Eyrolles. Bonne pioche !
shortTitle=Livre Performances PHP
shortDesc=Voir la critique de ce livre sur PHP
published=2012-05-05T19:06:27.000Z
lang=fr
location=FR
keywords.+=Apache
categories.+=keywords.*
keywords.+=PHP
categories.+=keywords.*
keywords.+=MySQL
categories.+=keywords.*
keywords.+=Critiques de livres
categories.+=keywords.*
-->

# Critique du livre "Performances PHP, audit et optimisation LAMP"

<cite>Performances PHP</cite>, écrit par Julien Pauli, Cyril Pierre de Geyer et
 Guillaume Plessis, se propose de vous aider à optimiser votre architecture
 <acronym title="Linux Apache MySQL et PHP">LAMP</acronym>.

Acheté 35€ au furêt du Nord, ce livre me laisse une bonne impression générale.
 Simple et conçis, je l'ai lu sur deux ou trois jours. Je connaissais déjà
 quelques astuces pour l'optimisation, mais un rappel ne fait pas de mal
 (surtout pour celles qu'on connaît, mais qu'on se rend compte qu'on a oublié
 de mettre en place).

J'ai cependant aussi beaucoup appris, notamment pour les optimisations
 concernant des infrastructures à forte charge. Au fil de la lecture, on se
 rend compte que les auteurs ont vraiment une bonne compréhension des mécanismes
 bas niveau qui sous-tendent un serveur LAMP. Chaque optimisation est appuyée
 par des explications accessibles sur les raisons qui rendent ces dernières
 utiles.

Après une brève présentation de LAMP, le livre revient sur la journalisation et
 ses subtilités. Il montre aussi comment superviser les serveurs de production.
 Il propose des outils utiles pour effectuer des tests de charge : Apache
 benchmark, JMeter...

Ensuite il expose tour à tour les différentes optimisations possibles pour les
 différentes couches d'une architecture LAMP. J'y ai découvert qu'APC (cache
 d'OP codes) était un projet directement propulsé par les créateurs de PHP.
 J'utilise XCache, mais je compte bien tester ce dernier.

Il revient clairement aussi sur les paramètres d'optimisation d'Apache et liste
 les fameux <acronym title="Multi Process Manager">MPM</acronym> et leur usages
 en fonction des situations. On y apprend que bien paramètrer Apache permet
 d'obtenir des performances proches de ses challengers actuellement en vogue
 (NGinx, LightHTTPD).

Bref, un livre sympa et accessible pour qui souhaite optimiser ses sites web.

