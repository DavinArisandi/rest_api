const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://davinarisandi:itenasjuara1_@davinarisandi.q5pzj.mongodb.net/sensor_data_db?retryWrites=true&w=majority&appName=DavinArisandi';
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) return;
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    isConnected = true;
    console.log("MongoDB connected successfully");
}

/**
 * Schema untuk data sensor:
 * - sensor (String): Jenis sensor yang mengirimkan data (MQ135, DHT11, dll)
 * - value (Number): Nilai gas dari sensor MQ135
 * - temperature (Number): Nilai suhu dari sensor DHT11
 * - humidity (Number): Nilai kelembapan dari sensor DHT11
 * - timestamp (Date): Waktu perekaman data
 */
const sensorSchema = new mongoose.Schema({
    sensor: String,
    value: Number,         // Untuk sensor MQ135
    temperature: Number,   // Untuk sensor DHT11
    humidity: Number,      // Untuk sensor DHT11
    timestamp: { type: Date, default: Date.now }
});

// Model MongoDB yang menggunakan schema 'sensorSchema'
const SensorData = mongoose.model('sensors', sensorSchema);

/**
 * Endpoint untuk menangani request HTTP
 * - Method:
 *    - POST: Menyimpan data sensor baru
 *    - GET: Mengambil semua data sensor
 */
module.exports = async (req, res) => {
    await connectToDatabase();

    if (req.method === "POST") {
        try {
            const { sensor, value, temperature, humidity } = req.body;

            // Validasi data dari request
            if (!sensor || 
                (sensor === 'MQ135' && value === undefined) || 
                (sensor === 'DHT11' && (temperature === undefined || humidity === undefined))) {
                return res.status(400).json({ error: "Data tidak lengkap" });
            }

            // Membuat data baru di database
            const newSensorData = new SensorData({ 
                sensor, 
                value, 
                temperature, 
                humidity 
            });
            await newSensorData.save();

            res.status(200).json({ message: "Data berhasil disimpan" });
        } catch (error) {
            console.error("Error while saving data:", error);
            res.status(500).json({ error: "Failed to save data" });
        }
    } else if (req.method === "GET") {
        try {
            // Mengambil semua data dari koleksi sensor_data
            const data = await SensorData.find();

            res.status(200).json(data);
        } catch (error) {
            console.error("Error while retrieving data:", error);
            res.status(500).json({ error: "Failed to retrieve data" });
        }
    } else {
        // Method selain POST dan GET tidak diizinkan
        res.status(405).json({ error: "Method not allowed" });
    }
};