<?xml version="1.0" encoding="utf-8"?>

<feed xmlns="http://www.w3.org/2005/Atom">
 
	<title>{{conf.name}}{% if metadata.title %} : {{ metadata.title }}{% endif %}</title>
	<subtitle>{% if metadata.description %}{{ metadata.description }}{% else %}{{conf.description}}{% endif %}</subtitle>
	<link href="{{conf.baseURL}}{{metadata.path}}{{metadata.name}}.atom" rel="self" />
	<link href="{{conf.baseURL}}{{metadata.path}}{{metadata.name}}.html" />
	<updated>{% if metadata.pusblished %} {{ metadata.published }} {% else %} {{ conf.build.created }} {% endif %}</updated>

	{% block body %}{% endblock %}
 
</feed>
