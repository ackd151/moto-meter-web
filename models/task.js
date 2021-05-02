const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  interval: {
    type: Number,
    required: true,
  },
  lastCompletedAt: {
    type: Number,
    required: true,
  },
});

module.exports = model("Task", taskSchema);
