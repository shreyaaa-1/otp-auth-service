const jwt = require('jsonwebtoken')
const otpService = require('../services/otpService')
const User = require("../models/userModel")

exports.sendOtp = async (req, res) => {
  try {
    console.log("Received request to send OTP with body:", req.body)
    const { phone } = req.body
    if (!phone) return res.status(400).json({ message: 'Phone is required' })
    const result = await otpService.createAndSendOtp(phone)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.verifyOtp = async (req, res) => {
  try {

    const { phone, otp } = req.body

    const valid = await otpService.verifyOtp(phone, otp)

    if (!valid) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    let user = await User.findOne({ phone })

    if (!user) {
      user = await User.create({ phone })
    }

    user.lastLogin = new Date()
    await user.save()

    const token = jwt.sign(
      { phone },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.json({
      message: "OTP verified",
      token
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}