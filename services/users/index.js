var os = require("os")
const express = require('express')
const app = express()
const port = process.env.PORT

app.get('/profile', (req, res) => {
  res.send({
    id: 101,
    name: 'John Doe',
    birthday: '1985-07-15',
    email: 'johndoe@email.com'
  })
})

app.get('/healthcheck', (req, res) => {
  res.send({
    status: 'ok'
  })
})

app.get('/info', (req, res) => {
  res.send({
    hostname: os.hostname()
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})