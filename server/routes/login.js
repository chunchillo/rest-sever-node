const express    = require('express')
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const saltRounds = 10;
const Usuario    = require("../models/usuario")
const app        = express()

/* Google Client Id */
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuario) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                error: err.message
            });
        }
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario / Password incorrectos'
                }
            });
        }
        if ( !bcrypt.compareSync(body.password, usuario.password) ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Password / Usuario incorrectos'
                }
            });
        }
        if ( !usuario.estado ) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no esta habilitado'
                }
            });
        }
        let token = jwt.sign({usuario}, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRES_TOKEN});
        res.json({
            ok: true,
            usuario,
            token
        });
    });
});

/* Configuración Google */
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
//verify().catch(console.error);

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let google_user = await verify(token).catch( e => {
        return res.status(403).json({
            ok: false,
            error: {
                message: e
            }
        });
    });
    Usuario.findOne({email: google_user.email}, (err, usuario) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: err.message
                }
            });
        }
        if ( usuario ) {
            if ( !usuario.google ) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "Debe usar autentificación normal"
                    }
                });
            }
            let token = jwt.sign({usuario}, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRES_TOKEN});
            return res.json({
                ok: true,
                usuario,
                token
            });
        } else {
            let usuario = new Usuario();
            usuario.nombre = google_user.name;
            usuario.email = google_user.email;
            usuario.img = google_user.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save( (err, usuario) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        error: {
                            message: err.message
                        }
                    });
                }
                let token = jwt.sign({usuario}, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRES_TOKEN});
                return res.json({
                    ok: true,
                    usuario,
                    token
                });
            });
        }
    });
});

module.exports = app;