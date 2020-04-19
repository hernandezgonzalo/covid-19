require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const spain = require("./spain.geojson");
const randomPointsOnPolygon = require("random-points-on-polygon");
const geocoder = require("../lib/geocoder");

const faker = require("faker");
faker.locale = "es";

const usersN = process.argv[2] || 1;
const usersArr = [];

for (let i = 0; i < usersN; i++)
  usersArr.push({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    image: faker.image.avatar()
  });

const createUsers = async users => {
  for (user of users) {
    const { username, name, surname, image } = user;
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      const existUser = await User.findOne({ username });
      if (!existUser) {
        const points = randomPointsOnPolygon(1, spain);
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(user.password, salt);
        const [lon, lat] = points[0].geometry.coordinates;
        const [geocode] = await geocoder.reverse({ lat, lon });
        const newUser = {
          username,
          password,
          name,
          surname,
          image,
          location: points[0].geometry,
          geocode
        };
        await User.create(newUser);
        console.log(`${username} created`);
      } else {
        console.log(`${username} already exists`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      await mongoose.disconnect();
    }
  }
};

createUsers(usersArr);
