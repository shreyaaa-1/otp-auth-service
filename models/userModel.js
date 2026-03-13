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
  },

  loginCount: {
    type: Number,
    default: 0
  }

})

module.exports = mongoose.model("User", userSchema)