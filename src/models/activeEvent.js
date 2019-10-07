const mongoose = require('mongoose');

const activeEventSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  },
  actionType: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  usedInterval: {
    type: Number,
    required: true,
  },
  reported: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('ActiveEvent', activeEventSchema);
