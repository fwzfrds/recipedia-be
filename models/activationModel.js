const pool = require('../db')

const insert = ({ name }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO activation(activation_name)VALUES($1)', [name], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

module.exports = {
  insert
}
