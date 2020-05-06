const express    = require('express');
const fileUpload = require('express-fileupload');
const app        = express();

const Usuario = require("../models/usuario");
const Producto = require("../models/productos");
const Categoria = require("../models/categorias");

const { verificaToken
    , verificaRolAdmin } = require("../middlewares/autenticacion")

// default options
app.use(fileUpload({
    createParentPath: true
}));
//app.use( fileUpload({ useTempFiles: true }) );

/* Borrar Archivos */
const fs = require("fs");
const path = require("path");

app.delete('/delete/:tipo/:id', [verificaToken, verificaRolAdmin], (req, res) => {
    let tipos = ['categorias', 'usuarios', 'productos'];
    let tipo = req.params.tipo;
    let id = req.params.id;

    if ( tipos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Identificador Tipo no valida: ${tipo}.`
            }
        });
    }
    if ( tipo == "usuarios" ) {
        borrar_imagen(id, res, Usuario, "Usuario", tipo);
    }
    if ( tipo == "categorias" ) {
        borrar_imagen(id, res, Categoria, "Categoria", tipo);
    }
    if ( tipo == "productos" ) {
        borrar_imagen(id, res, Producto, "Producto", tipo);
    }
});
/* FIN Borrar Archivos */

/* Subir imagen */
app.put(['/upload', [verificaToken, verificaRolAdmin], '/upload/:tipo/:id'], (req, res) => {
    let tipos = ['categorias', 'usuarios', 'productos'];
    let tipo = req.params.tipo;
    let id = req.params.id;

    if ( tipos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Identificador Tipo no valida: ${tipo}.`
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Ningun archvo fue seleccionado.'
            }
        });
    }
  
    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let filename = archivo.name.split('.');
    let extension = filename[filename.length - 1];

    // Extensiones Validas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];
    if ( extensiones.indexOf( extension ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Extensión no valida: ${extension}.`
            }
        });
    }

    // Cambiar Nombre Archivo
    let nombre_seguro = `${id}.${extension}`;

    if ( tipo == "usuarios" ) {
        subir_imagen(id, res, nombre_seguro, archivo, Usuario, tipo, "Usuario");
    }
    if ( tipo == "categorias" ) {
        subir_imagen(id, res, nombre_seguro, archivo, Categoria, tipo, "Categoria");
    }
    if ( tipo == "productos" ) {
        subir_imagen(id, res, nombre_seguro, archivo, Producto, tipo, "Producto");
    }
    
});

function subir_imagen(id, res, nombre_seguro, archivo, clase, tipo, variable) {
    clase.findById(id, (err, instancia) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: `${variable} no encontrado`
                }
            });
        }
        if ( !instancia ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `${variable} no encontrado`
                }
            });
        }
        instancia.img = nombre_seguro;
        instancia.save( (err, instancia) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            archivo.mv( `uploads/${tipo}/${nombre_seguro}`, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
            });
            res.json({
                ok:true,
                message: `Archivo ${archivo.name} Subido correctamente.`
            });
        });
    });
}

function borrar_imagen(id, res, clase, variable, tipo) {
    clase.findById(id, (err, instancia) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: `${variable} no encontrado`
                }
            });
        }
        if ( !instancia ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `${variable} no encontrado`
                }
            });
        }
        let imagen = instancia.img;
        instancia.img = "";
        instancia.save( (err, instancia) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            let imagenUrl = path.resolve(`uploads/${tipo}/${imagen}`);
            if ( fs.existsSync(imagenUrl) ) {
                fs.unlinkSync(imagenUrl);
            }
            res.json({
                ok:true,
                message: `Imagen ${imagen} eliminada correctamente.`
            });
        });
    });
}

module.exports = app;