const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // ssl untuk di local
  // ssl: false

  // ssl untuk mengatasi error di heroku
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool
