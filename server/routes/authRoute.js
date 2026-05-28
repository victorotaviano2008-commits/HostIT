const authControllers = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.post('/forgot-password', authControllers.forgotPassword);
router.get('/verify-reset-token', authControllers.verifyResetToken);
router.post('/reset-password', authControllers.resetPassword);

module.exports = router;