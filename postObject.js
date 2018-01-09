const {appID, appKey} = require('./config.js')

class PostObject {
  constructor (params) {
    this.method = 'POST'
    this.body = params
    this.headers = {
      'Content-Type': 'application/json',
      'app_id': appID,
      'app_key': appKey
    }
  }
}

const createObject = params => new PostObject(params)

module.exports = {
  createObject
}
