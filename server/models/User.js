const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { hashPassword } = require("../lib/hash");

const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
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
    geocode: { type: Object }
  },
  {
    timestamps: true,
    collation: { locale: "es" }
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = await hashPassword(user.password);
  next();
});

userSchema.virtual("fullName").get(function () {
  let fullName = this.name;
  if (this.surname) fullName += ` ${this.surname}`;
  return fullName;
});

userSchema.methods.toJSON = function () {
  var obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.set("toObject", { virtuals: true });

const schemaWithIndex = userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", schemaWithIndex);
module.exports = User;
