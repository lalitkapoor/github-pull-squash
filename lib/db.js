var config = require('@/config')
var pg = require('pg')
var query = require('pg-query')
var querybox = require('querybox')

query.connectionParameters = config.pgConnStr
var box = querybox(__dirname + '/../sql', query)

module.exports = {
  query: query
, run: box.run.bind(box)
, getClient: function(callback) {
    return pg.connect(config.pgConnStr, callback)
  }
}
