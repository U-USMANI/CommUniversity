const express = require('express');
const cors = require('cors');  
const env = require('dotenv');
var bodyParser = require('body-parser');
const fs = require("fs");
const mongoose = require('mongoose');
// const userRoutes = require("./routes/userroutes");
const http = require('http');
// const path = require('path');
const socket = require('socket.io');

const app = express();

const {
    get_messages,
    send_message
} = require('./utils/message');
const { update_location } = require("./utils/location");


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
env.config();

// const options = {
//   key: fs.readFileSync('/home/serverappsstagin/ssl/keys/c2a88_d6811_bbf1ed8bd69b57e3fcff0d319a045afc.key'),
//   cert: fs.readFileSync('/home/serverappsstagin/ssl/certs/server_appsstaging_com_c2a88_d6811_1665532799_3003642ca1474f02c7d597d2e7a0cf9b.crt'),
// };

const server = require('http').createServer(app);

var io = socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: false,
        transports: ['websocket', 'polling'],
        allowEIO3: true
    },
});


//mongodb connection
mongoose.connect(
    process.env.MONGODBURL,
    {
        useNewUrlParser: true,
        useunifiedTopology: true,
    }

).then(() => {
    console.log('Connected');
});

//routes    
const apiRoutes = require('./routes/userroutes')
const Content = require('./models/Content');
app.use('/api', apiRoutes);
app.use('/upload', express.static('upload'));

 // const server = http.createServer(app);
const Notification = require("./models/Notification");
// const { push_notifications } = require("./utils/pushNotification");
const adminapiRoutes = require('./routes/adminroutes')
app.use('/admin', adminapiRoutes);

/** Content seeder */
const contentSeeder = [
    {
        title: "Privacy Policy",
        content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!.",
        type: "privacy_policy"
    },
    {
        title: "Terms and Conditions",
        content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!.",
        type: "terms_and_conditions"
    }
];
const dbSeed = async () => {
     await Content.deleteMany({});
     await Content.insertMany(contentSeeder);
}
dbSeed().then(() => {
})

//Run when client connects
io.on('connection', socket => {
    console.log("socket connection " + socket.id);
    //locationemitt
     //Location Emit
  socket.on("update_location", async function (object) {
    var lat = "user_" + object.lat;
    var long = "user_" + object.long;
    update_location(object, function (response_obj) {
      if (response_obj) {
        console.log("Location has been successfully executed...");
        io.to(lat)
          .to(long)
          .emit("response", { object_type: "update_location", data: response_obj });
      } else {
        console.log("location has been failed...");
        io.to(lat).to(long).emit("error", {
          object_type: "update_location",
          message: "There is some problem in location...",
        });
      }
    });
  })
  //Location End
  socket.on("get_messages", async function (object) {
    var user_room = "user_" + object.sender_id;
    socket.join(user_room);
    get_messages(object, function (response) {
      if (response.length > 0) {
        console.log("get_messages has been successfully executed...");
        io.to(user_room).emit("response", {
          object_type: "get_messages",
          data: response,
        });
      } else {
        console.log("get_messages has been failed...");
        io.to(user_room).emit("error", {
          object_type: "get_messages",
          message: "There is some problem in get_messages...",
        });
      }
    });
  });
    socket.on('get_messages', function (object) {
        var user_room = "user_" + object.sender_id;
        socket.join(user_room);
        get_messages(object, function (response) {
            if (response.length > 0) {
                console.log("get_messages has been successfully executed...");
                io.to(user_room).emit('response', { object_type: "get_messages", data: response });
            } else {
                console.log("get_messages has been failed...");
                io.to(user_room).emit('error', { object_type: "get_messages", message: "There is some problem in get_messages..." });
            }
        });
    });

// SEND MESSAGE EMIT
  socket.on("send_message", async function (object) {
    // notification start //
    const receiver_object = await User.find({
      _id: object.receiver_id,
    });

    const sender_object = await User.find({
      _id: object.sender_id,
    });

    console.log("sender_object:", sender_object);

    let receiver_device_token = "";
    let receiver_name = "";
    let is_notification_reciever = " ";
    for (let i = 0; i < receiver_object.length; i++) {
      receiver_device_token = receiver_object[i].user_device_token;
      receiver_name = receiver_object[i].userName;
      is_notification_reciever = receiver_object[i].is_notification;
    }

    let sender_device_token = "";
    let sender_name = "";
    let sender_image = "";
    // let sender_id = "";
    for (let i = 0; i < sender_object.length; i++) {
      sender_device_token = sender_object[i].user_device_token;
      sender_name = sender_object[i].userName;
      sender_image = sender_object[i].profilePicture;
      // sender_id = sender_object[i]._id;
    }

    // console.log("sender_name:", sender_name);

    const notification_obj_receiver = {
      user_device_token: receiver_device_token,
      title: receiver_name,
      body: `${sender_name} has send you a message.`,
      notification_type: "msg_notify",
      vibrate: 1,
      sound: 1,
      sender_id: object.sender_id,
      sender_name: sender_name,
      sender_image: sender_image,
    };
    // console.log("notification_obj_receiver:", notification_obj_receiver);
    // is_notification_reciever == "true"
    //  console.log("reciever_notificatrion:", is_notification_reciever);
    if (is_notification_reciever == 1) {
      push_notifications(notification_obj_receiver);
    }

    const notification = new Notification({
      user_device_token: notification_obj_receiver.user_device_token,
      title: notification_obj_receiver.title,
      body: notification_obj_receiver.body,
      notification_type: notification_obj_receiver.notification_type,
      sender_id: notification_obj_receiver.sender_id,
      sender_name: notification_obj_receiver.sender_name,
      sender_image: notification_obj_receiver.sender_image,
      receiver_id: notification_obj_receiver.receiver_id,
      date: moment(new Date()).format("YYYY-MM-DD"),
    });
    await notification.save();

    // notification end //

    var sender_room = "user_" + object.sender_id;
    var receiver_room = "user_" + object.receiver_id;
    send_message(object, function (response_obj) {
      if (response_obj) {
        console.log("send_message has been successfully executed...");
        io.to(sender_room)
          .to(receiver_room)
          .emit("response", { object_type: "get_message", data: response_obj });
      } else {
        console.log("send_message has been failed...");
        io.to(sender_room).to(receiver_room).emit("error", {
          object_type: "get_message",
          message: "There is some problem in get_message...",
        });
      }
    });
  });
});


//environment variables or you can say constants
// app.use(userRoutes)
const PORT = process.env.PORT || 3088;
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});