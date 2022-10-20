const User = require('../models/User');
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../config/mailer')

//signup
const signup = async (req, res) => {
    try {

        console.log(req.body)

        if (!req.body.user_name) {
            return res.status(400).json({ status: 0, msg: "User Name is required" })
        }
        else if (!req.body.user_email) {
            return res.status(400).json({ status: 0, msg: "Email is required" })
        } else if (!req.body.user_program) {
            return res.status(400).json({ status: 0, msg: "Program is required" })
        } else if (!req.body.address) {
            return res.status(400).json({ status: 0, msg: "Address is required" })
        } else if (!req.body.user_password) {
            return res.status(400).json({ status: 0, msg: "Password is required" })
        } else if (!req.body.confirm_password) {
            return res.status(400).json({ status: 0, msg: "Confirm Password is required" })
        } else if (!req.body.bio) {
            return res.status(400).json({ status: 0, msg: "Bio is required" })
        }
        // else if (req.body.user_password !== req.body.confirm_password) {
        //     return res.status(400).json({ status: 0, msg: "Password Mismatch" })
        // }
        // console.log(user_name)
        const user = await User.findOne({ user_email: req.body.user_email })
        if (user) {
            return res.status(400).json({ status: 0, msg: "Email already exist" })
        } else {
            if (req.file) {
                image = req.file.path
            }

            const hash_password = await bcrypt.hash(req.body.user_password, 10)
            const verificationCode = 123456;

            const newUser = new User({
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_program: req.body.user_program,
                address: req.body.address,
                user_password: hash_password,
                // confirm_password: req.body.confirm_password,
                bio: req.body.bio,
                code: verificationCode,
                user_device_token: req.body.user_device_token,
                user_device_type: req.body.user_device_type,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                image: (req.file ? req.file.path : req.body.image),

            })
            const token = await newUser.generateAuthToken()
            await newUser.save()
            return res.status(201).json({ status: 1, msg: "Account created", user: newUser })
        }

    }

    catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


//login
const login = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(404).json({ status: 0, msg: "Email is required" })
        } else if (!req.body.user_password) {
            return res.status(404).json({ status: 0, msg: "Password is required" })
        } else {
            const user = await User.findOne({ user_email: req.body.user_email })
            if (!user) {
                return res.status(404).json({ status: 0, msg: "User not found" })
            } else {
                const isMatch = await bcrypt.compare(req.body.user_password, user.user_password)
                if (!isMatch) {
                    return res.status(404).json({ status: 0, msg: "Password not match" })
                } else {
                    // user.user_authentication = null
                    const token = await user.generateAuthToken()
                    User.findOneAndUpdate({
                        user_authentication: token,
                        user_device_token: req.body.user_device_token,
                    }).exec();
                    user.user_device_token = req.body.user_device_token;
                    user.user_device_type = req.body.user_device_type;
                    user.user_authentication = token;
                    user.latitude = req.body.latitude;
                    user.longitude = req.body.longitude;
                    user.save();
                    return res.status(200).send({
                        status: 1,
                        message: "User logged in successfully!",
                        user
                    });
                    return res.status(200).json({ status: 1, msg: "User Login Successful", user })
                }
            }
        }
    } catch (error) {

        return res.status(400).json({ status: 0, message: error.message })
    }
}

