const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bikeProfiles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = model("User", userSchema);
