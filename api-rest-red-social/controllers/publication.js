// IMPORTACIÓN DE DEPENDENCIAS
const path = require('path');
const fs = require('fs');

// IMPORTACIÓN DE MODELOS
const Publication = require('../models/publication');

// IMPORTACIÓN DE SERVICES
const FollowService = require('../services/followService');

// ACCIONES DE PRUEBA
const publicationTest = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/publication.js"
    });
}

// GUARDAR PUBLICACIÓN
const save = (req, res) => {
    // RECOGER DATOS DEL BODY
    const params = req.body;

    // SI NO ME LLEGAN DAR RESPUESTA NEGATIVA
    // console.log(params);
    // if (!params.text) return res.status(400).json({status: 'error', message: 'Falta enviar Datos!'});

    // INSTANCIAR OBJETO PUBLICATION
    let publication = new Publication(params);
    publication.user = req.user.id;

    // GUARDAR OBJETO EN LA BBDD
    publication.save((error, publication) => {
        if (error || !publication) return res.status(400).json({status: 'error', message: 'Error al guardar la publicación!'});

        // DEVOLVER RESPUESTA
        return res.status(200).json({
            status: 'success',
            message: 'Publicación guardada correctamente!',
            publication
        });
    });

}

// OBTENER UNA PUBLICACIÓN
const detail = (req, res) => {
    // Obtener id de la publicion
    const id = req.params.id;

    // Find con la condicion del id
    Publication.findById(id, (error, publication)=> {
        if (error || !publication) return res.status(404).json({status: 'error', message: 'La publicación NO existe!'});

        // Devolver respuesta
        return res.status(200).json({
            status: 'success',
            message: 'Detalles de la publicación',
            publication
        });
    });
}

// ELMINIAR PUBLICACIONES
const remove = (req, res) => {
    // Obtener id de la publicación
    const id = req.params.id;

    // Find y remove de la publicacion
    Publication.findByIdAndDelete(id, (error, publication) => {
        if (error || !publication) return res.status(500).json({status: 'error', message: 'Error al eliminar la publicación!'});

        // Devolver respuesta
        return res.status(200).json({
            status: 'suceess',
            message: 'Publicación eliminada correctamente!',
            publication
        });
    });
}

// LISTAR PUBLICACIONES DE UN USUARIO
const user = (req, res) => {
    // Recoger el id del usuario
    const id = req.params.id;

    // Controlar la pagina
    const page = req.params.page ? parseInt(req.params.page) : 1;

    const items_per_page = 5;

    // Find, populate, order by, pagintate
    Publication.find({user: id})
        .sort('-created_at')
        .populate('user', '-password -role -__v -email')
        .paginate(page, items_per_page, (error, publications, total) => {
            if (error || !publications || publications.length <= 0) return res.status(404).json({status: 'error', message: 'No existen publicaciones!'});

            // Devolver respuesta
            return res.status(200).json({
                status: 'success',
                message: 'Publicaciones del perfil de un usuario',
                page,
                total,
                pages: Math.ceil(total/items_per_page),
                publications
            })
        });
}

// SUBIR FICHEROS
const upload = (req, res) => {
    // Recoger id de la publicación
    const id = req.params.id;

    // Comprobar que el archivo existe
    if (!req.file) return res.status(400).json({status: 'error', message: 'Faltan Datos!'});

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const image_split = image.split('\.');
    const extension = image_split[1];

    // Comprobar extension
    if (extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif') {
        const file_path = req.file.path;
        // Eliminar archivo subido
        fs.unlinkSync(file_path);
        return res.status(500).json({status: 'error', message: 'Extensión de la imagen invalida!'});
    }

    // Si la extension es correcta guardar en la bbdd
    Publication.findOneAndUpdate({user: req.user.id, _id: id}, {file: req.file.filename}, {new: true}, (error, publication) => {
       if (error || !publication) return res.status(500).json({status: 'error', message: 'Error en la subida de la imagen!'});

        // Devolver respuesta
        return res.status(200).json({
            status: 'success',
            message: 'Imagen subida correctamente!',
            publication,
            file: req.file
        })
    });
}

// DEVOLVER ARCHIVOS MULTIMEDIA
const media = (req, res) => {
    // Obtener el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const file_path = `./uploads/publications/${file}`;

    // Comprobar que existe
    fs.stat(file_path, (error, exists) => {
        if (error || !exists) return res.status(404).json({status:'error', message: 'No existe la imagen'});

        // Devolver respuesta
        return res.sendFile(path.resolve(file_path));
    });
}

// LISTAR TODAS LAS PUBLICACIONES (FEED)
const feed = async(req, res) => {
    // Obtener pagina actual
    const page = (req.params.page) ? parseInt(req.params.page): 1;

    // Establecer numero de elementos por pagina
    const items_per_page = 10;

    // Obtener array de ids de usuarios que yo sigo como usuario identificado
    try {
        let my_follows = await FollowService.followUserIds(req.user.id);

            // Find a publicaciones in, ordenar, popular, paginar
            // NOTA: el IN se puede poner igual como => user: my_follows.following
            // Publication.find({user: {'$in': my_follows.following}})
            Publication.find()
                .populate('user', '-password -role -__v -email')
                .sort('-created_at')
                .paginate(page, items_per_page, (error, publications, total) => {
                    if (error || !publications || publications.length <= 0) return res.status(404).json({status: 'error', message: 'No hay publicaciones que mostar!'});

                    return res.status(200).json({
                        status: 'success',
                        following: my_follows.following,
                        total,
                        page,
                        pages: Math.ceil(total/ items_per_page),
                        publications
                    });
                });

    } catch(error) {
        return res.status(500).json({status: 'error', message: 'No se han listado las publicaciones del feed'});
    }
}

module.exports = {
    publicationTest,
    save,
    detail,
    remove,
    user,
    upload,
    media,
    feed
}