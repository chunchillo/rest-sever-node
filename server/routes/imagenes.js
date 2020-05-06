const express = require('express');
const fs      = require('fs');
const path    = require("path");
const app     = express();
const { verificaTokenImagen } = require("../middlewares/autenticacion");

app.get('/imagen/:tipo/:img', verificaTokenImagen, (req, res) => {
    let tipos = ['categorias', 'usuarios', 'productos'];
    let tipo = req.params.tipo;
    let img = req.params.img || "";
    if ( tipos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Identificador Tipo no valida: ${tipo}.`
            }
        });
    }
    let imagenUrl = path.resolve(`./uploads/${tipo}/${img}`);
    if ( fs.existsSync(imagenUrl) ) {
        res.sendFile(imagenUrl);
    } else {
        res.sendFile(path.resolve('./server/assets/no-image.jpg'));
    }
});

module.exports = app;