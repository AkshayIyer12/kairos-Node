const validateFile = file => {
  if (file && (file.mimetype === 'image/jpeg' ||
   file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {
    return file
  }
  if (file && (file.mimetype === 'video/mp4' || file.mimetype === 'video/flv')) {
    return file
  } else {
    throw Error('File not found or filetype not supported')
  }
}

const sanitizeEnrollVerify = (body, file) => {
  let newBody = {}
  if (body && body.subjectId && body.galleryName) {
    let newFile = validateFile(file)
    newBody.subjectId = body.subjectId
    newBody.galleryName = body.galleryName
    newBody.method = body.method
    return [newBody, newFile]
  } else {
    throw Error('Data not entered or Invalid Data entered')
  }
}

const sanitizeRecognize = (body, file) => {
  let newBody = {}
  if (body && body.galleryName) {
    let newFile = validateFile(file)
    newBody.galleryName = body.galleryName
    newBody.method = body.method
    return [newBody, newFile]
  } else {
    throw Error('Data not entered or Invalid Data entered')
  }
}

const sanitizeDetect = (body, file) => {
  let newFile = validateFile(file)
  let newBody = {}
  newBody.method = body.method
  return [newBody, newFile]
}

const sanitizeMediaPost = (body, file) => {
  let newFile = validateFile(file)
  let newBody = {}
  newBody.vidMethod = body.vidMethod
  return [newBody, newFile]
}
const sanitizeAnalytics = (body, file) => {
  let newBody = {}
  newBody.videoID = body.videoID
  newBody.vidMethod = body.vidMethod
  return [newBody, null]
}

const sanitizeForm = req => {
  if (req.body.method === 'enroll' || req.body.method === 'verify') {
    return sanitizeEnrollVerify(req.body, req.files[0])
  }
  if (req.body.method === 'recognize') {
    return sanitizeRecognize(req.body, req.files[0])
  }
  if (req.body.method === 'detect') {
    return sanitizeDetect(req.body, req.files[0])
  }
  if (req.body.vidMethod === 'v2/media') {
    return sanitizeMediaPost(req.body, req.files[0])
  }
  if (req.body.vidMethod === 'v2/analytics') {
    return sanitizeAnalytics(req.body, req.files[0])
  } else {
    throw Error('Method not entered')
  }
}

module.exports = {
  sanitizeForm
}
