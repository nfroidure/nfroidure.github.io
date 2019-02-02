{% extends type + '/layout.tpl' %}

{% block body %}
<article class="ia-main__text ia-talk">
  <h2 class="ia-talk__title">{{ metadata.title }}</h2>
  <iframe class="ia-talk__talk" width="320" height="240" src="{{ metadata.embed }}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  {{ content | safe }}
</article>{% if metadata.parent %}
<p class="ia-main__nav">
  <a href="{{metadata.parent.path}}{{metadata.parent.name}}.html"
    title="{{metadata.parent.title}}">
    &lt; {{metadata.parent.shortTitle}}
  </a>
</p>{% endif %}
{% endblock %}
