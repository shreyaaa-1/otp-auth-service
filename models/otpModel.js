const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
 phone:String,
 otp:String,
 used:{
  type:Boolean,
  default:false
 },
 expiryTime:{
  type:Date,
  default:() => new Date(Date.now() + 5 * 60 * 1000)
 },
 createdAt:{
  type:Date,
  default:Date.now,
  expires:300
 }
})

module.exports = mongoose.model("OTP",otpSchema)