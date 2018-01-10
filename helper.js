const { createObject } = require('./postObject.js')
const fetch = require('node-fetch')

const uploadOrVerifyOrRecognize = async (params, method, fileData) => {
  let obj = createObject(params)
  if (method === 'v2/media') {
    obj = obj.setContentType('multipart/form-data')
    obj = obj.setFormData(fileData)
  }
  try {
    let templateUrl = 'http://api.kairos.com'
    let id = JSON.parse(obj.body)
    if (id.id) {
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
  if (req.body.method) {
    params.image = Buffer.from(req.files[0].buffer).toString('base64')
  }
  if (req.body.vidMethod) {
    if (req.body.vidMethod === 'v2/analytics') {
      params.method = 'GET'
      params.id = req.body.videoID
    }
    delete params.gallery_name
  }
  if (req.body.method === 'enroll' || req.body.method === 'verify') {
    params.subject_id = req.body.subjectId
  }
  if (req.body.method !== 'detect' && req.body.vidMethod !== 'v2/media' && req.body.vidMethod !== 'v2/analytics') {
    params.gallery_name = req.body.galleryName
  }
  if (req.body.method) return [JSON.stringify(params), req.body.method, req.files[0]]
  else return [JSON.stringify(params), req.body.vidMethod, req.files[0]]
}

module.exports = {
  uploadOrVerifyOrRecognize,
  createParamsObject
}
