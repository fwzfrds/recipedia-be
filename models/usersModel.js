const pool = require('../db')
const select = ({ limit, offset }) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const usersDetail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT users.*, activation.activation_name, gender.gender_name FROM users INNER JOIN activation ON users.id_status = activation.id INNER JOIN gender ON users.id_gender = gender.id WHERE users.email = '${email}';`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM users WHERE email = '${email}';`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const insert = ({ id, name, email, userPassword, phone, activationID, photo }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO users(id, name, email, password, phone, status, photo)VALUES($1, $2, $3, $4, $5, $6, $7)', [id, name, email, userPassword, phone, activationID, photo], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const checkExisting = (emailID) => {
  return pool.query(`SELECT COUNT(*) AS total FROM users WHERE email = '${emailID}';`)
}

const activateStatus = ({
  firstName,
  lastName,
  email,
  userPassword,
  phone,
  activationStatus,
  gender,
  birth,
  userAddress,
  activatedAt
}, emailID) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE users SET 
                first_name = COALESCE($1, first_name), 
                last_name = COALESCE($2, last_name), 
                email = COALESCE($3, email),  
                user_password = COALESCE($4, user_password),  
                phone = COALESCE($5, phone),  
                id_status = COALESCE($6, id_status),  
                id_gender = COALESCE($7, id_gender),  
                birth = COALESCE($8, birth),  
                user_address = COALESCE($9, user_address) ,
                activated_at = COALESCE($10, activated_at) 
                WHERE email = $11;`, [firstName, lastName, email, userPassword, phone, activationStatus, gender, birth, userAddress, activatedAt, emailID], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const updateProfile = ({
  firstName,
  lastName,
  email,
  userPassword,
  phone,
  activationStatus,
  gender,
  birth,
  userAddress,
  updatedAt
}, emailID) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE users SET 
                first_name = COALESCE($1, first_name), 
                last_name = COALESCE($2, last_name), 
                email = COALESCE($3, email),  
                user_password = COALESCE($4, user_password),  
                phone = COALESCE($5, phone),  
                id_status = COALESCE($6, id_status),  
                id_gender = COALESCE($7, id_gender),  
                birth = COALESCE($8, birth),  
                user_address = COALESCE($9, user_address) ,
                updated_at = COALESCE($10, updated_at) 
                WHERE email = $11;`, [firstName, lastName, email, userPassword, phone, activationStatus, gender, birth, userAddress, updatedAt, emailID], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const countUser = () => {
  return pool.query('SELECT COUNT(*) AS total FROM users')
}

const deleteUsers = (emailid) => {
  return pool.query('DELETE FROM users WHERE email = $1', [emailid])
}

module.exports = {
  select,
  insert,
  deleteUsers,
  updateProfile,
  countUser,
  checkExisting,
  findByEmail,
  usersDetail,
  activateStatus
}

// perbaiki masalah ini tadinay udah undefined dan teratasi oleh coalesce tapi ini value nya jadi undefined harusnya null
// teakhir sampai sini pokoknya
