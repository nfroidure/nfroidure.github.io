{% extends type + '/layout.tpl' %}

{% block body %}
<article class="ia-main__content">
  {{ content | safe }}
</article>{% if metadata.parent %}
<nav class="ia-main__back">
  <a href="{{metadata.parent.path}}{{metadata.parent.name}}.html"
    title="{{metadata.parent.title}}">
    &lt; {{metadata.parent.shortTitle}}
  </a>
</nav>{% endif %}
{% endblock %}
