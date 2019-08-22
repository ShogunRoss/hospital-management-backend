const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  manufacturer: {
    type: String
  },
  origin: {
    type: String,
    required: true
  },
  manufacturedYear: {
    type: String,
    require: true
  },
  startUseTime: {
    type: Date,
    require: true
  },
  startUseState: {
    type: Boolean,
    require: true
  },
  price: {
    type: Number,
    required: true
  },
  falcuty: {
    type: String,
    required: true
  },
  currentState: {
    type: Boolean,
    required: true
  },
  createdEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
});

export default mongoose.model('Device', deviceSchema);
