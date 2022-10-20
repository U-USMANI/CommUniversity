const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // if (file.fieldname == "user_image") {
        //     cb(null, './upload/user')
        // }
        if (file.fieldname == "image") {
            cb(null, './upload/profile')
        } else if (file.fieldname == "eventPicture") {
            cb(null, "./upload/events");
        }
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
})
function fileFilter(req, file, cb) {
    cb(null, true)
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

module.exports = { upload }

