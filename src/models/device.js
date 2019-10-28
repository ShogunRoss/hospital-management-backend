const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  origin: {
    type: String,
    required: true,
  },
  manufacturedYear: {
    type: String,
    require: true,
  },
  startUseTime: {
    type: Date,
    require: true,
  },
  startUseState: {
    type: Boolean,
    require: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
  },
  activeState: {
    type: Boolean,
    default: false,
  },
  availability: {
    type: String,
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Device', deviceSchema);
