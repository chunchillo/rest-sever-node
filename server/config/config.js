/*  Puerto */
process.env.PORT = process.env.PORT || 3000;

/*  Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

/*  Base de datos */
let url = process.env.MONGO_URI;
if ( process.env.NODE_ENV === 'local' ) {
    url = 'mongodb://localhost:27017/cafe';
}
process.env.URLDB = url;

/*  Tiempo de Validación 
    Tiempo en segundos = 48 horas */
process.env.EXPIRES_TOKEN = '48h';

/*  Seed **/
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seed-dev';

/*  Google Client Id */
process.env.CLIENT_ID = process.env.CLIENT_ID || '<google-id>.apps.googleusercontent.com';