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
{% endblock %}
