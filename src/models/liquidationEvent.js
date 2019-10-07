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
  action: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  liquidation: {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    note: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  },
});

export default mongoose.model('LiquidationEvent', liquidationEventSchema);
