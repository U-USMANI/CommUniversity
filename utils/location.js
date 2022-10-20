const Chat = require("../models/Chat");
const User = require("../models/User");
const Admin = require("../models/Admin");

const update_location = async (object, callback) => {
  const { lat, long } = object;
  const doc_location = await User.findOneAndUpdate(
    { _id: object.user_id },
    { "userLocation.coordinates": [lat, long] },
    { new: true }
  );

  doc_location.save(async (err, results) => {
    if (err) {
      callback(err);
    } else {
        console.log(results)
        User.find({ _id: results._id }, async(err, results_query) => {
            if (err) {
                callback(err);
            } else {
                callback(results_query);
            }
        })
    }
  });
};

module.exports = {
  update_location,
};
