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
router.get('/following/:id?/:page?', auth.verify, FollowController.following);
router.get('/followers/:id?/:page?', auth.verify, FollowController.followers)

// EXPORTACIÓN DEL ROUTER
module.exports = router;