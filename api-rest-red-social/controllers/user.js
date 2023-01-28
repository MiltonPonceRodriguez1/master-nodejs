// IMPORTACION DE DEPENDENCIAS
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('../services/jwt');

// DATA DE ERROR
const error_data = (status, msg) => {
    return {
        code: status,
        status: 'error',
        message: msg
    }
}
// ACCION DE PRUEBA
const user_test = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js",
        user: req.user
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

const login = (req, res) => {
    // RECOGER PARAMS BODY
    let params = req.body;
    let data = error_data(500, 'Faltan datos');

    if (!params.email || !params.password) {
        return res.status(data.code).json(data);
    }

    // BUSCAR EN LA BBDD SI EXISTE
    User.findOne({email: params.email})
        // .select({password: 0})
        .exec((error, user) => {
            if (error || !user) {
                data.message = 'No existe el usuario';
                return res.status(data.code).json(data);
            }

            // COMPROBAR SU CONTRASEÑA
            const pwd = bcrypt.compareSync(params.password, user.password);

            if(!pwd) {
                data.message = 'No te has identificado correctamente!';
                return res.status(data.code).json(data);
            }

            // OBTENER TOKEN
            const token = jwt.create_token(user);

            // DEVOLVER DATOS DE USUARIO

            return res.status(200).json({
                status: 'success',
                message: 'Te has identificado correctamente!',
                user: {
                    id: user._id,
                    name: user.name,
                    surname: user.surname,
                    nick: user.nick
                },
                token
            });
        });
}

module.exports = {
    user_test,
    register,
    login
}