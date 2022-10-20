const Content = require('../models/Content');

const getContent = async (req, res) => {

    if (!req.params.type) {
        return res.status(400).send({
            status: 0,
            message: 'Type is required.'
        });
    }
    else {
        Content.find({ type: req.params.type })
            .exec()
            .then(content => {
                if (content.length > 0) {
                    res.status(200).send({
                        status: 1,
                        message: content
                    });
                }
                else {
                    res.status(404).send({
                        status: 0,
                        message: 'Content not found.'
                    });
                }
            })
            .catch(err => {
                res.status(400).send({
                    status: 0,
                    message: err
                });
            });
    }
}

//Notification
const getNotifications = async (req, res) => {
    try {
        // const user = req.user._id
        // user.toString();
        // console.log(user);
        // return
        const notification = await Notification.find({ receiver_id: req.user._id });

        // console.log(notification);

        if (!notification) {
            return res.status(404).send({ status: 0, message: "No Notification" });
        } else {
            return res
                .status(200)
                .send({
                    status: 1,
                    message: "notification",
                    data: { notification: notification },
                });
        }
    } catch (error) {
        return res.status(404).send(error.message);
    }
};


module.exports = {
    getContent, getNotifications
}