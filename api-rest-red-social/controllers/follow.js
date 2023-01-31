// IMPORTACION DE MODELOS
const Follow = require('../models/follow');
const User = require('../models/user');

// ACCIONES DE PRUEBA
const followTest = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.js"
    });
}

// ACCIÓN DE SEGUIR (GUARDAR FOLLOW)
const save = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Metodo de follow'
    })
}

// ACCIÓN DEJAR DE SEGUIR (ELIMINAR FOLLOW)

// ACCIÓN DE LISTA DE USUARIOS QUE ESTOY SIGUIENDO

// ACCIÓN DE LISTA DE USUARIOS QUE ME SIGUEN

module.exports = {
    followTest,
    save
}