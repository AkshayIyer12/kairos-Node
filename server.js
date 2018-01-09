const express = require('express')
const path = require('path')
const routes = require('./routes')
const multer = require('multer')()
const { uploadOrVerify, createParamsObject } = require('./helper.js')

let app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.post(routes.upload, multer.any(), (req, res) => {
  const [param, method] = createParamsObject(req)
  uploadOrVerify(param, method)
  .then(data => res.json({
    status: 'success',
    data: data
  }))
  .catch(err => res.json({
    status: 'error',
    message: err.message
  }))
})

app.listen(3000, () => console.log('Server is running on 3000'))
