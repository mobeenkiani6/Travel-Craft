const express = require('express');
const router = express.Router();
const Contact = require('../models/ContactMessage'); // 

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
