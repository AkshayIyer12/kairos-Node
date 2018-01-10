const { createObject } = require('./postObject.js')
const fetch = require('node-fetch')
const uploadOrVerifyOrRecognize = async (params, method, fileData) => {
  let obj = createObject(params)
  if (method === 'v2/media') {
    obj = obj.setContentType('multipart/form-data')
    obj = obj.setFormData(fileData)
    obj.url = `http://api.kairos.com/${method}`
  }
  try {
    let url = ''
    url = `http://api.kairos.com/${method}`
    let dat = await fetch(obj.url, obj)
    let data = await dat.json()
    if (method === 'enroll') return enrollImage(data)
    if (method === 'verify') return verifyImage(data)
    if (method === 'recognize') return recognizeImage(data)
    if (method === 'detect') return detectImage(data)
    console.log(data)
  } catch (err) {
    throw err
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
    }
    delete params.gallery_name
  }
  if (req.body.method === 'enroll' || req.body.method === 'verify') {
    params.subject_id = req.body.subjectId
  }
  if (req.body.method !== 'detect' && req.body.vidMethod !== 'v2/media') {
    params.gallery_name = req.body.galleryName
  }
  if (req.body.method) return [JSON.stringify(params), req.body.method, req.files[0]]
  else return [JSON.stringify(params), req.body.vidMethod, req.files[0]]
}

module.exports = {
  uploadOrVerifyOrRecognize,
  createParamsObject
}
