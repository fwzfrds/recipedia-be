const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
  cloud_name: 'wazcomp',
  api_key: '191489171579864',
  api_secret: 'lVQU-0oZg2x46g-aqqimIsbJ79U'
})

module.exports = cloudinary
