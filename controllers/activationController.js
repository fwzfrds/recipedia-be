const activationModel = require('../models/activationModel')

const createError = require('http-errors')
const { response } = require('../helper/common')
const errorServer = new createError.InternalServerError()

const insertActivation = async (req, res, next) => {
  const { name } = req.body

  const data = {
    name
  }

  try {
    await activationModel.insert(data)

    response(res, data, 201, 'Insert activation name success')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

module.exports = {
  insertActivation
}
