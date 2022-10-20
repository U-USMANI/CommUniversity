const Admin = require('../models/Admin');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment');
const Events = require('../models/Events');

//adminLogin
const adminLogin = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({
            status: 0,
            message: 'Email field is required'
        });
    }
    else if (!req.body.password) {
        return res.status(400).json({
            status: 0,
            message: 'Password field is required'
        });
    }
    else {
        Admin.findOne({ email: req.body.email })
            .exec()
            .then(async admin => {
                // console.log(admin.length, "hello 2")
                if (admin.length < 1) {
                    return res.status(200).json({
                        status: 1,
                        message: 'Email not found'
                    });
                }
                else {
                    bcrypt.compare(req.body.password, admin.password, (err, result) => {
                        console.log(err)
                        if (err) {
                            return res.status(400).json({
                                status: 0,
                                message: 'Invalid password',
                            });
                        }
                        if (result) {
                            // console.log("hello",result)
                            // if (admin.is_blocked == 1) {
                            //     return res.status(400).json({
                            //         status: 0,
                            //         message: 'You are temporarily blocked by Admin'
                            //     });

                            // }
                            // else if (admin.role != 'admin') {
                            //     return res.status(400).json({
                            //         status: 0,
                            //         message: 'Access Denied!'
                            //     });

                            // }
                            // else {
                            const token = jwt.sign(
                                {
                                    email: admin.email,
                                    userId: admin._id
                                },
                                process.env.KEY,
                                // {
                                //     expiresIn: '1hr'
                                // }
                            );
                            //   User.findOneAndUpdate({ user_authentication: token})
                            //   .exec()
                            //  console.log(user.user_authentication);
                            admin.user_device_type = req.body.user_device_type,
                                admin.user_device_token = req.body.user_device_token,
                                // user.user_is_profile_complete = 1
                                // user.user_authentication = token
                                admin.save()
                            //console.log(err.message)
                            return res.status(200).json({
                                status: 1,
                                message: 'User logged in successfully!',
                                token: token,
                                data: admin
                            });
                            // }
                        }
                        return res.status(400).json({
                            status: 0,
                            message: 'Incorrect password.'
                        });
                    })
                }
            })
            .catch(err => {
                res.status(400).json({
                    status: 0,
                    message: err.message
                });
            });
    }
}

//adminRegister
const adminRegister = async (req, res) => {
    if (!req.body.user_name) {
        res.status(400).json({
            status: 0,
            message: 'Username is required.'
        });
    }
    else if (!req.body.email) {
        res.status(400).json({
            status: 0,
            message: 'Email is required.'
        });
    }
    else if (!req.body.password) {
        res.status(400).json({
            status: 0,
            message: 'Password is required.'
        });
    }
    // else if (!req.body.phone_number) {
    //     res.status(400).send({
    //         status: 0,
    //         message: 'Phone Number is required.'
    //     });
    // }
    // else if (!req.body.user_description) {
    //     res.status(400).send({
    //         status: 0,
    //         message: 'Description is required.'
    //     });
    // }
    // else if (!req.body.user_image) {
    //     res.status(400).send({
    //         status: 0,
    //         message: 'Image is required.'
    //     });
    // }
    else {
        Admin.find({ email: req.body.email })
            .exec()
            .then(admin => {
                if (admin.length >= 1) {
                    res.status(400).json({
                        status: 0,
                        message: 'Email already exists!'
                    });
                }
                else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            res.status(400).json({
                                status: 0,
                                message: err
                            });
                        }
                        else {
                            if (req.file) {
                                image = req.file.path
                            }

                            // const verificationCode = Math.floor(100000 + Math.random() * 900000);
                            //  const verificationCode = 123456

                            const admin = new Admin;
                            admin.user_name = req.body.user_name;
                            admin.email = req.body.email;
                            admin.password = hash;
                            admin.image = (req.file ? req.file.path : req.body.image),
                            admin.user_device_type = req.body.user_device_type;
                            admin.user_device_token = req.body.user_device_token;

                            admin.save()
                                // console.log(user)
                                .then(result => {
                                    // sendEmail(user.email, verificationCode, "Email verification");

                                    return res.status(200).json({
                                        status: 1,
                                        message: 'Registered successfully',
                                        data: {
                                            user: result
                                        }
                                    });
                                })
                                .catch(errr => {
                                    res.status(400).json({
                                        status: 0,
                                        message: errr
                                    });
                                });
                        }
                    });
                }
            })
            .catch(err => {
                res.status(400).send({
                    status: 0,
                    message: err
                });
            });
    }
}

//postEvent
const postEvent = async (req, res) => {
    try {
        if (!req.body.eventName) {
            return res.status(400).send({
                status: 0,
                message: "Event Name field is required.",
            });
        }
        else if (!req.body.eventDescription) {
            return res.status(400).send({
                status: 0,
                message: "Event Description field is required.",
            });
        } else {
            const Files = [];
            if (req.files !== undefined) {
                for (let i = 0; i < req.files.length; i++) {
                    Files.push(req.files[i].path);
                }
            }
            else {
                Files = []
            }
            if (req.files) {
                eventPicture = req.files.path;
                // console.log(eventPicture);
            }
            // console.log(Files);  
            // const date = moment(req.body.eventDate).format('YYYY-MMM-DD dddd')
            const date = moment(req.body.eventDate, [moment.ISO_8601, 'DD/MM/YYYY']).format("YYYY-MM-DD");
            const time = moment(req.body.eventTime, [moment.ISO_8601, 'HH:mm']).format("hh:mm a");

            const event = new Events({
                eventPicture: Files,
                eventName: req.body.eventName,
                eventDate: date,
                eventTime: time,
                eventDescription: req.body.eventDescription,
                location: req.body.location,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            })
            // console.log(event)

            await event.save()

            if (event) {
                return res.status(200).json({
                    status: 1,
                    message: "Event Added succesfully",
                    event
                })
            }
            else {
                return res.status(400).json({
                    status: 0,
                    message: 'Event didnt added'
                });
            }
        }
    } catch (error) {
        return res.status(400).json({
            status: 0,
            message: error.message
        })
    }
}


module.exports = { adminRegister, adminLogin, postEvent }