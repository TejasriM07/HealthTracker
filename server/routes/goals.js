const express = require('express');
const { body, validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all goals for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get goal for a specific date
router.get('/:date', authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;
    const goal = await Goal.findOne({
      userId: req.user._id,
      date: new Date(date)
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'No goal found for this date' });
    }
    
    res.json(goal);
  } catch (error) {
    console.error('Get goal by date error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new goal
router.post('/', authMiddleware, [
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('workout').isIn(['Running', 'Cycling', 'Weightlifting', 'Swimming', 'Yoga', 'Walking', 'Basketball', 'Tennis', 'Other']).withMessage('Please select a valid workout'),
  body('workoutMinutes').isInt({ min: 0 }).withMessage('Workout minutes must be a positive number'),
  body('caloriesBurnt').isInt({ min: 0 }).withMessage('Calories burnt must be a positive number'),
  body('waterConsumption').isFloat({ min: 0 }).withMessage('Water consumption must be a positive number'),
  body('sleepTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Sleep time must be in HH:MM format'),
  body('wakeupTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Wakeup time must be in HH:MM format'),
  body('bloodPressure.systolic').isInt({ min: 50, max: 300 }).withMessage('Systolic pressure must be between 50-300'),
  body('bloodPressure.diastolic').isInt({ min: 30, max: 200 }).withMessage('Diastolic pressure must be between 30-200'),
  body('heartRate').isInt({ min: 30, max: 220 }).withMessage('Heart rate must be between 30-220')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goalData = {
      ...req.body,
      userId: req.user._id
    };

    const goal = new Goal(goalData);
    await goal.save();

    res.status(201).json({ message: 'Goal created successfully', goal });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Goal already exists for this date' });
    }
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a goal
router.put('/:id', authMiddleware, [
  body('workout').optional().isIn(['Running', 'Cycling', 'Weightlifting', 'Swimming', 'Yoga', 'Walking', 'Basketball', 'Tennis', 'Other']).withMessage('Please select a valid workout'),
  body('workoutMinutes').optional().isInt({ min: 0 }).withMessage('Workout minutes must be a positive number'),
  body('caloriesBurnt').optional().isInt({ min: 0 }).withMessage('Calories burnt must be a positive number'),
  body('waterConsumption').optional().isFloat({ min: 0 }).withMessage('Water consumption must be a positive number'),
  body('sleepTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Sleep time must be in HH:MM format'),
  body('wakeupTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Wakeup time must be in HH:MM format'),
  body('bloodPressure.systolic').optional().isInt({ min: 50, max: 300 }).withMessage('Systolic pressure must be between 50-300'),
  body('bloodPressure.diastolic').optional().isInt({ min: 30, max: 200 }).withMessage('Diastolic pressure must be between 30-200'),
  body('heartRate').optional().isInt({ min: 30, max: 220 }).withMessage('Heart rate must be between 30-220')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a goal
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;