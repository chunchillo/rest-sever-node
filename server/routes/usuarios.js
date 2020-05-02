const express    = require('express')
const bcrypt     = require('bcrypt');
const _          = require("underscore");
const saltRounds = 10;
const Usuario    = require("../models/usuario")
const app        = express()

app.get(['/usuarios', '/usuarios/:pagina', '/usuarios/:pagina/:limite'], function (req, res) {
    let pagina = req.params.pagina || 0;
    let limite = req.params.limite || 5;
    pagina = Number(pagina)
    limite = Number(limite)
    let paso = pagina * 5;
    Usuario.find({}, 'nombre email img')
        .skip(paso)
        .limit(limite)
        .exec( (err, usuarios) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        Usuario.countDocuments({}, (err, cuantos) => {
            res.json({
                ok: true,
                usuarios,
                cuantos
            })
        })
    })
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
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, usuario_db) => {
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

app.delete('/usuarios/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        title: 'DELETE Usuarios',
        id
    })
})

module.exports = app;