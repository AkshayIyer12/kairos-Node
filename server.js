const express = require('express')
const path = require('path')
const routes = require('./routes')
const multer = require('multer')()
let app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.post(routes.upload, multer.any() ,(req, res) => {
  const params = Object.create(null)
  let imageBase64 = Buffer.from(req.files[0].buffer).toString('base64')
  params.image = imageBase64
  params.subject_id = req.body.subjectId
  params.gallery_name = req.body.galleryName
})

app.listen(3000, () => console.log('Server is running on 3000'))
