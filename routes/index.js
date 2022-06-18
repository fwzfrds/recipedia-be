const express = require('express')
const router = express.Router()
const usersRouters = require('./usersRouters')
const activationRouters = require('./activationRouters')

router
  .use('/users', usersRouters)
  .use('/activation', activationRouters)

module.exports = router
