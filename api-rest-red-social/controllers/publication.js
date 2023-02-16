// IMPORTACIÓN DE DEPENDENCIAS

// IMPORTACIÓN DE MODELOS
const Publication = require('../models/publication');

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
    if (!params.text) return res.status(400).json({status: 'error', message: 'Falta enviar Datos!'});

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

// ELMINIAR PUBLICACIONES

// LISTAR TODAS LAS PUBLICACIONES

// LISTAR PUBLICACIONES DE UN USUARIO

// SUBIR FICHEROS

// DEVOLVER ARCHIVOS MULTIMEDIA

module.exports = {
    publicationTest,
    save
}