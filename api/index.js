const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sensorRoutes = require('./sensor'); // Import routes from sensor.js

const app = express();

// Middleware for CORS and JSON support
app.use(cors());
app.use(express.json());  // To handle JSON in request body

// MongoDB Atlas connection
const dbURI = 'mongodb+srv://davinarisandi:itenasjuara1_@davinarisandi.q5pzj.mongodb.net/sensor_data_db?retryWrites=true&w=majority&appName=DavinArisandi';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log(err));

// Gunakan route sensor
app.use(sensorRoutes);

// Route utama
app.get('/api', (req, res) => {
  res.send('<h1>Welcome to the Sensor API</h1>');
});

module.exports = app;
