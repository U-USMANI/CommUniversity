const Favourite = require("../models/Favourite");

//favourite
const favourite = async (req, res) => {
    try {
      if (!req.body.event_id) {
        res.status(400).send({
          status: 0,
          message: "eve is Required",
        });
      } else {
        const find = await Favourite.findOne({
          user_id: req.user._id,
          event_id: req.body.event_id, 
        });
        // console.log(find)
        //  return
        
        if (!find) {
          const add = new Favourite({
            user_id: req.user._id,
            event_id: req.body.event_id,
          });
          
          await add.save();
          
          // const check = await Event.findOneAndUpdate({_id: req.body.event_id},{favourite: 1},{new: true})
          // console.log(check.favourite)
  
          return res.status(200).send({
            status: 1,
            message: "Event has added to your favourite list",
            add,
          });
        } else {
          const remove = await Favourite.findOneAndDelete({
            user_id: req.user._id,
            event_id: req.body.event_id,
          });
          await remove.delete();
  
          // const check = await Event.findOneAndUpdate({_id: req.body.event_id},{favourite: 0},{new: true})
          // console.log(check.favourite)
  
          return res.status(200).send({
            status: 1,
            message: "Event has removed from your favourite list",
            remove,
          });
        }
      }
    } catch (error) {
      return res.status(404).send(error.message);
    }
  };

//getFavourites
const getfavourites = async (req, res) => {
    try {
      const favorites = await Favourite.find({ user_id: req.user._id })
        .populate({
          path: "event_id",
          model: "Event",
          select:
            "eventName , eventDate , eventTime , eventDescription , eventPicture , location , longitude , latitude ",
        });
  
        // console.log(favorites)
      if (favorites.length < 1 ) {
        return res.status(400).json({
          status: 0,
          message: "No Event",
        });
      } else {
        return res.status(200).json({
          status: 1,
          message: "success",
          favorites
        });
      }
    } catch (error) {
      return res.status(404).json(error.message);
    }
  };
  

  module.exports = { favourite, getfavourites }
  