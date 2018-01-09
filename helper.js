const fetch = require('node-fetch')
const { createObject } = require('./postObject.js')

const uploadOrVerifyOrRecognize = async (params, method) => {
  try {
    let data = await fetch(`http://api.kairos.com/${method}`, createObject(params))
    let jsonData = await data.json()
    if (method === 'enroll') return enrollImage(jsonData)
    if (method === 'verify') return verifyImage(jsonData)
    if (method === 'recognize') return recognizeImage(jsonData)
    if (method === 'detect') return detectImage(jsonData)
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
  let imageBase64 = Buffer.from(req.files[0].buffer).toString('base64')
  params.image = imageBase64
  if (req.body.method === 'enroll' || req.body.method === 'verify') {
    params.subject_id = req.body.subjectId
  }
  if (req.body.method !== 'detect') {
    params.gallery_name = req.body.galleryName
  }
  return [JSON.stringify(params), req.body.method]
}

module.exports = {
  uploadOrVerifyOrRecognize,
  createParamsObject
}
