const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_a_long_secret';

exports.register = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;
    if(!name || !email || !password) return res.status(400).json({msg: 'Missing fields'});
    let user = await User.findOne({email});
    if(user) return res.status(400).json({msg: 'User exists'});
    user = new User({name, email, password, role});
    await user.save();
    const token = jwt.sign({id: user._id, role: user.role}, JWT_SECRET, {expiresIn: '7d'});
    res.json({token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({msg: 'Invalid credentials'});
    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({msg: 'Invalid credentials'});
    const token = jwt.sign({id: user._id, role: user.role}, JWT_SECRET, {expiresIn: '7d'});
    res.json({token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({msg: 'Server error'});
  }
};
