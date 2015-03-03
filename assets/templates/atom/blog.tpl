{% extends type + '/layout.tpl' %}

{% block body %}
{% if metadata.childs %}
{% for post in metadata.childs %}

		<entry>
			<title>{{post.title}}</title>
			<link type="text/html" href="{{post.path}}{{post.name}}.html"/>
			<updated>{% if post.published %}{{ post.published }}{% else %}{{ conf.build.created }}{% endif %}</updated>
			<published>{% if post.published %}{{ post.published }}{% else %}{{ conf.build.created }}{% endif %}</published>
			<summary>{{post.description}}</summary>
		</entry>

{% endfor %}
{% endif %}
{% endblock %}

