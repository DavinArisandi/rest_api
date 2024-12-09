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
 * - sensor (String): Jenis sensor (MQ135 atau DHT11)
 * - value (Number) atau temperature (Number) atau humidity (Number): Nilai dari sensor
 * - timestamp (Date): Waktu perekaman data, default saat ini
 */
const sensorSchema = new mongoose.Schema({
    sensor: String,  // Menyimpan jenis sensor, seperti 'MQ135' atau 'DHT11'
    value: { type: Number, required: false },  // Nilai dari MQ135
    temperature: { type: Number, required: false },  // Temperatur dari DHT11
    humidity: { type: Number, required: false },  // Kelembapan dari DHT11
    timestamp: { type: Date, default: Date.now }  // Waktu perekaman data
});

// Model MongoDB yang menggunakan schema 'sensorSchema'
// Catatan: Nama koleksi adalah "sensor_data"
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
            if (!sensor || (sensor === 'MQ135' && value === undefined) || (sensor === 'DHT11' && (temperature === undefined || humidity === undefined))) {
                return res.status(400).json({ error: "Data tidak lengkap" });
            }

            // Menentukan format data berdasarkan jenis sensor
            let sensorData;
            if (sensor === 'MQ135') {
                // Format untuk sensor MQ135
                sensorData = new SensorData({ sensor, value });
            } else if (sensor === 'DHT11') {
                // Format untuk sensor DHT11
                sensorData = new SensorData({ sensor, temperature, humidity });
            } else {
                return res.status(400).json({ error: "Sensor tidak dikenal" });
            }

            // Membuat data baru di database
            await sensorData.save();

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