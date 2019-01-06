{% if metadata.frontmatter %}---
permalink: {{ metadata.frontmatter.permalink }}
---
{% endif %}<!DOCTYPE html>
<html class="no-js" lang="{% if metadata.lang %}{{metadata.lang}}{% else %}{{conf.lang}}{% endif %}">
<head>{#
Nice overview of what to put here:
https://github.com/joshbuchea/HEAD
#}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>{{conf.name}}{% if metadata.title %} : {{ metadata.title }}{% endif %}</title>
  <meta name="description" content="{% if metadata.description %}{{ metadata.description }}{% else %}{{conf.description}}{% endif %}">
  <link rel="bookmark" href="{{conf.baseURL}}{{metadata.path}}{{metadata.name}}.html" />
  <link rel="icon" type="image/png" href="/images/favicon.png" />
  <meta name="robots" content="index,follow">
  <link rel="stylesheet" href="/css/main.css">
  <link href='https://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
  {% block head %}{% endblock %}
</head>
<body{% if metadata.standalone != true  %} class="ia-standalone"{% endif %}>
  <!--[if lt IE 7]>
  <script>document.location.href=http://browsehappy.com;</script>
  <![endif]-->
  <header class="ia-header">
    <div class="ia-header__title">
      <h1><a href="{{root.path}}{{root.name}}.html" title="{{root.shortDesc}}"
        class="ia-logo">
        <img src="/images/logo.svg" alt="Logo Insert After" />
      </a></h1>
    </div>
  </header>
  <nav class="ia-languages">{% for item in tree.childs %}
    <a class="ia-flag ia-flag--{{item.lang}}" href="{{item.path}}{{item.name}}.html"
      title="{% if item.shortDesc %}{{item.shortDesc}}{% else %}{{item.title}}{% endif %}"{% if item == metadata or item == metadata.parent or item == metadata.parent.parent %}
      class="selected"{% endif %}>
      <span>{{item.shortTitle}}</span>
    </a>{% endfor %}
  </nav>

  <nav class="ia-menu">
    <ul class="ia-menu__body">
      <li class="ia-menu__item ia-menu__item--{{root.name}}">
        <a href="{{root.path}}{{root.name}}.html"
          title="{% if root.shortDesc %}{{root.shortDesc}}{% else %}{{root.title}}{% endif %}"{% if root == metadata  %}
          class="selected"{% endif %}>{{root.shortTitle}}</a>
      </li>{% for item in root.childs %}
      <li class="ia-menu__item ia-menu__item--{{item.name}}">
        <a href="{{item.path}}{{item.name}}.html"
          title="{% if item.shortDesc %}{{item.shortDesc}}{% else %}{{item.title}}{% endif %}"{% if item == metadata or item == metadata.parent or item == metadata.parent.parent %}
          class="selected"{% endif %}>{{item.shortTitle}}</a>
      </li>{% endfor %}
    </ul>
  </nav>

  <section class="ia-main ia-content">
    <div>
    {% block body %}{% endblock %}
    {% if metadata.disqus  %}
    <div id="disqus_thread"></div>
    <script type="text/javascript">
      /* * * CONFIGURATION VARIABLES * * */
      var disqus_shortname = 'insertafter';
      var disqus_config = function () {
        this.language = "{% if metadata.lang %}{{metadata.lang}}{% else %}{{conf.lang}}{% endif %}";
        this.callbacks.onNewComment = [function() {
          ga('send', 'event', 'interaction', 'comment');
        }];
      };

      /* * * DON'T EDIT BELOW THIS LINE * * */
      (function() {
          var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
          dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
    {% endif %}
    </div>
  </section>

  <aside class="ia-icons ia-content">
    <nav>
      <a href="https://twitter.com/nfroidure" title="Follow me on Twitter"
        class="ia-social ia-social--twitter">
        <span>Twitter</span>
      </a>
      <a href="https://github.com/nfroidure" title="Follow me on GitHub"
        class="ia-social ia-social--github">
        <span>GitHub</span>
      </a>
      <a href="https://www.npmjs.org/~nfroidure" title="Find NPM modules"
        class="ia-social ia-social--npm">
        <span>NPM</span>
      </a>
      <a href="https://www.linkedin.com/in/nfroidure" title="Find me on LinkedIn"
        class="ia-social ia-social--linkedin">
        <span>LinkedIn</span>
      </a>
      <a href="/{% if metadata.lang %}{{metadata.lang}}{% else %}{{conf.lang}}{% endif %}/blog/index.atom" title="Don't miss my blog posts"
        class="ia-social ia-social--feed">
        <span>ATOM feed</span>
      </a>
    </nav>
  </aside>

  <footer class="ia-footer">
    <p class="ia-footer__content">
      © Nicolas Froidure {{ conf.copyright.start }}-{{ conf.copyright.end }}
    </p>
  </footer>
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-21477946-7', '{{conf.domain}}');
    ga('send', 'pageview');

  </script>
</body>
</html>
