const multer = require('multer')
const path = require('path')

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mp4') {
      cb(new Error('File type is not supported'), false)
      return
    }
    cb(null, true)
  }
}).fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }])
