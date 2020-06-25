import cloudinary from "cloudinary-core";
import _ from "lodash";

const cloudy = cloudinary.Cloudinary.new({
  cloud_name: process.env.REACT_APP_CLOUDINARY_NAME
});

// if available returns the image from Cloudinary
export const retrieveImgUrl = (user, size) => {
  if (!user) return null;
  if (user.image.public_id) {
    const userImg = _.get(user, "image.public_id");
    return cloudy.url(userImg, {
      width: size,
      height: size,
      crop: "fill",
      secure: true
    });
  } else return user.image;
};
