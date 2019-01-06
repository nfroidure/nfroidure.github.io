{% extends type + '/layout.tpl' %}

{% block head %}
<link rel="alternate" type="application/atom+xml"
  title="{{metadata.title}} (Atom)" href="{{metadata.path}}{{metadata.name}}.atom" />
{% endblock %}

{% block body %}
{{ content | safe }}{% if not metadata.childs %}
<p>{{ metadata.empty }}</p>
{% else %}
<section class="ia-main__articles">
  {% for post in metadata.childs %}
  <article class="ia-article{% if post.template == 'presentation' %} ia-article--presentation{% endif %}">
    <p class="ia-article__title"><strong>
      <a href="{{post.path}}{{post.name}}.html"
        title="{{post.shortDesc}}">
        {{post.title}}
      </a>
    </strong></p>
    <p class="ia-article__description">{{ post.description }}</p>
    {% if post.template == 'presentation' %}
    <iframe class="ia-article__presentation" src="{{ post.embed }}" width="320" height="240" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    {% endif %}
    <p class="ia-article__publication">{{ metadata.published_on }} {{post.published | date(metadata.lang)}}</p>
  </article>
  {% endfor %}
</section>
{% endif %}
{% if metadata.previousFile or metadata.nextFile %}
<nav class="ia-main__pagination ia-pagination">
  {% if metadata.previousFile %}
  <a href="{{metadata.previousFile.metadata.path}}{{metadata.previousFile.metadata.name}}.html"
    title="{{metadata.previousDesc}}" rel="Prev" class="ia-pagination__previous">
    <span>{{metadata.previousTitle}}</span>
  </a>
  {% endif %}

  {% if metadata.nextFile %}
  <a href="{{metadata.nextFile.metadata.path}}{{metadata.nextFile.metadata.name}}.html"
    title="{{metadata.nextDesc}}" rel="Next" class="ia-pagination__next">
    <span>{{metadata.nextTitle}}</span>
  </a>
  {% endif %}
</nav>
{% endif %}
{% endblock %}
