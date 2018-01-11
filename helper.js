const { createObject } = require('./postObject.js')
const fetch = require('node-fetch')
const { sanitizeForm } = require('./formValidation.js')

const showResults = async (req) => {
  const [params, method, fileData] = sanitizeData(req)
  if (method === undefined) {
    throw Error('Method not selected')
  }
  let obj = createObject(params)
  if (method === 'v2/media') {
    obj = obj.setContentType('multipart/form-data')
    obj = obj.setFormData(fileData)
  }
  try {
    let templateUrl = 'http://api.kairos.com'
    let id
    if (method === 'v2/analytics') {
      id = JSON.parse(obj.body)
    }
    if (id && id.id) {
      obj.url = `${templateUrl}/${method}/${id.id}`
      delete obj.method
      delete obj.headers['Content-Type']
    } else {
      obj.url = `${templateUrl}/${method}`
    }
    let data = await fetch(obj.url, obj)
    let jsonData = await data.json()
    if (Object.keys(jsonData)[0] === 'Errors') {
      throw Error(jsonData['Errors'][0].Message)
    }
    return jsonData
  } catch (err) {
    throw err
  }
}

const sanitizeData = req => {
  let [body, file, method] = sanitizeForm(req)
  let obj = {
    'enroll': 1,
    'verify': 1,
    'recognize': 1,
    'detect': 1,
    'v2/media': 0,
    'v2/analytics': 0
  }
  if (obj[method]) {
    body.image = Buffer.from(file.buffer).toString('base64')
  }
  return [JSON.stringify(body), method, file]
}

module.exports = {
  showResults
}
