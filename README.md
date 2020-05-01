## Basic Rest Server Node

Primeros pasos con Rest Server
App Heroku: https://restserver-blockpc.herokuapp.com/

- Procedimientos varios
  - Iniciamos express, primeras rutas
    - Creamos carpeta config + config.js, gestiona variables globales
  - Conectamos a DB, usando mongodb
  - Configuramos rutas
    - Creamos carpeta router + usuarios.js, gestiona rutas a usuarios
  - Creamos modelo Usuario
    - Nueva carpeta models + usuario.js, gestiona el schema usuario
    - Creación de Usuario
    - Validaciones personalizada para email y role

- Instalaciones modulos (por orden)
  - express, body-parser
  - mongoose, mongoose-unique-validator