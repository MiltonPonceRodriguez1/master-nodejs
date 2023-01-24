// IMPORTACION DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACIÓN DE CONTROLLERS
const PublicationController = require('../controllers/publication');

// DEFINICIÓN DE RUTAS
router.get('/test-publication', PublicationController.publicationTest);

// EXPORTACIÓN DEL ROUTER
module.exports = router;