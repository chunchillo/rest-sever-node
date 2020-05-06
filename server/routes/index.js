const express    = require('express')
const app        = express()

const imagenes = require('./imagenes')
const categorias = require('./categorias')
const productos = require('./productos')
const usuarios = require('./usuarios')
const uploads = require('./uploads')
const login = require('./login')

app.use(usuarios, login, categorias, productos, uploads, imagenes)

module.exports = app;