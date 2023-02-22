// IMPORTACION DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACIÓN DE CONTROLLERS
const PublicationController = require('../controllers/publication');

// IMPORTACIÓN DE MIDDLEWARES
const auth = require('../middlewares/auth');
const multer = require('multer');

// CONFIGURACIÓN DE SUBIDAS
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/publications');
    },
    filename: (req, file, cb) => {
        cb(null, `pub-${Date.now()}-${file.originalname}`);
    }
});

const uploads = multer({storage});

// DEFINICIÓN DE RUTAS
router.get('/test-publication', PublicationController.publicationTest);
router.post('/save', auth.verify, PublicationController.save);
router.get('/detail/:id', auth.verify, PublicationController.detail);
router.delete('/delete/:id', auth.verify, PublicationController.remove);
router.get('/user/:id/:page?', auth.verify, PublicationController.user);
router.post('/upload/:id', [auth.verify, uploads.single('file0')], PublicationController.upload);
router.get('/media/:file', PublicationController.media);
router.get('/feed/:page?', auth.verify, PublicationController.feed);

// EXPORTACIÓN DEL ROUTER
module.exports = router;