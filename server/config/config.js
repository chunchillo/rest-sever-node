/* Puerto */
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

/* Base de datos */
let url = process.env.MONGO_URI;
if ( process.env.NODE_ENV === 'local' ) {
    url = 'mongodb://localhost:27017/cafe';
}
process.env.URLDB = url;