//Forget password
const forgetPassword = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(400).json({ status: 0, msg: "Email is required" });
        } else {
            const user = await User.findOne({ user_email: req.body.user_email })
            if (!user) {
                return res.status(400).json({ status: 0, msg: "User not found" });
            } else {
                // const verficationCode = Math.floor(10000 + Math.random() * 900000)
                const verficationCode = 123456
                const newUser = await User.findByIdAndUpdate({ _id: user._id }, { code: verficationCode })
                if (newUser) {
                    sendEmail(user.user_email, verficationCode, "Forget Password")
                    return res.status(200).json({ status: 1, msg: "Code successfully send to email : 123456", userId: newUser._id })
                } else {
                    return res.status(200).json({ status: 0, msg: "Something went wrong" })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

//OTP verification 
const OTPverification = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, message: "User ID is required" })
        } else if (!req.body.verificationcode) {
            return res.status(400).json({ status: 0, message: "Verification code is required" })
        }
        await User.findOne({ _id: req.body.user_id }).then((result) => {

            if (req.body.verificationcode == result.code) {
                User.findByIdAndUpdate({ _id: req.body.user_id }, { verified: 1, code: null }, { new: true }, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(400).json({ status: 0, message: "Something went wrong", err });
                    }
                    if (result) {
                        return res.status(200).json({ status: 1, message: "OTP matched successfully", data: result })
                    }
                })
            } else {
                return res.status(400).json({ status: 0, message: "OTP not matched" })
            }
        }).catch((err) => {
            console.log(err.message);
            return res.status(400).json({ status: 0, message: "Verification not matched" })
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

//Update Password
const updatePassword = async (req, res) => {
    try {
        if (!req.body.old_password) {
            res.send({ status: 0, message: 'Old Password field is required' });
        }
        else if (!req.body.new_password) {
            res.send({ status: 0, message: 'New Password field is required' });
        }
        else {
            // const userFind = await User.findOne({ _id: req.body.user_id, user_authentication: req.body.user_authentication });
            const userFind = await User.findOne({ _id: req.user._id });

            if (userFind) {
                const user_password = await bcrypt.compare(req.body.old_password, userFind.user_password);
                if (userFind && user_password == true) {
                    const newPassword = await bcrypt.hash(req.body.new_password, 8);
                    await User.findOneAndUpdate({ _id: req.user._id }, { user_password: newPassword });
                    res.status(200).send({ status: 1, message: 'New password Updated Successfully.' });
                }
                else {
                    res.status(400).send({ status: 0, message: 'Password Not Match' });
                }
            } else {
                res.status(400).send({ status: 0, message: 'Something Went Wrong.' });
            }
        }
    }
    catch (error) {
        res.status(400).send({
            status: 0,
            message: error
        });
    }
}

//resendcode
const resendCode = async (req, res) => {
    if (!req.body.user_id) {
        return res.status(400).send({ status: 0, message: 'User id failed is required.' });
    }
    else {
        User.find({ _id: req.body.user_id })
            .exec()
            .then(result => {
                // const verificationCode = Math.floor(100000 + Math.random() * 900000);
                const verificationCode = 123456

                User.findByIdAndUpdate(req.body.user_id, { verified: 0, code: verificationCode }, (err, _result) => {
                    if (err) {
                        return res.status(400).send({ status: 0, message: 'Something went wrong.' });
                    }
                    if (_result) {
                        sendEmail(result[0].user_email, verificationCode, "Verification Code Resend");
                        return res.status(200).send({
                            status: 1, message: 'Verification code resend successfully.', code:
                                verificationCode
                        });
                    }
                });
            })
            .catch(err => {
                res.status(400).send({
                    status: 0,
                    message: 'User not found'
                });
            });
    }
}

//resetPassword
const resetPassword = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, msg: "User id is required" })
        } else if (!req.body.user_password) {
            return res.status(400).json({ status: 0, msg: "Please enter a password" })
        } else {
            const user = await User.findById(req.body.user_id)
            if (!user) {
                return res.status(400).json({ status: 0, msg: "User not found" })
            } else {
                const hashPassword = await bcrypt.hash(req.body.user_password, 10)
                const user_password = await User.findByIdAndUpdate({ _id: user._id }, { user_password: hashPassword })
                if (hashPassword) {
                    return res.status(200).json({ status: 1, msg: "Password changed Succussfully" })
                } else {
                    return res.status(400).json({ status: 0, msg: "Something went wrong" })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

//logout
const logout = async (req, res) => {
    try {
        //if (!req.body._id) {
        //     res.status(400).send({ status: 0, message: 'User ID field is required' });
        // }
        // else if (!req.headers.authorization) {
        //     res.status(400).send({ status: 0, message: 'Authentication Field is required' });
        // }
        const updateUser = await User.findOneAndUpdate({ _id: req.user._id }, {
            user_authentication: null,
            user_device_type: null,
            user_device_token: null
        });
        res.status(200).send({ status: 1, message: 'User logout Successfully.' });
    } catch (e) {
        res.status(400).send(e.message);
    }
}


module.exports = { signup, login, forgetPassword, OTPverification, resendCode, resetPassword, updatePassword, logout }