const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var producto_schema = mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario'] 
    }
    , precioUni: { 
        type: Number, 
        required: [true, 'El precio unitario es necesario'] 
    }
    , descripcion: { 
        type: String, 
        default: "" 
    }
    , img: {
        type: String,
        default: ""
    }
    , disponible: { 
        type: Boolean,
        default: true 
    }
    , categoria_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categoria', 
        required: true 
    }
    , user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    }
});

producto_schema.plugin(uniqueValidator, { message: 'Debe ser único.' });

module.exports = mongoose.model('Productos', producto_schema);