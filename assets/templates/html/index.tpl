{% extends 'layout.tpl' %}

{% block body %}{% if metadata.childs %}
<ul class="ia-langmenu">{% for item in metadata.childs %}
  <li class="ia-langmenu_item ia-langmenu_item--{{item.lang}}">
    <a href="{{item.path}}{{item.name}}.html"
      title="{{item.title}}">
      {{item.shortTitle}}
    </a>
  </li>{% endfor %}
</p>{% endif %}
{% endblock %}
