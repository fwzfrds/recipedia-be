const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const protectCookie = (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1]
      // const token = req.cookies.token
      // if (!token) {
      //   return next(createError(400, 'server need token'))
      // }
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
      req.decoded = decoded
      next()
    } else {
      next(createError(400, 'server need token, please login!'))
    }
  } catch (error) {
    if (error && error.name === 'JsonWebTokenError') {
      next(createError(400, 'token invalid'))
    } else if (error && error.name === 'TokenExpiredError') {
      next(createError(400, 'token expired, please login!'))
    } else {
      next(createError(400, 'Token not active, please login!'))
    }
  }
}

const isTokenValid = (req, res, next) => {
  try {
    let token
    if (req.params.token) {
      token = req.params.token

      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
      // let decoded = jwt.verify(token, 'dsfasdfsdaf');
      // console.log(decoded);
      req.decoded = decoded
      next()
    } else {
      next(createError(400, 'server need token, please login!'))
    }
  } catch (error) {
    if (error && error.name === 'JsonWebTokenError') {
      next(createError(400, 'token invalid'))
    } else if (error && error.name === 'TokenExpiredError') {
      next(createError(400, 'token expired, please login!'))
    } else {
      next(createError(400, 'Token not active, please login!'))
    }
  }
}

const isUser = (req, res, next) => {
  if (req.decoded.status === 0) {
    return next(createError(400, 'Your account has not been activated, please check your email!'))
  }
  if (req.decoded.role !== 1) {
    return next(createError(400, 'user only'))
  }
  next()
}

const isAdmin = (req, res, next) => {
  if (req.decoded.role !== 0) {
    return next(createError(400, 'admin only'))
  }
  next()
}

module.exports = {
  protectCookie,
  isUser,
  isAdmin,
  isTokenValid
}
