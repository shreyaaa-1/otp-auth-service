const axios = require('axios')
const OTP = require('../models/otpModel')

async function createAndSendOtp(phone){
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
  return !!record
}

module.exports = { createAndSendOtp, verifyOtp }
