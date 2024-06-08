const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: { type: String },
    endTime: { type: String },
    reserved: { type: Boolean, default: false },
    reservedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String }
    },
    sport: { type: String, enum: ['Football', 'Cricket'] }
});

const FieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pricePerHour: { type: String, required: true },
    slots: [SlotSchema]
});

const ArenaSchema = new mongoose.Schema({
    name: { type: String },
    location: { type: String },
    opentime: { type: String },
    closetime: { type: String },
    charges: { type: String }, // General charges, can be optional
    contact: { type: String },
    pictures: [{ type: String }], // Array to store image URLs
    fields: [FieldSchema]
});

module.exports = mongoose.model("Arenas", ArenaSchema);
