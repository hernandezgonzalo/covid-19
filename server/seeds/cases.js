require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const Case = require("../models/Case");

let totalCases = 0;

const registerCases = async () => {
  await mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  try {
    let users = await User.aggregate([
      {
        $lookup: {
          from: "cases",
          localField: "_id",
          foreignField: "user",
          as: "user_case"
        }
      },
      {
        $match: {
          $and: [
            {
              "user_case.0": {
                $exists: false
              }
            },
            { role: "user" }
          ]
        }
      }
    ]);

    for (user of users) {
      const caseObj = { user: user._id };
      try {
        const newCase = await Case.create(caseObj);
        console.log(`${newCase.id} case registered`);
        totalCases++;
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.disconnect();
    console.log(`${totalCases} cases were registered`);
  }
};

registerCases();
