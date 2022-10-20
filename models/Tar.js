const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/User"); 
const moment = require("moment");

let tarSchema = new Schema(
  {
    tarLocation: {
      location: {
        type: String,
        default: null,
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
    radius: {
      type: Number,
      default: 0.5,
    },
    points: {
      type: Number,
      default: null,
    },
    tarDate:{
      type: String,
      default: moment(Date.now()).format('YYYY-MM-DD'),
    }
  },
  {
    timestamps: true,
  }
);

const Tar = mongoose.model("Tar", tarSchema);
module.exports = Tar;