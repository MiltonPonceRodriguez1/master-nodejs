// IMPORTACION DE DEPENDENCIAS
const bcrypt = require('bcrypt');
const mongoose_pagination = require('mongoose-pagination');
const path = require('path');
const fs = require('fs');

// IMPORTACION DE SERVICIOS
const FollowService = require('../services/followService');
const validate = require('../helpers/validate');
const jwt = require('../services/jwt');

// IMPORTACION DE MODELOS
const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publication');

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
    // Recoger datos de la petición
    let params = req.body;
    let data = error_data(404, 'Faltan datos por enviar!');;

    // Comprobar que lleguen bien los datos
    if (!params.name || !params.nick || !params.email || !params.password) return res.status(data.code).json(data);

    // Validación avanzada
    try {
        validate(params);
    } catch(error) {
        return res.status(500).json({status: 'error', message: 'Los datos introducidos no son validos!'});
    }

    // Control de usuarios duplicados
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

        // Cifrado de contraseña
        params.password = await bcrypt.hash(params.password, 10);

        // Crear objeto usuario
        let user = new User(params);

        // Guardar usuario en la bbdd
        user.save((error, user) => {
            if (error || !user) return res.status(500).json({status: 'error', message: 'Error al registrar el usuario'});

             // Devolver respuesta
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

const profile = (req, res) => {
    // RECOGER PARAMETRO ID DEL USER
    const id = req.params.id;

    // CONSULTA PARA SACAR LOS DATOS DEL USUARIO
    User.findById(id)
        .select({password: 0, role: 0})
        .exec(async(error, user) => {
            if (error || !user) {
                return res.status(404).json({status: 'error', message: 'El usuario no existe!'});
            }

            // INFORMACIÓN DE SEGUIMIENTO
            const follow_info = await FollowService.followThisUser(req.user.id, id);

            // DEVOLVER EL RESULTADO
            return res.status(200).json({
                status: 'success',
                user,
                following: follow_info.following,
                follower: follow_info.follower
            });
        });
}

const list = (req,res) => {
    // CONTROLAR EN QUE PAGINA ESTAMOS
    let page = (req.params.page) ? parseInt(req.params.page) : 1;
    let data = error_data(404, 'No existen usuarios!');

    // CONSULTA CON MONGOOSE PAGINATE
    let items_per_page = 5;

    User.find()
        .select('-password -email -__v -role')
        .sort('_id')
        .paginate(page, items_per_page, async(error, users, total) => {

            if (error || !users)  return res.status(data.code).json(data);

            const pages = Math.ceil(total/items_per_page);

            if (pages < page) {
                data.message = 'No existen usuarios con ese número de página!';
                return res.status(data.code).json(data);
            }

            // SACAR UN ARRAY DE LOS ID's DE LOS USUARIOS QUE ME SIGUEN Y LOS QUE SIGO COMO IDENTITY
            const user_follows = await FollowService.followUserIds(req.user.id);

            // DEVOLVER RESULTADO (POSTERIORMENTE INFO FOLLOWS)
            return res.status(200).json({
                status: 'success',
                users,
                page,
                total,
                pages,
                user_following: user_follows.following,
                user_follow_me: user_follows.followers
            });
        });
}

const update = (req, res) => {
    // RECOGER INFO DEL USUARIO
    let user_identity = req.user;
    let params = req.body;

    // ELIMINAR CAMPOS SOBRANTES
    delete params.iat;
    delete params.exp;
    delete params.role;
    delete params.image;

    // ERROR DATA
    let data = error_data(500, 'Error en  la consulta de la bbdd!');

    // COMPROBAR SI EL USUARIO YA EXISTE
    User.find({$or: [
        {email: params.email.toLowerCase()},
        {nick: params.nick.toLowerCase()}
    ]}).exec(async (error, users) => {
        if (error) return res.status(data.code).json(data);

        let user_isset = false;

        users.forEach(user => {
            if (user && user._id != user_identity.id) user_isset = true;
        });

        if (user_isset) {
            data.status = 'warning';
            data.message = 'El email o nick proporcionados ya existen!';
            return res.status(data.code).json(data);
        }

        // CIFRAR CONTRASEÑA
        if (params.password) {
            params.password = await bcrypt.hash(params.password, 10);
        } else {
            delete params.password;
        }

        // ********** BUSCAR Y ACUALIZAR CALBACKS **********
        // User.findByIdAndUpdate(user_identity.id, params, {new: true}, (error, user) => {
        //     if (error || !user) {
        //         return res.status(500).json({status: error, message: `Error al Actualizar el usuario ${user_identity.name}`});
        //     }

        //     // DEVOLVER RESPUESTA
        //     return res.status(200).json({
        //         status: 'success',
        //         message: `Metodo de actualizar usuario ${user_identity.name}`,
        //         user
        //     });
        // });

        // ********** BUSCAR Y ACUALIZAR CALBACKS ASYNC AWAIT **********
        try {
            let user = await User.findByIdAndUpdate(user_identity.id, params, {new: true});

            if (!user) {
                return res.status(404).json({status: error, message: `Error al Actualizar el usuario ${user_identity.name}`});
            }

            return res.status(200).json({
                status: 'success',
                message: `Metodo de actualizar usuario ${user_identity.name}`,
                user
            });
        } catch(error) {
            data.message = 'Error al actualizar el usuario!';
            return res.status(data.code).json(data);
        }
    });
}

const upload = (req, res) => {
    data = error_data(404, 'Petición no incluye el avatar!');
    // RECOGER EL FICHERO DE IMAGEN Y COMPROBAR QUE EXISTE
    if (!req.file) {
        return res.status(data.code).json(data);
    }

    // CONSEGUIR EL NOMBRE DEL ARCHIVO
    let avatar = req.file.originalname;

    // SACAR LA EXTENSIÓN DEL ARCHIVO
    const avatar_split = avatar.split('\.');
    const extension = avatar_split[1];

    // COMPROBAR EXTENSIÓN
    if (extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif') {
        // ELIMINAR ARCHIVO SUBIDO
        const file_path = req.file.path;
        fs.unlinkSync(file_path);
        data = error_data(400, 'Extensión del avatar invalida!');
        return res.status(data.code).json(data);
    }

    // SI SI ES CORRECTA, GUARDAR IMAGEN EN LA BBDD
    User.findByIdAndUpdate(req.user.id, {image: req.file.filename}, {new: true})
    .select({password: 0})
    .exec((error, user) => {
        if (error || !user) {
            data = error_data(500, 'Error en la subida del avatar!');
        }

        // DEVOLVER RESPUESTA
        return res.status(200).json({
            status: 'success',
            user,
            file: req.file
        });
    });
}

const avatar = (req, res) => {
    // OBTENER FILE DE LA URL
    const file = req.params.file;

    // MONTAR PATH REAL DE LA IMAGEN
    const file_path = `./uploads/avatars/${file}`;

    // COMPROBAR EXISTENSIA
    fs.stat(file_path, (error, exist) => {
        if (error || !exist) {
            data = error_data(404, 'No existe la imagen!');
            return res.status(data.code).json(data);
        }

        // DEVOLVER EL FILE
        return res.sendFile(path.resolve(file_path));
    });

}

// CONTADOR
const counters = async(req, res) => {
    const user_id = (req.params.id) ? req.params.id : req.user.id;

    try {
        const following = await Follow.count({user: user_id});
        const followed = await Follow.count({followed: user_id});
        const publications = await Publication.count({user: user_id});

        return res.status(200).json({
            status: 'success',
            user_id,
            following,
            followed,
            publications
        });
    } catch(error) {
        return res.status(500).json({status: 'error', message: 'Error en hacer el conteo!'});
    }
}

module.exports = {
    user_test,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar,
    counters
}