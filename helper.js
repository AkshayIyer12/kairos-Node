const fetch = require('node-fetch')
const { createObject } = require('./postObject.js')

const enroll = async (params) => {
  try {
    return await (await fetch('http://api.kairos.com/enroll', createObject(params))).json()
  } catch (err) {
    throw new Error(err.status, err.message)
  }
}

const verify = async (params) => {
  try {
    return await (await fetch('http://api.kairos.com/verify', createObject(params))).json()
  } catch (err) {
    throw new Error(err.status, err.message)
  }
}

module.exports = {
  enroll,
  verify
}
