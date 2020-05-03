const jwt        = require('jsonwebtoken');

/* Verificar token valido */
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if ( err ) {
            return res.status(401).json({
                ok: false,
                message: "Error Token: Token no valido"
            })
        }
        req.usuario = decoded.usuario;
        next()
    })
}

/* Verificar Rol Administrador */
let verificaRolAdmin = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if ( err ) {
            return res.status(401).json({
                ok: false,
                message: "Error Rol: Token no valido"
            })
        }
        if ( decoded.usuario.role !== "ADMIN_ROLE" ) {
            return res.status(401).json({
                ok: false,
                message: "Error: No estas autorizado para realizar esta petición"
            })
        }
        next()
    })
}

module.exports = { verificaToken, verificaRolAdmin }