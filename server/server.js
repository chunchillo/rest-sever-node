require("./config/config")
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const usuarios = require('./routes/usuarios')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(usuarios)
 
app.get('/', function (req, res) {
    //res.send('Hello World')
    res.json('Rest Server Node')
})

mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('base de datos ONLINE'))
.catch(err => console.log('No se pudo conectar', err));
 
app.listen(process.env.PORT, () => {
    console.log("Escuchando Puerto:", process.env.PORT);
})