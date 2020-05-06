const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

let categoria_schema = mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    }
    , descripcion: {
        type: String,
        required: [true, 'El Descripción es necesaria']
    }
    , img: {
        type: String,
        required: false
    }
    , estado: {
        type: Boolean,
        default: true
    }
    , user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

categoria_schema.plugin(uniqueValidator, { message: 'Debe ser único.' });

module.exports = mongoose.model('Categoria', categoria_schema);