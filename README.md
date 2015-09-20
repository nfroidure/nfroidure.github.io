# Blog : InsertAfter.com

This repo contains my current home page. Feel free to contribute!

[![Build status](https://api.travis-ci.org/nfroidure/blog.svg)](https://travis-ci.org/nfroidure/blog) [![Code Climate](https://codeclimate.com/github/nfroidure/blog.svg)](https://codeclimate.com/github/nfroidure/blog)

## Contributing

Feel free to help me to improve my blog. Typo, design, or anything else except
 blog posts.

```sh
git clone git@github.com:nfroidure/blog.git
cd blog
npm install
npm run dev
```

You need to install ImageMagick to build this blog:
```sh
# on a Debian based system
apt-get install imagemagick
# with OSX - http://www.imagemagick.org/script/binary-releases.php#macosx
brew install imagemagick --with-librsvg
```

## Publishing
To publish a new version of the blog, just run `gulp publish`

## License
The assets, graphics, illustrations and text contents are © myself. The
 code is licensed under the MIT license.
