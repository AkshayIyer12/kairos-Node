const fetch = require('node-fetch')
const { createObject } = require('./postObject.js')

const uploadOrVerify = async (params, method) => {
 let data = await (await fetch(`http://api.kairos.com/${method}`, createObject(params))).json()
 if (data.images[0].transaction.confidence < 0.6) {
   throw new Error('Failed to verify the person')
 }
 if (data.images[0].transaction.confidence > 0.6){
   return { message: 'Succeeded to verify the person'}
 } else {
   throw new Error('API or network error')
 }
}

module.exports = {
  uploadOrVerify
}
