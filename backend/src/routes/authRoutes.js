const express = require('express');
const router = express.Router();
const { register, login, googleLogin, supabaseSignup, supabaseGoogleUpsert, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/supabase-signup', supabaseSignup);
router.post('/supabase-google-upsert', supabaseGoogleUpsert);
router.put('/profile', updateProfile);

module.exports = router;
