const usersModel = require('../models/usersModel')
const fs = require('fs')
// const adminModel = require('../models/adminModel')
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { response, notFoundRes } = require('../helper/common')
const { generateToken, generateRefreshToken } = require('../helper/authHelper')
// const { sendEmail } = require('../helper/emailActivation')

const errorServer = new createError.InternalServerError()

// const getUsers = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1
//     let limit = parseInt(req.query.limit) || 4
//     const offset = (page - 1) * limit

//     const result = await usersModel.select({ limit, offset })

//     const { rows: [count] } = await usersModel.countUser()
//     const totalData = parseInt(count.total)

//     if (totalData < limit) {
//       limit = totalData
//     }

//     if ((result.rows).length === 0) {
//       notFoundRes(res, 404, 'Data not found')
//     }

//     const totalPage = Math.ceil(totalData / limit)
//     const pagination = {
//       currentPage: page,
//       dataPerPage: limit,
//       totalData,
//       totalPage
//     }

//     for (let i = 0; i < totalData; i++) {
//       // console.log(result.rows[i].user_password)
//       delete result.rows[i].user_password
//     }

//     response(res, result.rows, 200, 'Get data success', pagination)
//   } catch (error) {
//     console.log(error)
//     next(errorServer)
//   }
// }

// const getProfileDetail = async (req, res, next) => {
//   // const email = req.params.emailid
//   const decode = req.decoded
//   console.log(decode)
//   const email = req.decoded.email
//   // const { rows: [user] } = await usersModel.findByEmail(email)
//   const { rows: [user] } = await usersModel.usersDetail(email)

//   if (user === undefined) {
//     res.json({
//       message: 'invalid token'
//     })
//     return
//   }

//   delete user.user_password
//   response(res, user, 200, 'Get Data success')
// }

const insertUsers = async (req, res, next) => {
  console.log(req.file.filename)
  const { name, email: emailID, password, phone } = req.body
  let photo = []
  const activationID = 0

  const salt = bcrypt.genSaltSync(10)
  const userPassword = bcrypt.hashSync(password, salt)

  // upload single image
  if (req.file !== undefined) {
    photo = `http://${req.get('host')}/img/${req.file.filename}`
  }

  const data = {
    id: uuidv4(),
    name,
    email: emailID,
    userPassword,
    phone,
    activationID,
    photo
  }

  console.log(data)

  try {
    // Check Email in users table
    const { rows: [count1] } = await usersModel.checkExisting(emailID)
    const result1 = parseInt(count1.total)

    if (result1 !== 0) {
      fs.unlink(`./upload/${req.file.filename}`, function (err) {
        if (err) {
          console.log('error while deleting the file ' + err)
        }
      })
      notFoundRes(res, 403, 'Email has already been taken')
      return
    }

    // sendEmail(emailID)
    console.log(data)
    console.log('data tertangkap regis bisa dilanjutkan')

    await usersModel.insert(data)
    delete data.userPassword
    response(res, data, 201, `${data.name} has been successfully registered`)
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const loginUsers = async (req, res, next) => {
  try {
    const { email, password: userPassword } = req.body
    const { rows: [user] } = await usersModel.findByEmail(email)
    // const user = rows[0]

    if (!user) {
      return response(res, null, 403, 'wrong email or password')
    }

    const validPassword = bcrypt.compareSync(userPassword, user.password)
    if (!validPassword) {
      return response(res, null, 403, 'wrong email or password')
    }

    delete user.password

    console.log(user)

    const payload = {
      email: user.email,
      id: user.id,
      role: 1,
      status: user.status
    }
    // generate token
    user.token = generateToken(payload)
    user.RefreshToken = generateRefreshToken(payload)

    response(res, user, 200, 'Login Successful')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT_2)

  const payload = {
    email: decoded.email,
    id: decoded.id,
    role: 1,
    status: decoded.id_status
  }

  const result = {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload)
  }

  response(res, result, 200, 'Login Successful')

  // return console.log(decoded)
}

const userActivate = async (req, res, next) => {
  try {
    const emailID = req.decoded.email
    console.log(emailID)
    const { firstName, lastName, email, userPassword, phone, gender, birth, userAddress } = req.body
    const activatedAt = new Date()

    const data = {
      firstName,
      lastName,
      email,
      userPassword,
      phone,
      activationStatus: 2,
      gender,
      birth,
      userAddress,
      activatedAt
    }

    console.log(data)

    await usersModel.activateStatus(data, emailID)

    response(res, activatedAt, 200, 'Congrats ! your account has been activated')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}

const updateUsers = async (req, res, next) => {
  // const emailID = req.params.emailid
  // console.log(req.file.filename)
  const files = req.file
  const emailID = req.decoded.email
  const { name, email, password, phone, activationStatus, photo } = req.body
  const updatedAt = new Date()

  const { rows: [userDetail] } = await usersModel.usersDetail(emailID)
  delete userDetail.password
  const previousPhoto = (userDetail.photo).replace('http://localhost:4000/img/', '')

  // console.log(files)
  if (files !== undefined) {
    console.log('Deleting Previous Photo')
    fs.unlink(`./upload/${previousPhoto}`, function (err) {
      if (err) {
        console.log('error while deleting the file ' + err)
      }
    })
  }

  const data = {
    name,
    email,
    password,
    phone,
    activationStatus,
    photo,
    updatedAt
  }

  // upload single image
  if (req.file !== undefined) {
    data.photo = `http://${req.get('host')}/img/${req.file.filename}`
  }

  try {
    const { rows: [count] } = await usersModel.checkExisting(emailID)
    const result = parseInt(count.total)

    if (result === 0) {
      return notFoundRes(res, 404, 'Data not found')
    }

    await usersModel.updateProfile(data, emailID)

    response(res, data, 200, 'User data has just been updated')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const deleteUsers = async (req, res, next) => {
  const emailID = req.params.emailid

  try {
    const { rows: [count] } = await usersModel.checkExisting(emailID)
    const result = parseInt(count.total)

    if (result === 0) {
      notFoundRes(res, 404, 'Data not found, you cannot edit the data which is not exist')
    }

    usersModel.deleteUsers(emailID)
    response(res, emailID, 200, 'User data has just been deleted')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

module.exports = {
  // getUsers,
  insertUsers,
  deleteUsers,
  updateUsers,
  // getProfileDetail,
  loginUsers,
  userActivate,
  refreshToken
}

// terakhir sampai sini
