// models/ContactMessage.js
const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
