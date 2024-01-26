const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cadetSchema = new mongoose.Schema({
  // These details will be added to the database and given to cadets by rank panel only
  dli: {
    type: String,
    required: [true, "dli is required"],
    unique: [true, "Cadet with DLI already exists"],
  },
  company: {
    type: String,
    required: [
      true,
      "Cadet's company is required, for ranked cadets it will be RP",
    ],
    default: "",
  },
  rank: {
    type: String,
    required: [true, "Rank of cadet is required"],
    enum: ["SUO", "JUO", "CSM", "CQMS", "SGT", "CPL", "LCPL", "CDT"],
    default: "CDT",
  },
  // yearOfEnrollment: {
  //   type: Number,
  //   required: [true, "Cadet's year of enrollment is required"],
  // },
  // These fields will be provided by cadets at the time of enrollment, manually generated passwords for there profiles will be given to them by rank panel only
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "email already exists"],
  },
  password: {
    type: String,
    requried: [true, "Password is required"],
    select: false,
  },
  // To be decided by the cadet himself
  firstName: {
    type: String,
    required: [true, "First name is required"],
    default: "",
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    default: "",
  },
  contact: {
    type: Number,
    required: [true, "Cadet's contact number is required"],
    default: 0,
  },
});

cadetSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 15);
});

cadetSchema.methods.comparePass = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

cadetSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.COOKIE_EXPIRE * 24 * 60 * 60,
  });
};

const Cadet = mongoose.model("cadets", cadetSchema);
module.exports = Cadet;
