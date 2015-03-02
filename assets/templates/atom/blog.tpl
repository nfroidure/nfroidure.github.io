{% extends type + '/layout.tpl' %}

{% block body %}
{% if metadata.childs %}
{% for post in metadata.childs %}

		<entry>
			<title>{{post.title}}</title>
			<link href="{{post.path}}{{post.name}}.atom" />
			<link rel="alternate" type="text/html" href="{{post.path}}{{post.name}}.html"/>
			<updated>{{post.published}}</updated>
			<summary>{{post.description}}</summary>
		</entry>

{% endfor %}
{% endif %}
{% endblock %}

