// IMPORTACION DE DEPENDENCIAS
const bcrypt = require('bcrypt');
const User = require('../models/user');

// DATA DE ERROR
const error_data = (status, msg) => {
    return {
        code: status,
        status: 'error',
        message: msg
    }
}
// ACCION DE PRUEBA
const userTest = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js"
    });
}

// REGISTRO DE USUARIOS
const register = (req, res) => {
    // RECOGER DATOS DE LA PETICIÓN
    let params = req.body;
    let data = {};

    // COMPROBAR QUE LLEGEN BIEN LOS DATOS (+VALIDACIÓN)
    if (!params.name || !params.nick || !params.email || !params.password) {
        data = error_data(404, 'Faltan datos por enviar!')
        return res.status(data.code).json(data)
    }

    // CONTROL DE USUARIOS DUPLICADOS
    User.find({ $or: [
        {email: params.email.toLowerCase()},
        {nick: params.nick.toLowerCase()}
    ]}).exec( async (error, users) => {
        if (error) return res.status(500).json({status: 'error', message: 'Error en la consulta a usuarios'});

        if(users && users.length >= 1) {
            return res.status(200).json({
                status: 'warning',
                message: 'El usuario ya existe!'
            });
        }

        // CIFRADO DE CONTRASEÑA
        params.password = await bcrypt.hash(params.password, 10);

        // CREAR OBJETO USUARIO
        let user = new User(params);

        // GUARDAR USUARIO EN LA BBDD
        user.save((error, user) => {
            if (error || !user) return res.status(500).json({status: 'error', message: 'Error al registrar el usuario'});

             // DEVOLVER EL RESULTADO
            return res.status(200).json({
                status: 'success',
                message: 'Usuario registrado correctamente!',
                user
            });
        });
    });
}

module.exports = {
    userTest,
    register
}