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
  return `${this.year} ${this.make} ${this.model}`;
});

module.exports = model("Profile", profileSchema);
