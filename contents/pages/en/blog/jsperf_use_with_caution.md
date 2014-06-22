<!--VarStream
title=Detecting bad JavaScript performance tests on JSPerf
description=JSPerf is a great tool but there some points to keep in mind when using it.
shortTitle=JSPerf
shortDesc=Read more about using JSPerf
keywords.+=JavaScript
categories+=keywords.*
keywords.+=performances
keywords.+=jsperf
published=2013-06-06T16:21:50.000Z
lang=en
location=US
-->

## Detecting bad JavaScript performance tests on JSPerf

JSPerf gives us a simple way to write JavaScript performance tests.
 Unfortunately, tests found aren't always well designed. Here's how to detect
 and avoid them.

When i discovered [JSperf.com](http://jsperf.com/), i was realy impressed by
 its ease of use. Writing JavaScript performance tests just became as simple
 as writing JavaScript :). Knowing it, i'm often looking for perf tests on it
 to quickly have an overview of results for a particular case.

Sadly, it rarely fit my needs, whislt it often reflect a poor understanding of
 what performance testing means. Here is a summary of my experience with those
 tests, how to detect them and how to impeach them to lead developpers to
 mistakes.

### When tests smell

One particular case you should be aware of is the use of console.* methods.
 Thoses methods should never be found in a test since
 [they are really slow](http://jsperf.com/console-log-performance/6)and will
 tend to equalize test results especially for critical performance test.
 Unfortunately, it's very common to find
 [tests using console.log](https://www.google.com/search?q=site%3Ajsperf.com++%22console.log(%22&aq=f&oq=site%3Ajsperf.com++%22console.log(%22).

By the way, If you test something, test it only. The above console.log test's
 [prior versions](http://jsperf.com/console-log-performance/2) were completely
 unusefull since they didn't test only console.log. The purpose of a test is
 to reveal the overhead of the tested feature, so you should find the smallest
 footprint possible for your wrapping code.

Another problem with previous revisions of this test is usage of a for loop in
 order to make the test more "massive": JSPerf do it for you, stop wasting your
 time.

Another common issue is when code is valid, but not well formed. It often lead
 to strange test results. So, take time to read the test code if you plan to
 exploit it's results. Common mistakes of that kind are :

- forgetting to execute a function (myFunction; instead of myFunction();),
- abnormal return or break instruction,
- bad logic,
- undefined identifiers,
- etc...

Those mistakes are leading most of the time to better performances since some
 parts of the code aren't executed.

Another way to detect bad tests is to look at later revisions, it sometimes
 add some tests but often fix them. All in all, if you do not want to spend
 time checking if a test is right, you can look after JavaScript Rockstars
 tests ([Addy Osmani](http://jsperf.com/browse/addy-osmani "Look at Addy's tests"),
 [John Resig](http://jsperf.com/browse/john-resig "Look at John Resig's tests'"), ...).

### Avoid creating bad test

Anyone can create a bad test, but there are some good practices to reduce the risk :

- if you're a noob : don't write tests,
- read your code many times before submitting,
- test your code in the JavaScript console first,
- if you made shit, mark it as shit (comment with a link to the modified revisions),
- if someone mark it as shit, don't be hurt. Testing is not about you, it's about truth.

That's it, this post is over. If you've got some other good practices or another
 way to detect bad tests let me know!

