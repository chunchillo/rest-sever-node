const express    = require('express')
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const saltRounds = 10;
const Usuario    = require("../models/usuario")
const app        = express()

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuario) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario / Password incorrectos'
                }
            });
        }
        if ( !bcrypt.compareSync(body.password, usuario.password) ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Password / Usuario incorrectos'
                }
            });
        }
        if ( !usuario.estado ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no esta habilitado'
                }
            });
        }
        let token = jwt.sign({usuario}, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRES_TOKEN});
        res.json({
            ok: true,
            usuario,
            token
        });
    });
    
});

module.exports = app;