const validateFile = file => {
  if (file && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {
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

const sanitizeForm = req => {
  if (req.body.method === 'enroll' || req.body.method === 'verify') {
    return sanitizeEnrollVerify(req.body, req.files[0])
  }
  if (req.body.method === 'recognize') {
    return sanitizeRecognize(req.body, req.files[0])
  } else {
    throw Error('Method not entered')
  }
}

module.exports = {
  sanitizeForm
}
