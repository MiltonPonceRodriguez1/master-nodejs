// ACCIONES DE PRUEBA

const testFollow = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.js"
    });
}

module.exports = {
    testFollow
}