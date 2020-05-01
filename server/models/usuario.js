const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuario_schema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    }
    , email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    }
    , password: {
        type: String,
        required: [true, 'El password es necesario']
    }
    , img: {
        type: String,
        required: false
    }
    , role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    }
    , estado: {
        type: Boolean,
        default: true
    }
    , google: {
        type: Boolean,
        default: false
    }
});

usuario_schema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuario_schema.plugin(uniqueValidator, { message: 'Debe ser único.' });

module.exports = mongoose.model('Usuario', usuario_schema)