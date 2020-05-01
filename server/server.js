require("./config/config")
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
 
app.get('/', function (req, res) {
    //res.send('Hello World')
    res.json('Rest Server Node')
})

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
 
app.listen(process.env.PORT, () => {
    console.log("Escuchando Puerto:", process.env.PORT);
})