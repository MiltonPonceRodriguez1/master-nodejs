// ACCIONES DE PRUEBA

const userTest = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js"
    });
}

module.exports = {
    userTest
}