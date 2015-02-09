/**
 * Module dependencies
 */

var config = require('@/config')

var _ = require('lodash')
var Promise = require('bluebird')
var redis = require('redis').createClient()
var GitHubApi = require('github')
var request = require('superagent')
var crypto = Promise.promisifyAll(require('crypto'))
var router = require('express').Router()

var github = new GitHubApi({
  version: "3.0.0"
// , debug: true
, timeout: 15000
})

// move this client side
router.get('/github', function(req, res) {
  var scope = ['user', 'repo', 'write:repo_hook']
  var githubUrl = 'https://github.com/login/oauth/authorize?'

  crypto.randomBytesAsync(48).then(function(buf) {
    // we should be saving the state to a datastore for security
    var state = buf.toString('hex')

    var redirectUri = req.protocol + '://'
    + config.host + ':' + config.port
    + '/auth/github/callback'

    githubUrl += 'client_id=' + config.github.clientId
    githubUrl += '&redirect_uri=' + redirectUri
    githubUrl += '&scope=' + scope.join(',')
    githubUrl += '&state=' + state

    res.redirect(githubUrl)
  })
})

router.get('/github/callback', function(req, res) {
  var githubUrl = 'https://github.com/login/oauth/access_token'

  // we should be checking this, but ignore for now, store in a datastore
  // if(!states.hasOwnProperty(req.query.state)) return res.send('invalid state')
  // delete states[req.query.state] // clean up

  request.post(githubUrl)
  .send({
    client_id: config.github.clientId
  , client_secret: config.github.clientSecret
  , code: req.query.code
  })
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json')
  .end(function(error, response) {
    if (error) return res.status(500).send('an error occurred')

    var oauth = response.body
    var token = oauth.access_token

    github.authenticate({type: 'oauth', token: token})
    github.user.get({}, function(err, user) {
      if (error) return res.status(500).send('an error occurred talking to github')
      if (!user.id) return res.status(500).send('an error occurred getting user from github')

      var data = _.extend({}, user, {oauth: oauth})
      redis.HMSET('user:' + user.id, data, function(error) {
        if (error) return res.status(500).send('an error occurred talking to our database')
        // set user cookie, because they are now authenticated
        req.session.github = {user: user, oauth: oauth, token: token}
        return res.redirect('/')
      })
    })
  })
})

module.exports = router
