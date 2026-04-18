const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    let memberInfo = null;
    if (user.role === 'member') {
      memberInfo = await Member.findOne({ user_id: user._id });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, memberId: memberInfo ? memberInfo._id : null }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Setup admin (Run once manually or via postman)
router.post('/setup-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'Super Admin',
      email: 'admin@library.com',
      password_hash,
      role: 'admin'
    });
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully (admin@library.com / admin123)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register member
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const membership_no = 'MEM' + Date.now();

    const user = new User({
      name, email, password_hash, role: 'member', membership_no
    });
    await user.save();

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const member = new Member({
      user_id: user._id,
      phone,
      address,
      membership_expiry: expiryDate
    });
    await member.save();

    res.status(201).json({ message: 'Member registered successfully', membership_no });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
