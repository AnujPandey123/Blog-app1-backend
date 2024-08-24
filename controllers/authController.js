const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup function
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    console.log(`Checking if user exists with email: ${email}`);
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({ name, email, password });

    // Hash the password before saving the user
    console.log('Hashing password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the new user to the database
    console.log('Saving user to the database');
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the JWT token
    res.status(201).json({ token });

  } catch (err) {
    console.error('Error during signup:', err.message);
    res.status(500).send('Server error');
  }
};


// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    console.log(`Looking for user with email: ${email}`);
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    console.log('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the JWT token
    console.log('Login successful');
    res.status(200).json({ token });

  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).send('Server error');
  }
};
