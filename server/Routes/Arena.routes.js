// import mongoose from "mongoose";
const express = require('express');
const { ArenaRegistration, GetallArenas, AddSlotsToArena, ReserveSlot, ArenaGetonId, UpdateSlotReservation, addArenaPictures, getArenaPictures } = require('../Controllers/Arena');
const { authenticateToken, requireAuth } = require('../Middlewares/requiredauth');
const upload = require('../Middlewares/Multer')


const router = express.Router()




router.post('/register-arena', ArenaRegistration)
router.post('/add-images/:arenaId', upload.array('pictures', 5), addArenaPictures); // Allow uploading up to 5 pictures
router.get('/get-pictures/:arenaId', getArenaPictures);

router.get('/get-arena-onid/:id', ArenaGetonId)
router.post('/add-slots/:arenaId', AddSlotsToArena);
router.post('/reserve-slot/:arenaId', requireAuth, authenticateToken, upload.single('image'), ReserveSlot);
router.put('/update-reservation/:arenaId/:slotId', UpdateSlotReservation);
router.get('/getarena', GetallArenas)



module.exports = router;