// IMPORTACION DE MODELOS
const Follow = require('../models/follow');
const User = require('../models/user');

// IMPORTACIÓN DE SERVICES
const FollowService = require('../services/followService');


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
const following = (req, res) => {
    // COMPROBAR SI LLEGO EL PARAMETRO ID EN LA URL
    const id = (req.params.id) ? req.params.id : req.user.id;

    // COMPRAOBAR SI LLEGO LA PAGINA, CASO CONTRARIO PAGINA = 1
    const page = (req.params.page) ? parseInt(req.params.page) : 1;

    // USUARIOS POR PAGINA QUE QUIERO MOSTRAR
    const items_per_page = 3;

    // FIND A FOLLOWS, POPULAR DATOS DE LOS USUARIOS (OBTENER OBJETOS) Y PAGINAR CON MONGOOSE PAGINATE
    Follow.find({user: id})
        .populate('user followed', '-password -role -__v -email')
        .paginate(page, items_per_page, async(error, follows, total) => {
            // SACAR UN ARRAY DE LOS ID's DE LOS USUARIOS QUE ME SIGUEN Y LOS QUE SIGO COMO IDENTITY
            const user_follows = await FollowService.followUserIds(req.user.id);

            return res.status(200).json({
                status: 'success',
                message: 'LISTADO DE USUARIOS QUE SIGO',
                follows,
                total,
                pages: Math.ceil(total / items_per_page),
                user_following: user_follows.following,
                user_follow_me: user_follows.followers
            });
        });
}

// ACCIÓN DE LISTA DE USUARIOS QUE ME SIGUEN
const followers = (req, res) => {
    // COMPROBAR SI LLEGO EL PARAMETRO ID EN LA URL
    const id = (req.params.id) ? req.params.id : req.user.id;

    // COMPRAOBAR SI LLEGO LA PAGINA, CASO CONTRARIO PAGINA = 1
    const page = (req.params.page) ? parseInt(req.params.page) : 1;

    // USUARIOS POR PAGINA QUE QUIERO MOSTRAR
    const items_per_page = 3;

    Follow.find({followed: id})
        .populate('user followed', '-password -role -__v -email')
        .paginate(page, items_per_page, async(error, follows, total) => {
            if (error) return res.status(400).json({status: 'error', message: 'Error al hacer la consulta!'});

            const follows_user = await FollowService.followUserIds(req.user.id);

            return res.status(200).json({
                status: 'success',
                message: 'LISTADO DE USUARIOS QUE ME SIGUEN',
                follows,
                total,
                pages: Math.ceil(total/items_per_page),
                user_following: follows_user.following,
                user_follow_me: follows_user.followers
            });

        });
}

module.exports = {
    follow_test,
    save,
    unfollow,
    following,
    followers
}