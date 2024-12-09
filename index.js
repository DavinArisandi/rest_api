const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Schema } = mongoose;
const app = express();

// Middleware untuk mendukung JSON dan CORS
app.use(cors());
app.use(express.json());  // Untuk menerima data JSON pada request body

// MongoDB Atlas connection
const dbURI = 'mongodb+srv://davinarisandi:itenasjuara1_@davinarisandi.q5pzj.mongodb.net/sensor_data_db?retryWrites=true&w=majority&appName=DavinArisandi';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log(err));

// Schema MongoDB untuk sensor
const sensorSchema = new Schema({
  sensor: String,
  value: Number,  // Untuk MQ135 sensor
  temperature: Number,  // Untuk DHT11 sensor
  humidity: Number,  // Untuk DHT11 sensor
  timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.model('Sensor', sensorSchema);

// Route untuk halaman utama
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Sensor API</h1>');
});

// Endpoint untuk menerima data sensor MQ135 (POST)
app.post('/sensor/mq135', async (req, res) => {
  const { value } = req.body;  // Mengambil value dari request body

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

// Endpoint untuk menerima data sensor DHT11 (POST)
app.post('/sensor/dht11', async (req, res) => {
  const { temperature, humidity } = req.body;  // Mengambil data temperature dan humidity dari request body

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

// Endpoint untuk mendapatkan data sensor MQ135 (GET)
app.get('/sensor/mq135', async (req, res) => {
  const sensorData = await Sensor.find({ sensor: 'MQ135' }).sort({ timestamp: -1 }).limit(1);  // Ambil data terakhir
  if (sensorData.length === 0) {
    return res.status(404).json({ error: "No MQ135 data found" });
  }
  res.json(sensorData[0]);
});

// Endpoint untuk mendapatkan data sensor DHT11 (GET)
app.get('/sensor/dht11', async (req, res) => {
  const sensorData = await Sensor.find({ sensor: 'DHT11' }).sort({ timestamp: -1 }).limit(1);  // Ambil data terakhir
  if (sensorData.length === 0) {
    return res.status(404).json({ error: "No DHT11 data found" });
  }
  res.json(sensorData[0]);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});