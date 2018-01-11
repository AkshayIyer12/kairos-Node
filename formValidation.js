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
    newBody.subject_id = body.subjectId
    newBody.gallery_name = body.galleryName
    return [newBody, newFile, body.method]
  } else {
    throw Error('Data not entered or Invalid Data entered')
  }
}

const sanitizeRecognize = (body, file) => {
  let newBody = {}
  if (body && body.galleryName) {
    let newFile = validateFile(file)
    newBody.gallery_name = body.galleryName
    return [newBody, newFile, body.method]
  } else {
    throw Error('Data not entered or Invalid Data entered')
  }
}

const sanitizeDetect = (body, file) => {
  let newFile = validateFile(file)
  let newBody = {}
  return [newBody, newFile, body.method]
}

const sanitizeMediaPost = (body, file) => {
  let newFile = validateFile(file)
  let newBody = {}
  return [newBody, newFile, body.vidMethod]
}
const sanitizeAnalytics = (body, file) => {
  let newBody = {}
  newBody.id = body.videoID
  newBody.method = 'GET'
  return [newBody, null, body.vidMethod]
}

const sanitizeForm = req => {
  if (req.body.method && req.body.vidMethod) {
    throw Error('Both methods selected. Reload the page!')
  }
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
