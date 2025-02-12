const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true }, // Possible duplicate
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'supplier', 'manufacturer', 'distributor', 'enduser'], default: 'enduser' }
});

// Another index (causing the duplicate warning)
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
