const multer = require('multer'); // This is used for uploading files.

// setting up Storage Engine for multer.
const storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, './public/images')
   },
   filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
   }
})
const upload = multer({storage});

module.exports = upload;
