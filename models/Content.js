const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    type: {
        type: String,
        enum: ['terms_and_conditions', 'privacy_policy']
    }
},
    { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema)

module.exports = Content