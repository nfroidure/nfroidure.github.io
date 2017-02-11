{% extends type + '/layout.tpl' %}

{% block body %}
<article class="main-text">
  <h2>{{ metadata.title }}</h2>
  <p style="text-align:center">
    <iframe src="{{ metadata.embed }}"
    width="576" height="420" scrolling="no"
    frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
  </p>
  {{ content | safe }}
</article>{% if metadata.parent %}
<p>
  <a href="{{metadata.parent.path}}{{metadata.parent.name}}.html"
    title="{{metadata.parent.title}}">
    &lt; {{metadata.parent.shortTitle}}
  </a>
</p>{% endif %}
{% endblock %}
