{% extends type + '/layout.tpl' %}

{% block body %}
<article class="ia-main__text ia-presentation">
  <h2 class="ia-presentation__title">{{ metadata.title }}</h2>
  <iframe class="ia-presentation__presentation" src="{{ metadata.embed }}"
    width="320" height="240" scrolling="no"
  frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
  {{ content | safe }}
</article>{% if metadata.parent %}
<p class="ia-main__nav">
  <a href="{{metadata.parent.path}}{{metadata.parent.name}}.html"
    title="{{metadata.parent.title}}">
    &lt; {{metadata.parent.shortTitle}}
  </a>
</p>{% endif %}
{% endblock %}
