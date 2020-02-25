const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  model: {
    type: String,
    default: '',
  },
  manufacturer: {
    type: String,
    default: '',
  },
  origin: {
    type: String,
    default: '',
  },
  manufacturedYear: {
    type: String,
    default: '',
  },
  startUseTime: {
    type: Date,
    default: Date.now,
  },
  startUseState: {
    type: Boolean,
    default: true,
  },
  faculty: {
    type: String,
    default: '',
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  currentPrice: {
    type: Number,
    default: 0,
  },
  activeState: {
    type: Boolean,
    default: false,
  },
  availability: {
    type: String,
    default: 'active',
  },
  qrcode: {
    type: String,
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
