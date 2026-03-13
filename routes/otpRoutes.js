const express = require("express")
const router = express.Router()
const otpController = require("../controllers/otpController")

/**
 * @swagger
 * /api/send-otp:
 *   post:
 *     summary: Send OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/send-otp", otpController.sendOtp)
/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post("/verify-otp", otpController.verifyOtp)

module.exports = router 