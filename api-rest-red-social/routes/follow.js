// IMPORTACIÓN DE DEPENDENCIAS
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// IMPORTACION DE CONTROLLERS
const FollowController = require('../controllers/follow');

// DEFINICIÓN DE RUTAS
router.get('/test-follow', FollowController.follow_test);
router.post('/save', auth.verify, FollowController.save);
router.delete('/unfollow/:id', auth.verify, FollowController.unfollow)

// EXPORTACIÓN DEL ROUTER
module.exports = router;