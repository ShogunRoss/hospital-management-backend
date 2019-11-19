const mongoose = require('mongoose');

const liquidationEventSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  liquidateInfo: {
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
    price: {
      type: Number,
      default: 0,
    },
  },
});

export default mongoose.model('LiquidationEvent', liquidationEventSchema);
