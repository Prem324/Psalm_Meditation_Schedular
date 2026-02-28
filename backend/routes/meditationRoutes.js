const express = require('express');
const router = express.Router();
const Meditation = require('../models/Meditation');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all meditations for a specific month and year
// @route   GET /api/meditations
// @access  Public
router.get('/', async (req, res) => {
    const { month, year } = req.query;
    const query = {};
    if (month) query.month = month;
    if (year) query.year = Number(year);

    try {
        const meditations = await Meditation.find(query).sort({ sundayNumber: -1 });
        res.json(meditations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a meditation
// @route   POST /api/meditations
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
    const { month, year, sundayNumber, psalmChapter, personName } = req.body;

    try {
        // Validation
        if (psalmChapter < 1 || psalmChapter > 150) {
            return res.status(400).json({ message: 'Psalm chapter must be between 1 and 150' });
        }
        if (sundayNumber < 1 || sundayNumber > 5) {
            return res.status(400).json({ message: 'Sunday number must be between 1 and 5' });
        }

        const meditation = await Meditation.create({
            month,
            year,
            sundayNumber,
            psalmChapter,
            personName,
        });

        res.status(201).json(meditation);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Duplicate Psalm or Sunday number in same month/year' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// @desc    Update a meditation
// @route   PUT /api/meditations/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
    const { month, year, sundayNumber, psalmChapter, personName } = req.body;

    try {
        const meditation = await Meditation.findById(req.params.id);

        if (meditation) {
            meditation.month = month || meditation.month;
            meditation.year = year || meditation.year;
            meditation.sundayNumber = sundayNumber !== undefined ? sundayNumber : meditation.sundayNumber;
            meditation.psalmChapter = psalmChapter !== undefined ? psalmChapter : meditation.psalmChapter;
            meditation.personName = personName || meditation.personName;

            // Validation
            if (meditation.psalmChapter < 1 || meditation.psalmChapter > 150) {
                return res.status(400).json({ message: 'Psalm chapter must be between 1 and 150' });
            }
            if (meditation.sundayNumber < 1 || meditation.sundayNumber > 5) {
                return res.status(400).json({ message: 'Sunday number must be between 1 and 5' });
            }

            const updatedMeditation = await meditation.save();
            res.json(updatedMeditation);
        } else {
            res.status(404).json({ message: 'Meditation not found' });
        }
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Duplicate Psalm or Sunday number in same month/year' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// @desc    Delete a meditation
// @route   DELETE /api/meditations/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
    try {
        const meditation = await Meditation.findById(req.params.id);

        if (meditation) {
            await meditation.deleteOne();
            res.json({ message: 'Meditation removed' });
        } else {
            res.status(404).json({ message: 'Meditation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
