require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/uploads', express.static(__dirname + '/uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));

app.get('/', (req, res) => res.send({ok: true, msg: 'VeeHub API running'}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
