const {appID, appKey} = require('./config.js')
const FormData = require('form-data')
let form = new FormData()

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
    form.append('source', fileData.buffer, {
      filename: fileData.originalname,
      contentType: fileData.mimetype
    })
    this.body = form
    this.headers['Content-Type'] = this.headers['Content-Type'] +
    `; boundary=${this.body._boundary}`
    return this
  }
}

const createObject = params => new PostObject(params)

module.exports = {
  createObject
}
