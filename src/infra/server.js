require('dotenv').config()

const express = require('express')
const fileUpload = require('express-fileupload');

const routes = require('./routes')

const app = express()

app.use(express.json())

app.use('/health', (request, response) => {
  return response.json({ msg: true })
})
app.use(routes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running ${process.env.PORT}`)
})
