const express = require("express")
const router = express.Router()
const User = require("../models/userModel")
const authMiddleware = require("../middleware/authMiddleware")

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */

router.get("/profile", authMiddleware, async (req,res)=>{

  const phone = req.user.phone

  const user = await User.findOne({ phone })

  res.json(user)

})

module.exports = router