const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const caseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Case", caseSchema);
