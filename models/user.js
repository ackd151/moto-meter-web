const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Scheam({
  username: {
    type: String,
    required: true,
    unique: true,
  },
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

module.exports = model("User", userSchema);
