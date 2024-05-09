// import mongoose from "mongoose";
const express = require('express');
const { UserRegistration, UserLogin } = require('../Controllers/Users');


const router = express.Router()

router.post('/register-user', UserRegistration)
router.post('/user-login', UserLogin)


module.exports = router;