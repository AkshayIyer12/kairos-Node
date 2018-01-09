const fetch = require('node-fetch')
const { createObject } = require('./postObject.js')

const uploadOrVerify = async (params, method) => {
  let data = await (await fetch(`http://api.kairos.com/${method}`, createObject(params))).json()
  if ((data.images && data.images[0].transaction.confidence < 0.6) || data.Errors[0]) {
   throw new Error('Failed to verify the person')
 }
 if (data.images && data.images[0].transaction.confidence > 0.6){
   return { message: 'Succeeded to verify the person'}
 } else {
   throw new Error('API or network error')
 }
}

const createParamsObject = req => {
  const params = Object.create(null)
  let imageBase64 = Buffer.from(req.files[0].buffer).toString('base64')
  params.image = imageBase64
  params.subject_id = req.body.subjectId
  params.gallery_name = req.body.galleryName
  return [JSON.stringify(params), req.body.method]
}

module.exports = {
  uploadOrVerify,
  createParamsObject
}
