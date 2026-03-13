const jwt = require('jsonwebtoken')
const otpService = require('../services/otpService')
const User = require("../models/userModel")

exports.sendOtp = async (req, res) => {
  try {
    console.log("Received request to send OTP with body:", req.body)
    const { phone } = req.body
    if (!phone) return res.status(400).json({ message: 'Phone is required' })
    
    const result = await otpService.createAndSendOtp(phone)
    
    // Handle rate limiting (429 response)
    if (result.status === 429) {
      return res.status(429).json({ message: result.message })
    }
    
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.verifyOtp = async (req, res) => {
  try {

    const { phone, otp } = req.body

    const result = await otpService.verifyOtp(phone, otp)

    if (!result.valid) {
      return res.status(400).json({ message: result.message })
    }

    let user = await User.findOne({ phone })

    if (!user) {
      user = await User.create({ phone, loginCount: 1 })
    } else {
      user.lastLogin = new Date()
      user.loginCount = user.loginCount + 1
      await user.save()
    }

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
