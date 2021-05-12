const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema({
  year: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  notes: String,
});

profileSchema.virtual("title").get(function () {
  return `${this.year} ${this.make} ${this.model}`;
});

module.exports = model("Profile", profileSchema);
