const Events = require('../models/Events');
const User = require('../models/User');
const moment = require('moment');
const Favourite = require('../models/Favourite');

//events
const getEvents = async (req, res) => {
  try {
    const newdate = moment(Date.now()).format("YYYY-MM-DD");
    const currentevent = await Events.find({
      eventDate: newdate
    });
    const upcommingevent = await Events.find({
      eventDate: { $gt: newdate }
    });
    const user = await User.findOne({ _id: req.user._id });
    // console.log(user.user_name)
    if (!currentevent || !upcommingevent ) {
      return res.status(400).json({
        status: 0,
        message: "No events found",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "Events",
        user: user.user_name,
        Current: currentevent,
        UpComming: upcommingevent
      });
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//previousEvent
const previousEvents = async (req, res) => {
  try {
    var newdate = moment(await Date.now()).format("YYYY-MM-DD");
    // var newdate = Date.now("dddd, YYYY Do MMM");
    // console.log(newdate);
    const current = await Events.find({
      eventDate: { $lt: newdate },
    });
    // console.log(current.eventName);
    if (current.length < 1) {
      return res.status(400).json({
        status: 0,
        message: "no events",
      });
    } else {
      // for(var i = 0; i < current.length; i++) {
      //     var event = current[i];
      // }
      //   var event = [];
      //   for (var i = 0; i < current.length; i++) {
      //     event.push(current[i].eventName, current[i].eventTime, current[i].eventDate, current[i].location.location);
      //   }
      return res.status(200).json({
        status: 1,
        message: "success",
        events: current,
      });
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//upcomingEvents
const upcomingEvents = async (req, res) => {
  try {
    const currentDate = moment(Date.now()).format("YYYY-MM-DD")
    const upcomingEvents = await Events.find({
      eventDate: { $gt: currentDate }
    })
    if (!upcomingEvents) {
      return res.status(200).json({
        status: 1,
        message: "No Upcoming Events"
      })
    }
    else {
      return res.status(200).json({
        status: 1,
        message: "up comming events",
        upcomingEvents
      })
    }
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: error.message
    })
  }
}

//currentEvents
const currentEvents = async (req, res) => {
  try {
    var newdate = moment(Date.now()).format("YYYY-MM-DD");
    // console.log(newdate);
    const current = await Event.find({
      eventDate: newdate,
    });
    // console.log(current.eventName);
    if (current.length < 1) {
      return res.status(400).json({
        status: 0,
        message: "no events",
      });
    } else {
      // for(var i = 0; i < current.length; i++) {
      //     var event = current[i];
      // }
      //   var event = [];
      //   for (var i = 0; i < current.length; i++) {
      //     event.push(current[i].eventName, current[i].eventTime, current[i].eventDate, current[i].location.location);
      //   }
      return res.status(200).json({
        status: 1,
        message: "success",
        events: current,
      });
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//getSingle
const getSingleEvent = async (req, res) => {
  try {
    const event = await Events.findById({ _id: req.params.id });

    if (!event) {
      return res.status(400).json({
        status: 0,
        message: "No Event",
      });
    } else {
      return res.status(200).json({
        status: 1,
        message: "Success",
        event,
      });
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = { getEvents, previousEvents, upcomingEvents, currentEvents, getSingleEvent }