{% extends type + '/layout.tpl' %}

{% block body %}
{% if metadata.childs %}
{% for post in metadata.childs %}

		<entry>
			<title>{{post.title}}</title>
			<link type="text/html" href="{{post.path}}{{post.name}}.html"/>
			<updated>{% if post.pusblished %}{{ post.published }}{% else %}{{ conf.build.created }}{% endif %}</updated>
			<summary>{{post.description}}</summary>
		</entry>

{% endfor %}
{% endif %}
{% endblock %}

