const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// URL MongoDB Atlas yang sudah ada
const dbURI = 'mongodb+srv://davinarisandi:itenasjuara1_@davinarisandi.q5pzj.mongodb.net/sensor_data_db?retryWrites=true&w=majority&appName=DavinArisandi';

// Variabel untuk mengecek koneksi database
let isConnected = false;

// Menghubungkan ke database MongoDB
async function connectToDatabase() {
    if (isConnected) return;
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

// Inisialisasi aplikasi Express
const app = express();
app.use(bodyParser.json());
// Schema untuk data sensor
const sensorSchema = new mongoose.Schema({
    sensor: String,
    value: Number,
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});

// Model MongoDB
const SensorData = mongoose.model('sensors', sensorSchema);

// Endpoint GET untuk sensor MQ135 (mengambil data dari MongoDB)
app.get('/sensor/mq135', async (req, res) => {
    try {
        const data = await SensorData.find({ sensor: 'MQ135' });  // Mengambil data MQ135 dari database

        // Mengirim response dengan data yang ditemukan
        res.status(200).json(data);
    } catch (error) {
        console.error("Error while handling GET request:", error);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

// Endpoint GET untuk sensor DHT11 (mengambil data dari MongoDB)
app.get('/sensor/dht11', async (req, res) => {
    try {
        const data = await SensorData.find({ sensor: 'DHT11' });  // Mengambil data DHT11 dari database

        // Mengirim response dengan data yang ditemukan
        res.status(200).json(data);
    } catch (error) {
        console.error("Error while handling GET request:", error);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

// Endpoint POST untuk sensor MQ135 (menghasilkan data acak dan menyimpannya ke MongoDB)
app.post('/sensor/mq135', async (req, res) => {
    try {
        const value = (Math.random() * (100 - 10) + 10).toFixed(2);  // Nilai acak antara 10 hingga 100
        const timestamp = new Date();  // Timestamp saat data diterima

        // Menyimpan data ke MongoDB
        const newSensorData = new SensorData({
            sensor: 'MQ135',
            value: parseFloat(value),
            timestamp: timestamp
        });
        await newSensorData.save();

        // Mengirim response dengan nilai dan timestamp
        res.status(200).json({ value: parseFloat(value), timestamp: timestamp });
    } catch (error) {
        console.error("Error while handling POST request:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});

// Endpoint POST untuk sensor DHT11 (menghasilkan data acak dan menyimpannya ke MongoDB)
app.post('/sensor/dht11', async (req, res) => {
    try {
        const temperature = (Math.random() * (35 - 20) + 20).toFixed(2);  // Suhu acak antara 20 dan 35 derajat
        const humidity = (Math.random() * (80 - 40) + 40).toFixed(2);    // Kelembapan acak antara 40% hingga 80%
        const timestamp = new Date();  // Timestamp saat data diterima

        // Menyimpan data ke MongoDB
        const newSensorData = new SensorData({
            sensor: 'DHT11',
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            timestamp: timestamp
        });
        await newSensorData.save();

        // Mengirim response dengan suhu, kelembapan, dan timestamp
        res.status(200).json({ temperature: parseFloat(temperature), humidity: parseFloat(humidity), timestamp: timestamp });
    } catch (error) {
        console.error("Error while handling POST request:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});