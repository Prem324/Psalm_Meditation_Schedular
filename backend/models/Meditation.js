const mongoose = require('mongoose');

const meditationSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    sundayNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    psalmChapter: {
        type: Number,
        required: true,
        min: 1,
        max: 150,
    },
    personName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound unique indexes to prevent duplicates in same month + year
meditationSchema.index({ month: 1, year: 1, sundayNumber: 1 }, { unique: true });
meditationSchema.index({ month: 1, year: 1, psalmChapter: 1 }, { unique: true });

const Meditation = mongoose.model('Meditation', meditationSchema);

module.exports = Meditation;
