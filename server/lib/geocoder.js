const nodeGeocoder = require("node-geocoder");

const geocoder = nodeGeocoder({
  provider: "google",
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  formatter: null
});

module.exports = geocoder;
