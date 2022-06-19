const express = require('express')
const router = express.Router()
const usersRouters = require('./usersRouters')
const recipesRouters = require('./recipesRouters')
const activationRouters = require('./activationRouters')

router
  .use('/users', usersRouters)
  .use('/activation', activationRouters)
  .use('/recipes', recipesRouters)

module.exports = router
