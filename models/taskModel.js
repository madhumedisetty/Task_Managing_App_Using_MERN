const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  editing: {
    type: Boolean,
    default: true,
  },
});
module.exports = TaskTable = mongoose.model("TaskTable", taskSchema);
