module.exports = function (req, res, next) {
  if (!req.session || !req.session.github || !req.session.github.token)
    return res.redirect('/auth/github')
  next()
}
