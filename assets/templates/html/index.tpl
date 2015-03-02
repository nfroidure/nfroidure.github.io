{% extends type + '/layout.tpl' %}

{% block body %}
  {{ content | safe }}
{% endblock %}
