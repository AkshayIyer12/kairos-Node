const express = require('express')
const path = require('path')
const routes = require('./routes')
const multer = require('multer')()
const { enroll } = require('./helper.js')

let app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.post(routes.enroll, multer.any(), (req, res) => {
  const param = createParamsObject(req)
  enroll(param)
  .then(v => res.json({
    status: 'success',
    data: v
  }))
  .catch(err => res.json({
    status: 'error',
    message: err.message
  }))
})

app.post(routes.verify, multer.any(), (req, res) => {
  const param = createParamsObject(req)
  verify(param)
  .then(v => res.json({
    status: 'success',
    data: v
  }))
  .catch(err => res.json({
    status: 'error',
    message: err.message
  }))
})

const createParamsObject = req => {
  const params = Object.create(null)
  let imageBase64 = Buffer.from(req.files[0].buffer).toString('base64')
  params.image = imageBase64
  params.subject_id = req.body.subjectId
  params.gallery_name = req.body.galleryName
  return JSON.stringify(params)
}

app.listen(3000, () => console.log('Server is running on 3000'))
