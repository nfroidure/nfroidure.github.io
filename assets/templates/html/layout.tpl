{% if metadata.frontmatter %}---
permalink: {{ metadata.frontmatter.permalink }}
---
{% endif %}<!DOCTYPE html>
<html class="no-js" lang="{% if metadata.lang %}{{metadata.lang}}{% else %}{{conf.lang}}{% endif %}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>{{conf.name}}{% if metadata.title %} : {{ metadata.title }}{% endif %}</title>
    <meta name="description" content="{% if metadata.description %}{{ metadata.description }}{% else %}{{conf.description}}{% endif %}">
    <link rel="bookmark" href="{{conf.baseURL}}{{metadata.path}}{{metadata.name}}.html" />
    <link rel="icon" type="image/png" href="/images/favicon.png" />
    <meta name="robots" content="index,follow">
    <link rel="stylesheet" href="/css/main.css">
    <link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
</head>
<body>
    <!--[if lt IE 7]>
    <script>document.location.href=http://browsehappy.com;</script>
    <![endif]-->
    <header class="ia-header{% if metadata.standalone != true  %} ia-header--reduced{% endif %}">
        <div class="ia-header_title">
          <h1><a href="{{root.path}}{{root.name}}.html" title="{{root.shortDesc}}"
            class="ia-logo">
            <span class="ia-logo__insert">INSERT</span><span class="ia-logo__after">:after</span>
          </a></h1>
          <nav class="ia-flags">
              <ul class="ia-flags__body">{% for item in tree.childs %}
                  <li class="ia-flags__item ia-flags__item--{{item.lang}}">
                      <a href="{{item.path}}{{item.name}}.html"
                        title="{% if item.shortDesc %}{{item.shortDesc}}{% else %}{{item.title}}{% endif %}"{% if item == metadata or item == metadata.parent or item == metadata.parent.parent %}
                        class="selected"{% endif %}>
                        <span>{{item.shortTitle}}</span>
                      </a>
                  </li>{% endfor %}
              </ul>
          </nav>
          <nav class="ia-social">
            <a href="https://twitter.com/nfroidure" title="Follow me on Twitter"
             class="ia-social__item ia-social__item--twitter">
              <span>Twitter</span>
            </a>
            <a href="https://github.com/nfroidure" title="Follow me on GitHub"
             class="ia-social__item ia-social__item--github">
              <span>GitHub</span>
            </a>
            <a href="https://www.npmjs.org/~nfroidure" title="Find NPM modules"
             class="ia-social__item ia-social__item--npm">
              <span>NPM</span>
            </a>
            <a href="https://www.linkedin.com/profile/view?id=44165977" title="Find me on LinkedIn"
             class="ia-social__item ia-social__item--linkedin">
              <span>LinkedIn</span>
            </a>
            <a href="/{% if metadata.lang %}{{metadata.lang}}{% else %}{{conf.lang}}{% endif %}/blog/index.atom" title="Don't miss my blog posts"
             class="ia-social__item ia-social__item--feed">
              <span>LinkedIn</span>
            </a>
          </nav>
        </div>
{% if metadata.standalone != true  %}
        <nav class="ia-header_menu ia-menu">
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
 {% endif %}
    </header>

    <section class="ia-content ia-content--main">
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
    </section>

{% if metadata.standalone != true  %}
    <div class="ia-extra">
      <aside class="ia-extra_box">
      </aside>
      <aside class="ia-extra_box">
      </aside>
    </div>{% endif %}

    <footer class="ia-footer">
        <p class="ia-footer__content">
          <nav class="ia-social">
            <a href="https://twitter.com/nfroidure" title="Follow me on Twitter"
             class="ia-social__item ia-social__item--twitter">
              <span>Twitter</span>
            </a>
            <a href="https://github.com/nfroidure" title="Follow me on GitHub"
             class="ia-social__item ia-social__item--github">
              <span>GitHub</span>
            </a>
            <a href="https://www.npmjs.org/~nfroidure" title="Find NPM modules"
             class="ia-social__item ia-social__item--npm">
              <span>NPM</span>
            </a>
            <a href="https://www.linkedin.com/in/nfroidure" title="Find me on LinkedIn"
             class="ia-social__item ia-social__item--linkedin">
              <span>LinkedIn</span>
            </a>
            <a href="/{% if metadata.lang %}{{metadata.lang}}{% else %}{{conf.lang}}{% endif %}/blog/index.atom" title="Don't miss my blog posts"
             class="ia-social__item ia-social__item--feed">
              <span>ATOM feed</span>
            </a>
          </nav>
          - © Nicolas Froidure {{ conf.copyright.start }} - {{ conf.copyright.end }}
        </p>
    </footer>
    <script src="{{conf.baseURL}}/js/script.js"></script>
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
