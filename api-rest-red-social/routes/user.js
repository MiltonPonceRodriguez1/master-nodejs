// IMPORTACION DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACION DE CONTROLLERS
const UserController = require('../controllers/user');

// IMPORTACION DE MIDDLEWARES
const auth = require('../middlewares/auth');

// DEFINICION DE RUTAS
router.get('/test-user', auth.verify, UserController.user_test);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// EXPORTACION DEL ROUTER
module.exports = router;