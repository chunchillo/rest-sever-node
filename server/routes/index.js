const express    = require('express')
const app        = express()

const usuarios = require('./usuarios')
const login = require('./login')

app.use(usuarios, login)

module.exports = app;