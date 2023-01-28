// IMPORTACION DE DEPENDENCIAS
const jwt = require('jwt-simple');
const moment = require('moment');

// CLAVE SECRETA
const secret = 'CLAVE_SUPER_seCreTa_Del_ProYECT0_DE_Red_s0C1Al_D0kkEn_749625813';

// FUNCION PARA GENERAR TOKENS
const create_token = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    // DEVOLVER JWT TOKEN CODIFICADO
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    create_token
}

