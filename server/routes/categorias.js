const express           = require('express');
const Categoria         = require("../models/categorias");
const { verificaToken
    , verificaRolAdmin } = require("../middlewares/autenticacion");

const app               = express();

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('user_id', 'nombre email')
        .exec((err, categoria) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    error: err.message
                });
            }
            if ( !categoria || !categoria.estado ) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Categoría no encontrada / no habilitada"
                    }
                });
            }
            res.json({
                ok: true,
                categoria
            });
        });
});

app.get(['/categoria', '/categorias', '/categorias/:pagina', '/categorias/:pagina/:limite'], (req, res) => {
    let pagina = req.params.pagina || 0;
    let limite = req.params.limite || 5;
    pagina = Number(pagina)
    limite = Number(limite)
    let paso = pagina * 5;
    Categoria.find({estado: true}, 'nombre descripcion img user_id')
        .skip(paso)
        .limit(limite)
        .populate('user_id', 'nombre email')
        .sort('-nombre')
        .exec( (err, categorias) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    error: err.message
                });
            }
            Categoria.countDocuments({estado: true}, (err, cuantos) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos
                });
            });
        });
});

app.post('/categoria', [verificaToken, verificaRolAdmin], (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        img: body.img,
        user_id: req.usuario._id
    });
    categoria.save( (err, categoria_db) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                error: err.message
            });
        }
        if ( !categoria_db ) {
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        res.json({
            ok: true,
            categoria: categoria_db
        });
    });
});

app.put('/categoria/:id', [verificaToken, verificaRolAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, categoria) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                error: err.message
            });
        }
        if ( !categoria ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Categoría no encontrada"
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaRolAdmin], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, {estado: false}, (err, categoria) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                error: err.message
            });
        }
        if ( !categoria ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoría no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            message: `Categoría ${categoria.nombre} eliminada`
        });
    });
});

module.exports = app;