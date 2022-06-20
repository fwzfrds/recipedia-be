const response = (res, result, status, message, pagination) => {
  const resultPrint = {}
  resultPrint.status = 'success'
  resultPrint.message = message || null
  resultPrint.statusCode = status
  if (pagination) resultPrint.pagination = pagination
  resultPrint.data = result
  res.status(status).json(resultPrint)
}

const notFoundRes = (res, status, message) => {
  const resultPrint = {}
  resultPrint.status = 'Not Found'
  resultPrint.message = message || null
  resultPrint.statusCode = status
  if (status === 403) {
    resultPrint.status = 'Access Denied'
  }
  res.status(status).json(resultPrint)
}

module.exports = {
  response,
  notFoundRes
}
