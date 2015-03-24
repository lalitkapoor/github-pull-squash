require('dotenv').load()

var _ = require('lodash')

var config = {
  defaults: {
    pgConnStr: process.env.PG_CONN_STR || process.env.DATABASE_URL
  , host: process.env.HOST
  , port: process.env.PORT || 5000
  , github: {
      clientId: process.env.GITHUB_CLIENT_ID
    , clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  , session: {
      secret: process.env.SESSION_SECRET
    }
  }

, dev: {
    env: 'dev'
  , isDev: true
  }

, prod: {
    env: 'prod'
  , isProd: true
  }
}

var env = process.env['ENV'] = process.env['ENV'] || 'dev'
if (!env || !config.hasOwnProperty(env)) env = 'dev'

module.exports = _.defaults(config[env], config.defaults)
console.log('Loading',  env, 'config')
