const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definisikan schema untuk sensor
const sensorSchema = new Schema({
  sensor: String,
  value: Number,  // Untuk sensor MQ135
  temperature: Number,  // Untuk sensor DHT11
  humidity: Number,  // Untuk sensor DHT11
  timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.model('sensor', sensorSchema);

module.exports = Sensor;
