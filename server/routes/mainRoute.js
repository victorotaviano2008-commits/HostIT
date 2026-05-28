const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userController');
const gameJamsControllers = require('../controllers/gameJamsController');
const checkAuth = require('../middlewares/checkAuth');
const upload = require('../middlewares/multer.js');

router.post('/upload', checkAuth, upload.single('gameFile'), userControllers.uploadGame);
router.get('/games/:id', userControllers.getGameById);
router.get('/games', userControllers.getAllGames);  
router.post('/games/:id/star', checkAuth, userControllers.toggleStar);
router.post('/games/:id/favorite', checkAuth, userControllers.toggleFavorite);
router.get('/currentUser', checkAuth, userControllers.getCurrentUser);

// Game Jams routes
router.get('/jams', gameJamsControllers.getAllGameJams);
router.get('/jams/:id', gameJamsControllers.getGameJamById);
router.post('/jams', checkAuth, gameJamsControllers.createGameJam);
router.put('/jams/:id', checkAuth, gameJamsControllers.updateGameJam);
router.delete('/jams/:id', checkAuth, gameJamsControllers.deleteGameJam);

module.exports = router;