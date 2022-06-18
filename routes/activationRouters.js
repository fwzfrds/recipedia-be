const express = require('express')
const router = express.Router()
const { insertActivation } = require('../controllers/activationController')
const { protect, isAdmin } = require('../middlewares/authMiddleware')

//  ----> /activation.....
router
  .post('/', protect, isAdmin, insertActivation)

module.exports = router
