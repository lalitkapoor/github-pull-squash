var exec = require('child_process').exec
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
    return callback(null)
  })
}

exports.checkout = function(cloneDir, commit, callback) {
  var cmd = spawn('git', ['checkout', commit], {cwd: cloneDir})

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
    return callback(null)
  })
}

exports.merge = function(cloneDir, head, callback) {
  var cmd = spawn('git', ['merge', '--ff', head], {cwd: cloneDir})

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
    return callback(null)
  })
}

exports.commit = function(cloneDir, message, callback) {
  var cmd = spawn('git', ['commit', '-m', message], {cwd: cloneDir})

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
    return callback(null)
  })
}

exports.squash = function(cloneDir, remote, remoteBranch, message, callback) {
  exec('git log ' + remote + '/' + remoteBranch + ".. --pretty=oneline | wc -l | sed -e 's/^[ \t]*//'"
  , {cwd: cloneDir}
  , function(error, stdout, stderr) {
      if (error) return callback(new Error('ERROR CALCULATING NUMBER OF COMMITS'))
      var numCommits = parseInt(stdout)

      var cmd = spawn('git', ['reset', '--soft', 'HEAD~'+numCommits], {cwd: cloneDir})

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

        exports.commit(cloneDir, message, callback)
      })
    }
  )
}

exports.resetHard = function(cloneDir, commit, callback) {
  var cmd = spawn('git', ['reset', '--hard', commit], {cwd: cloneDir})

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
    return callback(null)
  })
}

exports.pull = function(cloneDir, remote, remoteBranch, callback) {
  var cmd = null
  if (typeof(remote) === 'function') {
    callback = remote
    cmd = spawn('git', ['pull'], {cwd: cloneDir})
  } else {
    cmd = spawn('git', ['pull', remote, remoteBranch], {cwd: cloneDir})
  }

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
    return callback(null)
  })
}

exports.push = function(cloneDir, localBranch, remote, remoteBranch, callback) {
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
    return callback(null)
  })
}
