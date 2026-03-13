const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

  phone: {
    type: String,
    required: true,
    unique: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  lastLogin: {
    type: Date
  }

})

module.exports = mongoose.model("User", userSchema)