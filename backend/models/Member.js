const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  membership_expiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
