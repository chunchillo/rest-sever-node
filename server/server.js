require("./config/config")
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// Rutas
const routes = require("./routes/index");
app.use(routes)

// Mostrando un index
const path  = require('path');
const VISTAS = path.resolve(__dirname, '../public/views');
const RAIZ = path.resolve(__dirname, '../public');
 
app.get('/', function (req, res) {
    res.sendFile('index.html', {root: RAIZ});
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB)
.then(()=> console.log('base de datos ONLINE'))
.catch(err => console.log('No se pudo conectar', err));
 
app.listen(process.env.PORT, () => {
    console.log("Escuchando Puerto:", process.env.PORT);
})