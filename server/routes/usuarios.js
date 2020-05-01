const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Usuario = require("../models/usuario")
const app = express()

app.get('/usuarios', function (req, res) {
    res.json("GET Usuarios")
})

app.post('/usuarios', function (req, res) {
    let body = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(body.password, salt);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: hash,
        role: body.role
    })
    usuario.save( (err, usuario_db) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        res.json({
            ok: true,
            usuario: usuario_db
        })
    })
})

app.put('/usuarios/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        title: 'PUT Usuarios',
        id
    })
})

app.delete('/usuarios/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        title: 'DELETE Usuarios',
        id
    })
})

module.exports = app;