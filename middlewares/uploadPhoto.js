const multer = require('multer')
// const path = require('path')

const storage = multer.diskStorage({
// const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[1])
  }
})

const maxSize = 2 * 1024 * 1024 // 2mb
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg, .jpeg, and .mp4 format allowed!'))
    }
  },
  limits: { fileSize: maxSize }
})
// const upload = multer({ storage })

// const multipleUpload = upload.fields([{ name: 'image', maxCount: 3 }])

module.exports = upload
