const { createObject } = require('./postObject.js')
const fetch = require('node-fetch')
const { sanitizeForm } = require('./formValidation.js')

const uploadOrVerifyOrRecognize = async (req) => {
  const [params, method, fileData] = createParamsObject(req)
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
    if (method === 'enroll') return enrollImage(jsonData)
    if (method === 'verify') return verifyImage(jsonData)
    if (method === 'recognize') return recognizeImage(jsonData)
    if (method === 'detect') return detectImage(jsonData)
    if (method === 'v2/media') return sendMedia(jsonData)
    if (method === 'v2/analytics') return analyseMedia(jsonData)
  } catch (err) {
    throw err
  }
}

const analyseMedia = data => {
  return {
    message: 'Media Analysed',
    value: data
  }
}
const sendMedia = data => {
  return {
    message: 'Media Posted',
    value: data
  }
}

const enrollImage = data => {
  return {
    message: 'Face Enrolled',
    value: data
  }
}

const verifyImage = data => {
  return {
    message: 'Face Verified',
    value: data
  }
}

const recognizeImage = data => {
  return {
    message: 'Face Recognized',
    value: data
  }
}

const detectImage = data => {
  return {
    message: 'Face Detected',
    value: data
  }
}

const createParamsObject = req => {
  const params = Object.create(null)
  let [body, file] = sanitizeForm(req)
  if (body.method) {
    params.image = Buffer.from(file.buffer).toString('base64')
  }
  if (body.vidMethod) {
    if (body.vidMethod === 'v2/analytics') {
      params.method = 'GET'
      params.id = body.videoID
    }
  }
  if (body.method === 'enroll' || body.method === 'verify') {
    params.subject_id = body.subjectId
  }
  if (body.method !== 'detect' && body.vidMethod !== 'v2/media' &&
   body.vidMethod !== 'v2/analytics') {
    params.gallery_name = body.galleryName
  }
  if (body.method) return [JSON.stringify(params), body.method, file]
  else return [JSON.stringify(params), body.vidMethod, file]
}

module.exports = {
  uploadOrVerifyOrRecognize
}
