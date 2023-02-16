// IMPORTACION DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACIÓN DE CONTROLLERS
const PublicationController = require('../controllers/publication');

// IMPORTACIÓN DE MIDDLEWARES
const auth = require('../middlewares/auth');

// DEFINICIÓN DE RUTAS
router.get('/test-publication', PublicationController.publicationTest);
router.post('/save', auth.verify, PublicationController.save);

// EXPORTACIÓN DEL ROUTER
module.exports = router;