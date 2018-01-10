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

  setContentType (val) {
    this.headers['Content-Type'] = val
    return this
  }

  setFormData (fileData) {
    let formData = {
      source: {
        value: fileData.buffer,
        options: {
          filename: fileData.originalname,
          contentType: fileData.mimetype
        }
      }
    }
    this.formData = formData
    return this
  }
}

const createObject = params => new PostObject(params)

module.exports = {
  createObject
}
