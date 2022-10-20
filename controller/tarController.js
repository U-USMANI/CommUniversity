const moment = require("moment");
const Tar = require("../models/Tar");
const Point = require("../models/Point");
// const moment = require("moment");

//allHeels
const allHeels = async (req, res) => {
  try {
    const date = moment(Date.now()).format("YYYY-MM-DD");
    const heels = await Tar.find({
      tarDate: date,
    });

    // console.log(heels.tarLocation)

    if (!heels) {
      return res.status(400).json({
        status: 0,
        message: "No Heels",
      });
    } else {
      var a = [];
      for (let i = 0; i < heels.length; i++) {
        a.push(heels[i]._id, heels[i].points, heels[i].tarLocation.coordinates);
      }
      return res.status(400).json({
        status: 0,
        message: "Heels",
        heelsLocation: a,
      });
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//getPoints
const getPoints = async (req, res) => {
  try {
    // console.log("hhhh")
    
    const date = moment(Date.now()).format("YYYY-MM-DD");
    
    const tar = await Tar.find({
      tarDate: date,
      tarLocation: {
        $geoWithin: {
          $centerSphere: [
            [
              req.user.userLocation.coordinates[0],
              req.user.userLocation.coordinates[1],
            ],
            (0.5 * 1.60934) / 6378.1,
          ],
        },
      },
    });

    
    // // console.log(tar);

    // if (tar.length > 0) {
    //   for (let i = 0; i < tar.length; i++) {
    //     var a = tar[i].points;
    //     var b = tar[i]._id;
    //   }
    //   // console.log(a);
    //   const find = await Point.findOne({
    //     user_id: req.user._id,
    //     tar_id: b,
    //   });

    //   if (!find) {
    //     const point = new Point({
    //       user_id: req.user._id,
    //       tar_id: b,
    //       points: a,
    //     });
    //     await point.save();

    //     return res.status(200).send({
    //       status: 1,
    //       message: "point Received",
    //       point,
    //       heels
    //     });
    //   } else {
    //     return res.status(400).json({
    //       status: 0,
    //       message: "point Already Received",
    //     });
    //   }
    // } else {
    //   return res.status(400).json({
    //     status: 0,
    //     message: "No Points",
    //     // heels
    //   });
    // }
    // console.log(event)
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = {
  getPoints,
  allHeels,
};

