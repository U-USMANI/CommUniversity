const router = require('express').Router();
const {upload} = require('../config/multer')
const { adminRegister, adminLogin, postEvent } = require("../controller/adminController");

//admin
router.post("/adminregister", upload. single("image"), adminRegister );
router.post("/adminlogin", adminLogin);
router.post('/postevent', upload.array('eventPicture', 12), postEvent)


module.exports = router;