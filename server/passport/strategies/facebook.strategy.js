require("dotenv").config();

const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("../../models/User");

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      fbGraphVersion: "v3.0"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userFound = await User.findOne({
          "facebookProvider.id": profile.id
        });
        if (!userFound) {
          const newUser = {
            username: profile.id,
            password: profile.id,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
            facebookProvider: {
              id: profile.id,
              token: accessToken
            }
          };
          return done(null, newUser);
        } else {
          return done(null, userFound);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
