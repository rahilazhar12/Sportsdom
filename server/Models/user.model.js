const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    contact: { type: String },
    role: { 
        type: String, 
        enum: ['Admin', 'User'], // Defining the enum with allowed roles
        default: 'User'
    }
});

module.exports = mongoose.model("users", UserSchema);
