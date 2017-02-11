{% extends type + '/layout.tpl' %}

{% block head %}
<link rel="alternate" type="application/atom+xml"
  title="{{metadata.title}} (Atom)" href="{{metadata.path}}{{metadata.name}}.atom" />
{% endblock %}

{% block body %}
{{ content | safe }}{% if not metadata.childs %}
<p>{{ metadata.empty }}</p>
{% else %}
<section class="main-articles">
  {% for post in metadata.childs %}
  <article class="main-articles__article">
    <p><strong>
      <a href="{{post.path}}{{post.name}}.html"
        title="{{post.shortDesc}}">
        {{post.title}}
      </a>
    </strong></p>
    {% if post.template == 'presentation' %}
    <p><strong>{{ post.title }}</strong></p>
    <iframe src="{{ post.embed }}" width="576" height="420" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    {% else %}
    <p>{{post.description}}</p>
    <p>{{ metadata.published_on }} {{post.published | date(metadata.lang)}}</p>
    {% endif %}
  </article>
  {% endfor %}
</section>
{% endif %}
{% if metadata.previousFile or metadata.nextFile %}
<nav class="ia-pagination">
  {% if metadata.previousFile %}
  <a href="{{metadata.previousFile.metadata.path}}{{metadata.previousFile.metadata.name}}.html"
    title="{{metadata.previousDesc}}" rel="Prev" class="ia-pagination_previous">
    <span>{{metadata.previousTitle}}</span>
  </a>
  {% endif %}

  {% if metadata.nextFile %}
  <a href="{{metadata.nextFile.metadata.path}}{{metadata.nextFile.metadata.name}}.html"
    title="{{metadata.nextDesc}}" rel="Next" class="ia-pagination_next">
    <span>{{metadata.nextTitle}}</span>
  </a>
  {% endif %}
</nav>
{% endif %}
{% endblock %}
