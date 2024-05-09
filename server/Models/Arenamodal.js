const mongoose = require('mongoose');

const ArenaSchema = new mongoose.Schema({
    name: { type: String },
    location: { type: String },
    opentime: { type: String },
    closetime: { type: String },
    charges: { type: String },
    contact: { type: String },
    slots: [
        {
            day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
            startTime: { type: String },
            endTime: { type: String },
            reserved: { type: Boolean, default: false },
            reservedBy: {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                userName: { type: String }
            },
            imageUrl: { type: String }, // Field for image URL
            sport: { type: String, enum: ['Football', 'Cricket'] } // New field for sport type
        }
    ]
});


module.exports = mongoose.model("Arenas", ArenaSchema);
