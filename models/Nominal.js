const mongoose = require("mongoose");

const nominalSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "event document id is required"],
  },
  fields: {
    type: [String],
    default: [""],
  },
});

exports.Nominal = mongoose.model("nominal", nominalSchema);
