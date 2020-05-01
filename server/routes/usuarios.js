const express = require('express')
const app = express()

app.get('/usuarios', function (req, res) {
    res.json("GET Usuarios")
})

app.post('/usuarios', function (req, res) {
    let body = req.body;
    if ( body.nombre === undefined ) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es requerido"
        });
    } else {
        res.json({
            title: 'POST Usuarios',
            data: body
        })
    }
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