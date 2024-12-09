const express = require('express');
const mongoose = require('mongoose');
const random = require('random');
const { DateTime } = require('luxon');

// Setup MongoDB
const dbURI = 'mongodb+srv://davinarisandi:itenasjuara1_@davinarisandi.q5pzj.mongodb.net/sensor_data_db?retryWrites=true&w=majority&appName=DavinArisandi';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Schema dan Model untuk data sensor
const sensorSchema = new mongoose.Schema({
    sensor: String,
    value: Number,
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorSchema);

// Inisialisasi Express
const app = express();

// Endpoint untuk sensor MQ135 (gas)
app.get('/sensor/mq135', async (req, res) => {
    const value = round(random.float(10, 100), 2); // Menghasilkan nilai gas acak antara 10 hingga 100

    // Menyimpan data ke MongoDB
    const newSensorData = new SensorData({
        sensor: 'MQ135',
        value,
        timestamp: DateTime.now().toJSDate()
    });

    try {
        await newSensorData.save();
        res.status(200).json({ value });
    } catch (error) {
        console.error("Error while saving MQ135 data:", error);
        res.status(500).json({ error: "Failed to save MQ135 data" });
    }
});

// Endpoint untuk sensor DHT11 (suhu dan kelembapan)
app.get('/sensor/dht11', async (req, res) => {
    const temperature = round(random.float(20, 35), 2); // Menghasilkan suhu acak antara 20 hingga 35
    const humidity = round(random.float(40, 80), 2);    // Menghasilkan kelembapan acak antara 40 hingga 80

    // Menyimpan data ke MongoDB
    const newSensorData = new SensorData({
        sensor: 'DHT11',
        temperature,
        humidity,
        timestamp: DateTime.now().toJSDate()
    });

    try {
        await newSensorData.save();
        res.status(200).json({ temperature, humidity });
    } catch (error) {
        console.error("Error while saving DHT11 data:", error);
        res.status(500).json({ error: "Failed to save DHT11 data" });
    }
});

// Fungsi untuk pembulatan angka
function round(num, dec) {
    return Number(num.toFixed(dec));
}

// Menjalankan server Express (Port ditentukan oleh Vercel)
const port = process.env.PORT || 5000; // Gunakan port yang diberikan Vercel atau default ke 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});