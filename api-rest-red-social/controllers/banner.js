// IMPORTACIÓN DE DEPENDENCIAS
const path = require('path');
const fs = require('fs');

// IMPORTACIÓN DE MODELOS
const Banner = require('../models/banner');

// ACCIÓN DE PRUEBA
const bannerTest = (req, res) => {
    return res.status(200).json({
        message: 'Mensaje enviado desde: controllers/banner'
    });
}

// GUARDAR BANNER
const save = (req, res) => {
    // RECOGER DATOS DEL BODY
    const params = req.body;

    // COMPROBAR QUE LLEGUE ELL BANNER
    if (!req.file) return res.status(400).json({status: 'error', message: 'Falta enviar Datos!'});

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

    // INSTANCIAR OBJETO BANNER
    let banner = new Banner({
        text: params.text,
        banner: req.file.filename
    });

    banner.user = req.user.id;

    // GUARDAR OBJETO EN LA BBDD
    banner.save((error, banner) => {
        if (error || !banner) return res.status(500).json({status: 'error', message: 'Error al guardar el banner!'});

        // DEVOLVER RESPUESTA
        return res.status(200).json({
            status: 'success',
            message: 'Banner guardado correctamente!',
            banner
        });
    });
}


module.exports = {
    bannerTest,
    save
}