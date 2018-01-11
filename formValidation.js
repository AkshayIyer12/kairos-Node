
const sanitizeEnrollVerify = (body, file) => {
  let err = ''
  if (body && body.subjectId && body.galleryName && (body.method === 'enroll' || body.method === 'verify')) {
    if (file && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {
      return [body, file]
    } else {
      err = 'File not found or filetype not supported'
      throw Error(err)
    }
  } else {
    err = 'Data not entered or Invalid Data entered'
    throw Error(err)
  }
}

const sanitizeForm = req => {
  if (req.body.method === 'enroll' || req.body.method === 'verify') {
    return sanitizeEnrollVerify(req.body, req.files[0])
  } else {
    throw Error('Method not entered')
  }
}

module.exports = {
  sanitizeForm
}
