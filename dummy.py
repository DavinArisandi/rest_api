import requests
import random
import time
from datetime import datetime

# URL backend Flask
backend_url = "https://rest-api-five-beta.vercel.app/api"

def data_backend():
    try:
        # Timestamp untuk kedua sensor
        timestamp = datetime.now().isoformat()

        # Data untuk sensor MQ135
        gas_level = random.randint(10, 200)  # Nilai gasLevel acak antara 10-200
        payload_mq135 = {
            "sensor": "MQ135",
            "value": gas_level,
            "timestamp": timestamp
        }

        # Data untuk sensor DHT11
        temperature = round(random.uniform(20, 35), 2)  # Nilai suhu acak antara 20-35°C
        humidity = round(random.uniform(40, 80), 2)     # Nilai kelembapan acak antara 40-80%
        payload_dht11 = {
            "sensor": "DHT11",
            "temperature": temperature,
            "humidity": humidity,
            "timestamp": timestamp
        }

        # Kirim POST request ke backend untuk kedua sensor
        response_mq135 = requests.post(backend_url, json=payload_mq135)
        response_dht11 = requests.post(backend_url, json=payload_dht11)

        # Tampilkan respons dari server
        if response_mq135.status_code == 200 and response_dht11.status_code == 200:
            print("Data berhasil dikirim! (MQ135 dan DHT11)")
            print("Response MQ135:", response_mq135.json())
            print("Response DHT11:", response_dht11.json())
        else:
            print(f"Gagal mengirim data. Status code MQ135: {response_mq135.status_code}, DHT11: {response_dht11.status_code}")
            print("Error MQ135:", response_mq135.text)
            print("Error DHT11:", response_dht11.text)

    except Exception as e:
        print("Terjadi kesalahan:", e)

if __name__ == "__main__":
    print("Program pengirim data dummy ke backend Flask")
    while True:
        # Kirim data kedua sensor setiap 10 detik
        data_backend()
        time.sleep(10)  # Jeda 10 detik