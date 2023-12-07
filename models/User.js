const mongoose = require('mongoose');

// the schema for the user collection in the database
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 256
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 256
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('users', userSchema);
