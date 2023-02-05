// IMPORTACION DE MODELOS
const Follow = require('../models/follow');
const User = require('../models/user');

// DATA DE ERROR
const error_data = (status, msg) => {
    return {
        code: status,
        status: 'error',
        message: msg
    }
}

// ACCIONES DE PRUEBA
const follow_test = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.js"
    });
}

// ACCIÓN DE SEGUIR (GUARDAR FOLLOW)
const save = (req, res) => {
    // OBTENER DATO DEL BODY
    const params = req.body;

    // OBTENER ID DEL USUARIO IDENTIFICADO
    const identity = req.user;

    // CREAR OBJETO FOLLOW
    let follow = new Follow({
        user: identity.id,
        followed: params.followed
    });

    // GUARDAR OBJETO EN LA BBDD
    follow.save((error, follow) => {
        if (error || !follow) {
            let data = error_data(500, 'Error al seguir al usuario');
            return res.status(data.code).json(data)
        };

        return res.status(200).json({
            status: 'success',
            identity,
            follow
        });
    });
}

// ACCIÓN DEJAR DE SEGUIR (ELIMINAR FOLLOW)
const unfollow = (req, res) => {
    // RECOGER ID USER IDENTITY
    const user_id = req.user.id;

    // RECOGER ID DEL USER A DEJAR DE SEGUIR
    const followed_id = req.params.id;

    // FIND DE LAS COINCIDENCIAS Y HACER UN REMOVE
    Follow.find({
        user: user_id,
        followed: followed_id
    }).remove((error, follows) => {
        if (error || !follows || (follows.deletedCount < 1)) {
            let data = error_data(500, 'Error al dejar de seguir al usuario!');
            return res.status(data.code).json(data);
        }

        return res.status(200).json({
            status: 'success',
            message: 'Follow eliminado Correctamente!',
            identity: req.user,
            follows
        })
    });
}

// ACCIÓN DE LISTA DE USUARIOS QUE ESTOY SIGUIENDO

// ACCIÓN DE LISTA DE USUARIOS QUE ME SIGUEN

module.exports = {
    follow_test,
    save,
    unfollow
}