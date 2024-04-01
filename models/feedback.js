const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please provide feedback"],
  },
  type: {
    type: String,
    required: [true, "Please provide feedback type"],
  },

  addBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide author id"],
  },
});

module.exports = mongoose.model("Feedback", feedBackSchema);
