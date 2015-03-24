var spawn = require('child_process').spawn

exports.clone = function(repo, username, password, cloneDir, callback) {
  var repoURL = 'https://' + username + ':' + password + '@github.com/' + repo + '.git'
  var cmd = spawn('git', ['clone', repoURL, cloneDir])

  cmd.stdout.on('data', function(data) {
    // console.log(data.toString())
  })

  cmd.stderr.on('data', function(data) {
    // console.error(data.toString())
  })

  cmd.on('exit', function(code, signal) {
    if (code === null) return callback(new Error('NO EXIT CODE RETURNED'))
    if (code !== 0) return callback(code)
    if (signal !== null) return callback(new Error('TERMINATED BY SIGNAL: ' + signal))
    callback(null)
  })
}

exports.checkout = function(cloneDir, commit, callback) {
  var cmd = spawn('git', ['checkout', commit])

  cmd.stdout.on('data', function(data) {
    // console.log(data.toString())
  })

  cmd.stderr.on('data', function(data) {
    // console.error(data.toString())
  })

  cmd.on('exit', function(code, signal) {
    if (code === null) return callback(new Error('NO EXIT CODE RETURNED'))
    if (code !== 0) return callback(code)
    if (signal !== null) return callback(new Error('TERMINATED BY SIGNAL: ' + signal))
    callback(null)
  })
}

exports.merge = function(cloneDir, base, head, callback) {
  exports.checkout(cloneDir, base, function(error) {
    if (error) return callback(error)

    var cmd = spawn('git', ['merge', '--no-ff', head])

    cmd.stdout.on('data', function(data) {
      // console.log(data.toString())
    })

    cmd.stderr.on('data', function(data) {
      // console.error(data.toString())
    })

    cmd.on('exit', function(code, signal) {
      if (code === null) return callback(new Error('NO EXIT CODE RETURNED'))
      if (code !== 0) return callback(code)
      if (signal !== null) return callback(new Error('TERMINATED BY SIGNAL: ' + signal))
      callback(null)
    })
  })
}

exports.rebase = function(cloneDir, commit, callback) {

}

exports.push = function(cloneDir, localBranch, remote, remoteBranch, callback) {
  exports.checkout(cloneDir, localBranch, function(error) {
    if (error) return callback(error)

    var cmd = spawn('git', ['push', remote, localBranch + ':' + remoteBranch])

    cmd.stdout.on('data', function(data) {
      // console.log(data.toString())
    })

    cmd.stderr.on('data', function(data) {
      // console.error(data.toString())
    })

    cmd.on('exit', function(code, signal) {
      if (code === null) return callback(new Error('NO EXIT CODE RETURNED'))
      if (code !== 0) return callback(code)
      if (signal !== null) return callback(new Error('TERMINATED BY SIGNAL: ' + signal))
      callback(null)
    })
  })
}
