// IMPORTACION DE DEPENDENCIAS
const express = require('express');
const router = express.Router();

// IMPORTACION DE CONTROLLERS
const UserController = require('../controllers/user');

// IMPORTACION DE MIDDLEWARES
const auth = require('../middlewares/auth');
const multer = require('multer');

// CONFIGURACION DE SUBIDAS
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars');
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}-${file.originalname}`);
    }
});

const uploads = multer({storage});

// DEFINICION DE RUTAS
router.get('/test-user', auth.verify, UserController.user_test);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile/:id', auth.verify, UserController.profile);
router.get('/list/:page?', auth.verify, UserController.list);
router.put('/update', auth.verify, UserController.update);
router.post('/upload', [auth.verify, uploads.single('file0')], UserController.upload);
router.get('/avatar/:file', UserController.avatar);
router.get('/counters/:id?', auth.verify, UserController.counters);


// EXPORTACION DEL ROUTER
module.exports = router;