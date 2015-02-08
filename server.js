/**
 * Module dependencies
 */

var http = require('http')
var config = require('./config')
var app = require('./app')

http.createServer(app).listen(config.port)
