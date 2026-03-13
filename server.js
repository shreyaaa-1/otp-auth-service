const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

const otpRoutes = require("./routes/otpRoutes")

app.use("/api",otpRoutes)

const options = {
 definition:{
  openapi:"3.0.0",
  info:{
   title:"OTP API",
   version:"1.0.0"
  }
 },
 apis:["./routes/*.js"]
}

const specs = swaggerJsdoc(options)

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs))

app.listen(process.env.PORT,()=>{
 console.log("Server running on port",process.env.PORT)
})