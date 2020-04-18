const User = require("../models/User");
const Notification = require("../models/Notification");
const _ = require("lodash");

const addNearCase = async newCase => {
  try {
    const newCaseUser = await User.findOne(newCase.user._id);
    const nearUsers = await User.aggregate([
      {
        $geoNear: {
          near: newCaseUser.location,
          distanceField: "distance",
          maxDistance: 1000,
          spherical: true
        }
      },
      {
        $match: {
          role: "user"
        }
      }
    ]);

    const notifyUsers = nearUsers
      .filter(nearUser => !nearUser._id.equals(newCaseUser._id))
      .map(nearUser => ({
        user: nearUser._id,
        case: newCase._id,
        distance: nearUser.distance
      }));

    io.sockets.emit("broadcast", {
      type: "warning",
      message: "Hey, there is a new positive near you!",
      notifyUsers
    });

    return await Notification.create(notifyUsers);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const removeNearCase = async removedCase => {
  try {
    const removedNotifications = await Notification.deleteMany({
      case: removedCase.id
    });
    io.sockets.emit("broadcast", "This is a broadcast to refresh the map");
    return removedNotifications;
  } catch (error) {
    return error;
  }
};

module.exports = { addNearCase, removeNearCase };
