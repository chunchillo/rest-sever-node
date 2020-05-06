const express           = require('express');
const Productos         = require("../models/productos");
const { verificaToken
    , verificaRolAdmin } = require("../middlewares/autenticacion");

const app               = express();

app.get('/producto/:id', (req, res) => {
    let id = req.params.id;
    Productos.findById(id)
        .populate('categoria_id', 'nombre')
        .populate('user_id', 'nombre email')
        .exec((err, producto) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    error: err.message
                });
            }
            if ( !producto || !producto.disponible ) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Producto no encontrado / no disponible"
                    }
                });
            }
            res.json({
                ok: true,
                producto
            });
        });
});

app.get(['/producto', '/productos', '/productos/:pagina', '/productos/:pagina/:limite'], (req, res) => {
    let pagina = req.params.pagina || 0;
    let limite = req.params.limite || 5;
    pagina = Number(pagina)
    limite = Number(limite)
    let paso = pagina * 5;
    Productos.find({disponible: true}, 'nombre precioUni descripcion img categoria_id user_id')
        .skip(paso)
        .limit(limite)
        .populate('categoria_id', 'nombre')
        .populate('user_id', 'nombre email')
        .sort('-nombre')
        .exec( (err, productos) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    error: err.message
                });
            }
            Productos.countDocuments({disponible: true}, (err, cuantos) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos
                });
            });
        });
});

app.post('/producto', [verificaToken, verificaRolAdmin], (req, res) => {
    let body = req.body;
    let producto = new Productos({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion || "",
        categoria_id: body.categoria_id,
        user_id: req.usuario._id
    });
    producto.save( (err, producto_db) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                error: err.message
            });
        }
        if ( !producto_db ) {
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        res.json({
            ok: true,
            categoria: producto_db
        });
    });
});

app.put('/producto/:id', [verificaToken, verificaRolAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Productos.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, producto) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                error: err.message
            });
        }
        if ( !producto ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "Producto no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;
    Productos.findByIdAndUpdate(id, {disponible: false}, (err, producto) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                error: err.message
            });
        }
        if ( !producto ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            message: `Producto ${producto.nombre} eliminado`
        });
    });
});

app.get('/buscar/producto/:busqueda', verificaToken, (req, res) => {
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');
    Productos.find({nombre: regex, disponible: true})
        .populate('categoria_id', 'nombre')
        .exec( (err, productos) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    error: err.message
                });
            }
            if ( !productos.length ) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: `No hay productos relacionados con: ${busqueda}`
                    }
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

module.exports = app;