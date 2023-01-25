// IMPORTACION DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACION DE CONTROLLERS
const UserController = require('../controllers/user');

// DEFINICION DE RUTAS
router.get('/test-user', UserController.userTest);
router.post('/register', UserController.register);

// EXPORTACION DEL ROUTER
module.exports = router;