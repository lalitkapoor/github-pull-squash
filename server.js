/**
 * Module dependencies
 */

var http = require('http')
var config = require('./config')
var app = require('./app')

http.createServer(app).listen(config.port, function(error) {
  if (error) {
    console.log('could NOT listen on port %s', config.port)
    console.error(error)
    return process.exit(1)
  }
  console.log('listening on port %s', config.port)
})
