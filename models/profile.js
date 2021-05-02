const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema({
  year: Number,
  make: String,
  model: String,
  hours: Number,
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

profileSchema.virtual("title").get(function () {
  return `${this.year} ${this.make} ${this.model}`;
});

module.exports = model("Profile", profileSchema);
