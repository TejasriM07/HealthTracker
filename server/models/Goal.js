const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  workout: {
    type: String,
    required: true,
    enum: ['Running', 'Cycling', 'Weightlifting', 'Swimming', 'Yoga', 'Walking', 'Basketball', 'Tennis', 'Other']
  },
  workoutMinutes: {
    type: Number,
    required: true,
    min: 0
  },
  caloriesBurnt: {
    type: Number,
    required: true,
    min: 0
  },
  waterConsumption: {
    type: Number,
    required: true,
    min: 0
  },
  sleepTime: {
    type: String,
    required: true
  },
  wakeupTime: {
    type: String,
    required: true
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true,
      min: 50,
      max: 300
    },
    diastolic: {
      type: Number,
      required: true,
      min: 30,
      max: 200
    }
  },
  heartRate: {
    type: Number,
    required: true,
    min: 30,
    max: 220
  }
}, {
  timestamps: true
});

// Create compound index for userId and date to ensure one goal per user per day
goalSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Goal', goalSchema);