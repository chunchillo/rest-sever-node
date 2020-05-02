/* Puerto */
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* Base de datos */
let url = 'mongodb+srv://blockpc:GboGM3qqsjRzYoyj@cluster0-zinja.mongodb.net/cafe';
if ( process.env.NODE_ENV === 'dev' ) {
    url = 'mongodb://localhost:27017/cafe';
}
process.env.URLDB = url;