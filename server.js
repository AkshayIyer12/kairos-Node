const express = require('express')
const path = require('path')
let app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.listen(3000, () => console.log('Server is running on 3000'))
