const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema({
  year: {
    type: Number,
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
  url: {
    type: String,
    required: true,
  },
  image: {
    path: {
      type: String,
      default: "/images/my18-KTM.jpg",
    },
    filename: String,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  inspections: [
    {
      type: Schema.Types.ObjectId,
      ref: "Inspection",
    },
  ],
  notes: String,
});

profileSchema.virtual("title").get(function () {
  return this.url.split("_").join(" ");
});

module.exports = model("Profile", profileSchema);
