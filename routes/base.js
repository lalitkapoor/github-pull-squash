/**
 * Module dependencies
 */

var router = require('express').Router()
var authCheck = require('@/middleware/auth-check')

router.get('/'
, authCheck
, function(req, res) {
  res.status(200).send('Hello World')
})

module.exports = router;
