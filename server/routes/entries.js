const express = require('express');
const { body, validationResult } = require('express-validator');
const Entry = require('../models/Entry');
const Goal = require('../models/Goal');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all entries for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get entry for a specific date
router.get('/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;
    const entry = await Entry.findOne({
      userId: req.user._id,
      date: new Date(date)
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'No entry found for this date' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Get entry by date error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's entries with goal comparison
router.get('/today/comparison', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const [entries, goal] = await Promise.all([
      Entry.find({ 
        userId: req.user._id, 
        date: { $gte: startOfDay, $lte: endOfDay } 
      }).sort({ createdAt: -1 }),
      Goal.findOne({ 
        userId: req.user._id, 
        date: { $gte: startOfDay, $lte: endOfDay } 
      })
    ]);
    
    // Calculate totals from all entries today
    const totals = entries.length > 0 ? {
      workoutMinutes: entries.reduce((sum, entry) => sum + entry.workoutMinutes, 0),
      waterConsumption: entries.reduce((sum, entry) => sum + entry.waterConsumption, 0)
    } : null;
    
    res.json({
      entries: entries || [],
      entry: entries.length > 0 ? entries[0] : null, // Latest entry for backward compatibility
      goal: goal || null,
      totals: totals,
      comparison: totals && goal ? {
        workoutMinutes: {
          actual: totals.workoutMinutes,
          goal: goal.workoutMinutes,
          achieved: totals.workoutMinutes >= goal.workoutMinutes
        },
        waterConsumption: {
          actual: totals.waterConsumption,
          goal: goal.waterConsumption,
          achieved: totals.waterConsumption >= goal.waterConsumption
        }
      } : null
    });
  } catch (error) {
    console.error('Get today comparison error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly stats
router.get('/stats/weekly', authMiddleware, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const entries = await Entry.find({
      userId: req.user._id,
      date: { $gte: oneWeekAgo }
    }).sort({ date: 1 });
    
    const weeklyStats = entries.map(entry => ({
      date: entry.date,
      workoutMinutes: entry.workoutMinutes,
      waterConsumption: entry.waterConsumption,
      workout: entry.workout
    }));
    
    // Calculate averages
    const averages = entries.length > 0 ? {
      workoutMinutes: Math.round(entries.reduce((sum, e) => sum + e.workoutMinutes, 0) / entries.length),
      waterConsumption: Math.round(entries.reduce((sum, e) => sum + e.waterConsumption, 0) / entries.length * 10) / 10
    } : { workoutMinutes: 0, waterConsumption: 0 };
    
    res.json({
      weeklyStats,
      averages,
      totalEntries: entries.length
    });
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new entry
router.post('/', authMiddleware, [
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('workout').isIn(['Running', 'Cycling', 'Weightlifting', 'Swimming', 'Yoga', 'Walking', 'Basketball', 'Tennis', 'Other']).withMessage('Please select a valid workout'),
  body('workoutMinutes').isInt({ min: 0 }).withMessage('Workout minutes must be a positive number'),
  body('waterConsumption').isFloat({ min: 0 }).withMessage('Water consumption must be a positive number'),
  body('sleepTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Sleep time must be in HH:MM format'),
  body('wakeupTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Wakeup time must be in HH:MM format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entryData = {
      ...req.body,
      userId: req.user._id
    };

    const entry = new Entry(entryData);
    await entry.save();

    res.status(201).json({ message: 'Entry created successfully', entry });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an entry
router.put('/:id', authMiddleware, [
  body('workout').optional().isIn(['Running', 'Cycling', 'Weightlifting', 'Swimming', 'Yoga', 'Walking', 'Basketball', 'Tennis', 'Other']).withMessage('Please select a valid workout'),
  body('workoutMinutes').optional().isInt({ min: 0 }).withMessage('Workout minutes must be a positive number'),
  body('waterConsumption').optional().isFloat({ min: 0 }).withMessage('Water consumption must be a positive number'),
  body('sleepTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Sleep time must be in HH:MM format'),
  body('wakeupTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Wakeup time must be in HH:MM format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const entry = await Entry.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry updated successfully', entry });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Entry.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;