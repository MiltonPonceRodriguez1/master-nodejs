// IMPORTACION DE MODULOS
const jwt = require('jwt-simple');
const moment = require('moment');

// IMPORTACION CLAVE SECRETA
const JwtService = require('../services/jwt');
const secret = JwtService.secret;

// MIDDLEWARE DE AUTENTICACION
const verify = (req, res, next) => {
    // COMPROBAR CABECERA DE AUTENTICACIÓN
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: 'error',
            message: 'La petición no tiene la cabecera de autenticación!'
        });
    }

    // LIMPIAR EL TOKEN
    let token = req.headers.authorization.replace(/['"]+/g,'');

    // DECODIFICAR TOKEN
    try {
        let payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error',
                message: 'Token expirado'
            });
        }

        // AGREGAR DATOS DE USUARIO A LA REQUEST
        req.user = payload;

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'Token invalido',
            error
        });
    }

    // PASAR A EJECUCIÓN DE ACCIÓN
    next();
}

module.exports = {
    verify
}

