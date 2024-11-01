const mongoose = require('mongoose');

const baseLocationSchema = new mongoose.Schema({
  baseLocation: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('BaseLocation', baseLocationSchema);
