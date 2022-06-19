const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'photo') {
      cb(null, './upload/recipe/photo')
    } else {
      cb(null, './upload/recipe/video')
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[1])
  }
})

const maxSize = 200 * 1024 * 1024 // 100mb for video 2mb for image
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4') {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only video with .mp4, photo with .png, .jpg, and .jpeg extension allowed!'))
    }
  },
  limits: { fileSize: maxSize }
}).fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }])
// const upload = multer({ storage })

// const multipleUpload = upload.fields([{ name: 'image', maxCount: 3 }])

module.exports = upload
