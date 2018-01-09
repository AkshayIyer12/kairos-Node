const express = require('express')
const path = require('path')
const routes = require('./routes')
const multer = require('multer')()
const fetch = require('node-fetch')
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
  let param = JSON.stringify(params)
  enroll(param)
    .then(v => res.json({
      status: 'success',
      data: 'Image was successfully enrolled'
    }))
    .catch(err => res.json({
      status: 'error',
      message: err.message
    }))
})

const enroll = async (params) => {
  let obj = {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/json',
      'app_id': 'b9b14222',
      'app_key': 'f86e1f973b0ea157ec2616b192693d15'
    }
  }
  try {
    let fetchedData = await fetch('http://api.kairos.com/enroll', obj)
    let data = await fetchedData.json()
    return data
  } catch (err) {
    throw new Error(err.status, err.message)
  }
}

app.listen(3000, () => console.log('Server is running on 3000'))
