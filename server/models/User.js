const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { hashPassword, checkHashed } = require("../lib/hash");

const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {
      type: String,
      match: [EMAIL_PATTERN, "Please fill a valid email address"],
      lowercase: true
    },
    name: { type: String, required: true },
    surname: { type: String },
    image: { type: Object },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    geocode: { type: Object },
    settings: {
      theme: { type: String, enum: ["dark", "light"], default: "dark" }
    }
  },
  {
    timestamps: true,
    collation: { locale: "es" }
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = await hashPassword(user.password);
  next();
});

UserSchema.virtual("fullName").get(function () {
  let fullName = this.name;
  if (this.surname) fullName += ` ${this.surname}`;
  return fullName;
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

UserSchema.methods.isPasswordOk = function (password) {
  return checkHashed(password, this.password);
};

UserSchema.set("toObject", { virtuals: true });

const SchemaWithIndex = UserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", SchemaWithIndex);
module.exports = User;
