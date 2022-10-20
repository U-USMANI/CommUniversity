const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventPicture: [],
    eventName: {
        type: String,
        default: null
    },
    eventDate: {
        type: String,
        // default: null
    },
    eventTime: {
        type: String,
        // default: null
    },
    prevDateEvents: {
        type: String,
        // default: null
    },
    upcomingEvents: {
        type: String,
        // default: null
    },
    currentEvents: {
        type: String,
        // default: null
    },
    userName: {
        type: String,
    },
    eventDescription: {
        type: String,
        default: null
    },
    longitude: {
        type: Number,
        // default: null
    },
    latitude: {
        type: Number,
        // default: null
    }, 
    location: {
        type: String,
        default: null
    }
});

 module.exports = mongoose.model("Events", eventSchema);