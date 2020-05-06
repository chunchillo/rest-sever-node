const express    = require('express')
const app        = express()

const categorias = require('./categorias')
const productos = require('./productos')
const usuarios = require('./usuarios')
const login = require('./login')

app.use(usuarios, login, categorias, productos)

module.exports = app;