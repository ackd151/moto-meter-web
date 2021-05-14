const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const inspectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Inspection", inspectionSchema);
