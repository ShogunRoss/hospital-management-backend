import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^([\w-\.]+)@([\w-]+\.+[\w-]{2,5})?$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxLength: 42,
  },
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    default: 'USER',
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
  },
});

userSchema.pre('save', async function() {
  // use arrow function here will cause a bug
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
