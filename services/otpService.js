const axios = require('axios')
const OTP = require('../models/otpModel')

async function createAndSendOtp(phone){
  const otp = Math.floor(100000 + Math.random()*900000).toString()
  await OTP.create({phone, otp})
  await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_API_KEY&route=otp&variables_values=${otp}&numbers=${phone}`)
  return { message: 'OTP sent' }
}

async function verifyOtp(phone, otp){
  const record = await OTP.findOne({ phone, otp })
  return !!record
}

module.exports = { createAndSendOtp, verifyOtp }
