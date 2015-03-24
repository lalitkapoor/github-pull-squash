/**
 * Module dependencies
 */

var config = require('./config')
var app = require('express')()

// Middleware
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')
var methodOverride = require('method-override')
var domainMiddleware = require('express-domain-middleware')
var cors = require('cors')

//Routes
var routes = {}
routes.auth = require('./routes/auth')
routes.base = require('./routes/base')

// Hooks
routes.hooks = {}
routes.hooks.github = require('./routes/hooks/github')

app.use(domainMiddleware)
app.use(bodyParser({limit: '10mb'}))
app.use(methodOverride())
app.use(cors())
app.use(cookieParser())
app.use(session({
  secret: config.session.secret
, key: 'sid'
, cookie: {
    secure: true
  , maxage: null // browser session cookie
  }
}))


app.use('', routes.base)
app.use('/auth', routes.auth)
app.use('/hooks/github', routes.hooks.github)

app.get(/^\/?$/, function (req, res) {
  res.status(200).send('')
})

// last resort error handler
app.use(function (err, req, res, next) {
  console.error(err.name, err.stack)
  res.status(500).send('An error has occurred')
})

module.exports = app
