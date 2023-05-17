// IMPORTACIÓN DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACION DE CONTROLLERS
const BannerController = require('../controllers/banner');

// IMPORTACIÓN DE MIDDLEWARES
const auth = require('../middlewares/auth');
const multer = require('multer');

// CONFIGURACIÓN DE SUBIDAS
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/banners');
    },
    filename: (req, file, cb) => {
        cb(null, `banner-${Date.now()}-${file.originalname}`);
    }
});

const uploads = multer({storage});

// DEFINICIÓN DE RUTAS
router.get('/test-banner', BannerController.bannerTest);
router.post('/save', [auth.verify, uploads.single('file0')], BannerController.save);

module.exports = router;