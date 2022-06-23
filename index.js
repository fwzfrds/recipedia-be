require('dotenv').config()

const express = require('express')
const app = express()

const cors = require('cors')
const createError = require('http-errors')
const morgan = require('morgan')
const helmet = require('helmet')
const xss = require('xss-clean')
const path = require('path')

const mainRoute = require('./routes')
// const midCors = require('./middlewares/cors')

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))
app.use(helmet({
  crossOriginResourcePolicy: false
}))
app.use(xss())

app.use('/v1', mainRoute)

app.use('/img', express.static(path.join(__dirname, '/upload')))
app.use('/video', express.static(path.join(__dirname, '/upload')))
app.all('*', (req, res, next) => {
  // Cara 1 : bawaan package
  next(new createError.NotFound())

  // Cara 2 : Custom status & message
  // res.status(404).json({
  //     status: 404,
  //     message: 'url not found'
  // })
})

app.use((err, req, res, next) => {
  let errorMessage = err.message || 'internal server error'
  const statusCode = err.status || 500

  if (errorMessage === 'File too large') {
    errorMessage = 'File must be under 2mb'
  }

  if (errorMessage === 'Unexpected field') {
    errorMessage = 'The number of files you entered is over the limit'
  }

  res.status(statusCode).json({
    status: statusCode,
    message: errorMessage
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
