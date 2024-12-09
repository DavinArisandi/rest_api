const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for sensor data
const sensorSchema = new Schema({
  sensor: String,
  value: Number, // For MQ135 sensor
  temperature: Number, // For DHT11 sensor
  humidity: Number, // For DHT11 sensor
  timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
