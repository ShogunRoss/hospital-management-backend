const mongoose = require('mongoose');

const maintainEventSchema = new mongoose.Schema({
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
  maintainInterval: {
    type: Number,
    default: 0,
  },
  maintain: {
    name: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
});

export default mongoose.model('MaintainEvent', maintainEventSchema);
