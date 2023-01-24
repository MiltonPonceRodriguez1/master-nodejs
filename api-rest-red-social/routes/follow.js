// IMPORTACIÓN DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACION DE CONTROLLERS
const FollowController = require('../controllers/follow');

// DEFINICIÓN DE RUTAS
router.get('/test-follow', FollowController.followTest);

// EXPORTACIÓN DEL ROUTER
module.exports = router;