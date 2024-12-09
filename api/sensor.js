const express = require('express');
const Sensor = require('../models/sensorModel'); // Mengimpor model Sensor

const router = express.Router();

// POST data untuk sensor MQ135
router.post('/api/sensor/mq135', async (req, res) => {
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ error: "Value is required" });
  }

  const newSensorData = new Sensor({
    sensor: 'MQ135',
    value: value,
    timestamp: new Date()
  });

  await newSensorData.save();
  res.status(201).json({ value: value, message: 'Data saved successfully' });
});

// POST data untuk sensor DHT11
router.post('/api/sensor/dht11', async (req, res) => {
  const { temperature, humidity } = req.body;

  if (temperature === undefined || humidity === undefined) {
    return res.status(400).json({ error: "Temperature and humidity are required" });
  }

  const newSensorData = new Sensor({
    sensor: 'DHT11',
    temperature: temperature,
    humidity: humidity,
    timestamp: new Date()
  });

  await newSensorData.save();
  res.status(201).json({ temperature: temperature, humidity: humidity, message: 'Data saved successfully' });
});

// GET data untuk sensor MQ135
router.get('/api/sensor/mq135', async (req, res) => {
  const sensorData = await Sensor.find({ sensor: 'MQ135' }).sort({ timestamp: -1 }).limit(1);
  if (sensorData.length === 0) {
    return res.status(404).json({ error: "No MQ135 data found" });
  }
  res.json(sensorData[0]);
});

// GET data untuk sensor DHT11
router.get('/api/sensor/dht11', async (req, res) => {
  const sensorData = await Sensor.find({ sensor: 'DHT11' }).sort({ timestamp: -1 }).limit(1);
  if (sensorData.length === 0) {
    return res.status(404).json({ error: "No DHT11 data found" });
  }
  res.json(sensorData[0]);
});

module.exports = router;
