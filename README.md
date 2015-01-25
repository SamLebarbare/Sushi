[![QIBUD](http://static.tumblr.com/9o93btp/N51liyrau/qibud_100.png)](http://qibud.com/)

[![Build Status](https://travis-ci.org/Loupio/qibud.svg?branch=master)](https://travis-ci.org/Loupio/qibud)


## Qibud


### Heroku Deployment
Before you start make sure you have <a href="https://toolbelt.heroku.com/">heroku toolbelt</a> installed.

```bash
git init
git add .
git commit -m "initial version"
heroku apps:create
heroku addons:add mongohq
heroku labs:enable websockets
heroku config:add NODE_ENV=production
heroku stack:set cedar-14
git push heroku master
heroku open
```

### License
MIT
