const router = require('express').Router();
const { signup, login, forgetPassword, OTPverification, resetPassword, resendCode, updatePassword, logout } = require("../controller/userAuthentication");
const { getContent, getNotifications } = require('../controller/commonController');
const { getPoints, allHeels } = require('../controller/tarController');
const { previousEvents, getEvents, upcomingEvents, currentEvents, getSingleEvent } = require('../controller/eventController')
const { updateProfile, getProfile  } = require('../controller/profileController')
const {upload} = require('../config/multer')
const {verifyToken} = require('../middleware/authenticate')
const { favourite, getfavourites } = require('../controller/favouriteController')

//registration routes
router.post("/signup",  upload.single("image"), signup)
router.post("/login", login);
router.post("/forgetPassword", forgetPassword)
router.post("/OTPverification", OTPverification)
router.post("/resendCode", resendCode)
router.post("/resetPassword", resetPassword)
router.post("/updatePassword", verifyToken, updatePassword)
router.post("/logout", verifyToken, logout)

//contents
router.get('/get-content/:type', getContent);

//Tar
router.post('/getpoints',verifyToken, getPoints)
router.get('/allheels', verifyToken, allHeels)
                        
//Notification5
router.get('/getnotifications', verifyToken, getNotifications)

//Events
router.get('/previousEvents', previousEvents)
router.get('/getEvents', verifyToken, getEvents)
router.get('/upcomingEvents', upcomingEvents)
router.get('/currentEvents', currentEvents)
router.get('/singleevent/:id', getSingleEvent)


//profile
router.post("/updateProfile", verifyToken, upload.single("image"), updateProfile)
router.get('/getProfile', verifyToken, getProfile)

//favourite
router.post('/favourites', verifyToken, favourite)
router.get('/getfavourites', verifyToken, getfavourites)


module.exports = router;