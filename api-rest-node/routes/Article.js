const express = require('express');
const multer = require('multer');

// Importar Controladores Necesarios
const ArticleController = require('../controllers/Article');

const router = express.Router();

/* MIDDLEWARE: CONFIGURACION RUTA Y NOMBRE DE LOS FICHEROS A ALMACENAR */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/articles/');
    },
    filename: (req, file, cb) => {
        cb(null, `article_${Date.now()}_${file.originalname}`);
    }
});

const uploads = multer({storage: storage});
/* FIN MIDDLEWARE: CONFIGURACION RUTA Y NOMBRE DE LOS FICHEROS A ALMACENAR */

// Rutas de Prueba
router.get('/test-route', ArticleController.test);
router.get('/get-courses', ArticleController.course);

router.post('/create', ArticleController.create);
router.get('/articles/:last?', ArticleController.list);
router.get('/article/:id', ArticleController.detail);
router.delete('/article/:id', ArticleController.delete_article);
router.put('/article/:id', ArticleController.update);
router.post('/image-upload/:id', [uploads.single('file0')], ArticleController.upload);
router.get('/image/:file', ArticleController.image);
router.get('/search/:key', ArticleController.search);
// Exportar Modulo de rutas
module.exports = router;
