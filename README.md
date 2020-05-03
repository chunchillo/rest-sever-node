## Basic Rest Server Node

Primeros pasos con Rest Server (Mayo 2020)

### Procedimientos varios
  - Iniciamos express, primeras rutas
    - Creamos carpeta config + config.js, gestiona variables globales
  - Conectamos a DB, usando mongodb
  - Configuramos rutas
    - Creamos carpeta router + usuarios.js, gestiona rutas a usuarios
  - Creamos modelo Usuario
    - Nueva carpeta models + usuario.js, gestiona el schema usuario
    - POST - Creación de Usuario
    - Validaciones personalizada para email y role
    - bcrypt, encriptando la contraseña
    - PUT - Actualizar información del usuario, instalamos underscore
    - GET - Obtener todos los usuarios, total de registros y paginación
    - DELETE - Borrando un usuario
  - Conexion a MLab con cuenta de mongodb usando mongoCompass
    - Actualización de paquetes de node ```npm update``` debido a cambios en bcrypt / mongoose
    - Creacion de variables de entorno para conexión a BD
  - Autentificación por token - JWT
    - Creamos archivo de rutas login.js
    - Generamos token JWT en el login
    - Protección de token mediante middlewares
    - Verificar Token y verificación de rol administrador via middlewares

### Instalaciones modulos (por orden)
  - express, body-parser
  - mongoose, mongoose-unique-validator
  - bcrypt
  - underscore
  - jsonwebtoken