const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

// Create index for userId and date for better query performance (non-unique to allow multiple entries per day)
entrySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Entry', entrySchema);