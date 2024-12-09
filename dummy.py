import requests
import random
import time
from datetime import datetime

# URL backend Flask
backend_url = "https://rest-api-five-beta.vercel.app/api"

def data_backend():
    try:
        # Pilih secara acak jenis sensor (MQ135 atau DHT11)
        sensor_type = random.choice(['MQ135', 'DHT11'])

        timestamp = datetime.now().isoformat()

        # Jika sensor adalah MQ135
        if sensor_type == 'MQ135':
            gas_level = random.randint(10, 200)  # Nilai gasLevel acak antara 10-200
            payload = {
                "sensor": "MQ135",
                "value": gas_level,
                "timestamp": timestamp
            }

        # Jika sensor adalah DHT11
        elif sensor_type == 'DHT11':
            temperature = round(random.uniform(20, 35), 2)  # Nilai suhu acak antara 20-35°C
            humidity = round(random.uniform(40, 80), 2)     # Nilai kelembapan acak antara 40-80%
            payload = {
                "sensor": "DHT11",
                "temperature": temperature,
                "humidity": humidity,
                "timestamp": timestamp
            }

        # Kirim POST request ke backend
        response = requests.post(backend_url, json=payload)

        # Tampilkan respons dari server
        if response.status_code == 200:
            print(f"Data berhasil dikirim! ({sensor_type})")
            print("Response:", response.json())
        else:
            print(f"Gagal mengirim data. Status code: {response.status_code}")
            print("Error:", response.text)

    except Exception as e:
        print("Terjadi kesalahan:", e)

if __name__ == "__main__":
    print("Program pengirim data dummy ke backend Flask")
    while True:
        # Kirim data setiap 10 detik
        data_backend()
        time.sleep(10)  # Jeda 10 detik