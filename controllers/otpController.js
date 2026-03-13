const jwt = require('jsonwebtoken')
const otpService = require('../services/otpService')

exports.sendOtp = async (req, res) => {
  try {
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
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP required' })
    const valid = await otpService.verifyOtp(phone, otp)
    if (!valid) return res.status(400).json({ message: 'Invalid OTP' })
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ message: 'OTP verified', token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
