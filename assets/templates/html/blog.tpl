{% extends type + '/layout.tpl' %}

{% block body %}
{{ content | safe }}{% if not metadata.childs %}
<p>{{ metadata.empty }}</p>
{% else %}
<section class="main-articles">
  {% for post in metadata.childs %}
  <article class="main-articles__article">
    <p><strong>
      <a href="{{post.path}}{{post.name}}.html"
        title="{{post.title}}">
        {{post.title}}
      </a>
    </strong></p>
    <p>{{post.description}}</p>
    <p>{{ metadata.published_on }} {{post.published | date(metadata.lang)}}</p>
  </article>
  {% endfor %}
</section>
{% endif %}
{% if metadata.previousFile or metadata.nextFile %}
<nav>
  {% if metadata.previousFile %}
  <a href="{{metadata.previousFile.metadata.path}}{{metadata.previousFile.metadata.name}}.html"
    title="{{metadata.previousFile.metadata.title}}">
    {{metadata.previousFile.metadata.title}}
  </a>
  {% endif %}
  {% if metadata.nextFile %}
  <a href="{{metadata.nextFile.metadata.path}}{{metadata.nextFile.metadata.name}}.html"
    title="{{metadata.nextFile.metadata.title}}">
    {{metadata.nextFile.metadata.title}}
  </a>
  {% endif %}
</nav>
{% endif %}
{% endblock %}
