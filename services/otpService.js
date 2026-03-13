const axios = require('axios')
const OTP = require('../models/otpModel')

// Configuration
const OTP_MAX_PER_WINDOW = parseInt(process.env.OTP_MAX_PER_WINDOW || 5)
const OTP_BLOCK_HOURS = parseInt(process.env.OTP_BLOCK_HOURS || 5)

async function createAndSendOtp(phone){
  // Check rate limit: count OTPs created in the last OTP_BLOCK_HOURS
  const timeWindowStart = new Date(Date.now() - OTP_BLOCK_HOURS * 60 * 60 * 1000)
  const recentOtpCount = await OTP.countDocuments({
    phone,
    createdAt: { $gte: timeWindowStart }
  })

  // If limit exceeded, return 429 error
  if (recentOtpCount >= OTP_MAX_PER_WINDOW) {
    console.warn(`Rate limit exceeded for phone: ${phone}. Attempts: ${recentOtpCount}/${OTP_MAX_PER_WINDOW}`)
    return {
      status: 429,
      message: `OTP limit reached. Try again after ${OTP_BLOCK_HOURS} hours.`
    }
  }

  const otp = Math.floor(100000 + Math.random()*900000).toString()
   console.log("Generated OTP:", otp) 
  await OTP.create({phone, otp})

  const apiKey = process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_KEY
  if (!apiKey) {
    console.warn('FAST2SMS API key not set; skipping SMS send')
    return { message: 'OTP created' }
  }

  try {
    await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&numbers=${phone}`)
    return { message: 'OTP sent' }
  } catch (err) {
    console.error('Failed to send SMS:', err.message)
    return { message: 'OTP created (sms failed)', error: err.message }
  }
}

async function verifyOtp(phone, otp){
  const record = await OTP.findOne({ phone, otp })
  
  if (!record) {
    return { valid: false, message: 'Invalid OTP' }
  }
  
  // Check if OTP has expired
  if (new Date() > record.expiryTime) {
    return { valid: false, message: 'OTP has expired' }
  }
  
  // Check if OTP has already been used
  if (record.used) {
    return { valid: false, message: 'OTP has already been used' }
  }
  
  // Mark OTP as used
  await OTP.updateOne({ _id: record._id }, { used: true })
  
  return { valid: true, message: 'OTP verified' }
}

module.exports = { createAndSendOtp, verifyOtp }
