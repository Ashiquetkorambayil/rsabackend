const mongoose = require('mongoose');

const showroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  showroomId: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  helpline: { type: String },
  phone: { type: String, required: true },
  mobile: { type: String },
  state: { type: String, required: true },
  district: { type: String, required: true },
  image: { type: String },
  services: {
    serviceCenter: {
      selected: { type: Boolean, default: false },
      amount: { type: Number, default: null }
    },
    bodyShop: {
      selected: { type: Boolean, default: false },
      amount: { type: Number, default: null }
    },
    showroom: { 
      selected: { type: Boolean, default: false }
    }
  }
});

module.exports = mongoose.model('Showroom', showroomSchema);
