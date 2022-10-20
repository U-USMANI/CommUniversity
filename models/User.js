const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        // trim: true
    },
    user_id: {
        type: String,
        trim: true
    },
    user_program: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    user_email: {
        type: String,
        trim: true
    },
    user_password: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    // user_image: {
    //     type: String,
    //     default: null
    // },
    user_authentication: {
        type: String,
        required: false
    },
    code: {
        type: Number
    },
    verified: {
        type: Number,
        default: 0
    },
    userLocation: {
        location: {
          type: String,
            
        },
        type: {
          type: String,
          enum: ["Point"],
          required: false,
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: false,
        },
      },
    user_social_token: {
        type: String,
        required: false
    },
    user_social_type: {
        type: String,
        required: false
    },
    user_device_type: {
        type: String,
        required: false
    },
    user_device_token: {
        type: String,
        required: false
    },
    current_password: {
        type: String,
    }
},
    { timestamps: true },
);

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.KEY);
    user.user_authentication = token;
    await user.save();
    //console.log("tokeeen--->", token);
    return token;
}

const User = mongoose.model("User", userSchema)

module.exports = User 