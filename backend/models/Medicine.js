const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    batchId: {
        type: String,
        required: true,
        unique: true // Ensures the batchId is unique
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References User schema (role: supplier)
        required: true
    },
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References User schema (role: manufacturer)
        required: true
    },
    distributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References User schema (role: distributor)
        required: true
    },
    enduser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // References User schema (role: enduser)
        default: null  // Initially null until purchased
    },
    qrCode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['inProduction', 'shipped', 'delivered', 'sold'],
        default: 'inProduction'
    }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
