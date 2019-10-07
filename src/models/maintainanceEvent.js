const mongoose = require('mongoose');

const maintainanceEventSchema = new mongoose.Schema({
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
  maintainedInterval: {
    type: Number,
    default: 0,
  },
  maintainance: {
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

export default mongoose.model('MaintainanceEvent', maintainanceEventSchema);
