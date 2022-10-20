const jwt = require ('jsonwebtoken')
const User = require('../models/User')

const verifyToken = async(req , res, next) =>{
    if(!req.headers['authorization']){
        return res.status(400).send({
            status : 0,
            message : "unauthorized"
        })
    }
     try {
        // Get token from header
        token = req.headers['authorization'].split(' ')[1]
        //verify token
        const decoded = jwt.verify(token, process.env.KEY)
        //console.log('token ** ', decoded);
        //Get user from the token
        req.userId= decoded._id
        req.user = await User.findById(decoded._id).select('-password')
        next()
        // console.log(req.user)
    } catch (error) {
        console.log(error)
        return res.status(401).send({ status: 0, message: ' catch Unauthorized' });
    }
};


// const User = require("../model/User")
// const jwt = require("jsonwebtoken")
// const auth = async (req, res, next) => {
//     if (!req.headers['authorization']) {
//         return res.status(400).json({ status: 0, msg: "Unauthorzied" })
//     }
//     const authHeader = req.headers['authorization']

//     const bearer = authHeader.split(' ')

//     const token = bearer[1]
    
//     jwt.verify(token, process.env.KEY, (err, user) => {
//         if (err) {
//             const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
//             return res.status(400).json({ status: 0, message: message })
//         }
//         req.payload = user
//         next()
//     })
// }




module.exports = {verifyToken}
