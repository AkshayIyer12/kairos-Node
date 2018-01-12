const fetch = require('node-fetch')
const { createPostObject } = require('./postObject.js')
const { sanitizeForm } = require('./formValidation.js')
const { methodType } = require('./util.js')

const showResults = async (req) => {
  try {
    let obj = compose(bundleUrl, createObject)(req)
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

const compose = (f, g) => x => f(g(x))

const bundleUrl = ([obj, method]) => {
  let id = ''
  if (method === 'v2/analytics') {
    id = JSON.parse(obj.body)
  }
  return createUrl(obj)(method)(id)
}

const createUrl = obj => method => id => {
  let templateUrl = 'http://api.kairos.com'
  if (id && id.id) {
    obj.url = `${templateUrl}/${method}/${id.id}`
    delete obj.method
    delete obj.headers['Content-Type']
  } else {
    obj.url = `${templateUrl}/${method}`
  }
  return obj
}

const createObject = req => {
  const [params, method, fileData] = sanitizeData(req)
  if (method === undefined) {
    throw Error('Method not selected')
  }
  let obj = createPostObject(params)
  if (method === 'v2/media') {
    obj = obj.setContentType('multipart/form-data')
    obj = obj.setFormData(fileData)
  }
  return [obj, method]
}

const sanitizeData = req => {
  let [body, file, method] = sanitizeForm(req)
  if (methodType[method]) {
    body.image = Buffer.from(file.buffer).toString('base64')
  }
  return [JSON.stringify(body), method, file]
}

module.exports = {
  showResults
}
