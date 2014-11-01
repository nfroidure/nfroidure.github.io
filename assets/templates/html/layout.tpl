<!DOCTYPE html>
<html class="no-js" lang="{% if metadata.lang %}{{metadata.lang}}{% else %}{{conf.lang}}{% endif %}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>{{conf.name}}{% if metadata.title %} : {{ metadata.title }}{% endif %}</title>
    <meta name="description" content="{% if metadata.description %}{{ metadata.description }}{% else %}{{conf.description}}{% endif %}">
    <link rel="icon" type="image/png" href="/images/favicon.png" />
    <meta name="robots" content="index,follow">
    <link rel="stylesheet" href="{{conf.baseURL}}/css/main.css">
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-21477946-7', 'insertafter.com');
      ga('send', 'pageview');

    </script>
</head>
<body>
    <!--[if lt IE 7]>
    <script>document.location.href=http://browsehappy.com;</script>
    <![endif]-->
    <header class="ia-header">
        <h1 class="ia-header_title">
          <a href="{{root.path}}{{root.name}}.html" title="{{root.shortDesc}}">
            <img src="/images/chtijs.svg" alt="ChtiJS" />
          </a>
        </h1>
{% if metadata.standalone != true  %}
        <nav class="ia-menu">
        	  <ul class="ia-menu__body">
                <li class="ia-menu__{{root.name}}">
                    <a href="{{root.path}}{{root.name}}.html"
                      title="{% if root.shortDesc %}{{root.shortDesc}}{% else %}{{root.title}}{% endif %}"{% if root == metadata  %}
                      class="selected"{% endif %}>{{root.shortTitle}}</a>
                </li>{% for item in root.childs %}
                <li class="ia-menu__{{item.name}}">
                    <a href="{{item.path}}{{item.name}}.html"
                      title="{% if item.shortDesc %}{{item.shortDesc}}{% else %}{{item.title}}{% endif %}"{% if item == metadata or item == metadata.parent or item == metadata.parent.parent %}
                      class="selected"{% endif %}>{{item.shortTitle}}</a>
                </li>{% endfor %}
            </ul>
        </nav>
    </header>
 {% endif %}

    <section class="ia-content">
        {% block body %}{% endblock %}
    </section>

{% if metadata.standalone != true  %}
    <div class="ia-extra">
      <aside class="ia-extra_box">
        <nav class="ia-menu">
        	  <ul class="ia-menu__body">{% for item in tree.childs %}
                <li class="ia-menu__{{item.name}}">
                    <a href="{{item.path}}{{item.name}}.html"
                      title="{% if item.shortDesc %}{{item.shortDesc}}{% else %}{{item.title}}{% endif %}"{% if item == metadata or item == metadata.parent or item == metadata.parent.parent %}
                      class="selected"{% endif %}>{{item.shortTitle}}</a>
                </li>{% endfor %}
            </ul>
        </nav>
      </aside>
      <aside class="ia-extra_box">
      </aside>
    </div>{% endif %}

    <footer class="ia-footer">
        <p class="ia-footer__content">
          © Nicolas Froidure 2012 - 2014
        </p>
    </footer>
    <script src="{{conf.baseURL}}/js/script.js"></script>
</body>
</html>

