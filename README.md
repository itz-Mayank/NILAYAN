# Real-Time Environmental Monitoring & Disaster Management System

## 🌍 Overview
This project provides real-time monitoring of Air Quality Index (AQI), Water Quality Index (WQI), weather conditions, and disaster management. It utilizes multiple APIs to fetch real-time data, helping users stay informed and take preventive measures during environmental hazards.

## 🚀 Features
- **Real-time AQI & WQI Data** 📊
- **Live Weather Updates** ⛅
- **Disaster Management Alerts** ⚠️
- **Preventive Measures & Awareness System** 🏥
- **Database Storage for Historical Analysis** 📜
- **FastAPI for Efficient API Management** ⚡

## 🏗️ Tech Stack
- **FastAPI** - Web framework
- **MySQL** - Database for storing AQI & WQI data
- **Requests** - Fetching real-time data
- **OpenWeather API** - AQI, Weather, and Disaster Alerts

## 🔧 Setup & Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/realtime-environment-monitoring.git
   ```
2. Navigate to the backend directory:
   ```sh
   cd realtime-environment-monitoring/Backend
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Set up MySQL Database:
   ```sql
   CREATE DATABASE environment_db;
   CREATE TABLE aqi_data (
       id INT AUTO_INCREMENT PRIMARY KEY,
       city VARCHAR(100),
       aqi FLOAT,
       timestamp DATETIME
   );
   CREATE TABLE wqi_data (
       id INT AUTO_INCREMENT PRIMARY KEY,
       location VARCHAR(100),
       wqi FLOAT,
       timestamp DATETIME
   );
   ```
5. Run the FastAPI server:
   ```sh
   uvicorn backend:app --reload
   ```

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root endpoint |
| `GET` | `/get_aqi/{city}` | Fetch real-time AQI of a city |
| `GET` | `/get_wqi/{location}` | Fetch real-time WQI of a location |
| `GET` | `/weather/{city}` | Fetch real-time weather conditions |
| `GET` | `/disaster_alerts/{city}` | Get disaster alerts for a city |
| `POST` | `/store_aqi` | Store AQI data in MySQL |
| `POST` | `/store_wqi` | Store WQI data in MySQL |

## 📌 Disaster Management Features
- **Live Disaster Alerts:** Alerts based on weather API.
- **Emergency Protocols:** Steps to take in case of extreme weather or pollution levels.
- **Public Awareness & Prevention:** Information on health hazards and protective measures.

## 📈 Future Enhancements
- 📍 **Interactive Map**: Display AQI & WQI visually.
- 📡 **IoT Integration**: Real-time sensor data for better accuracy.
- 📊 **Predictive Analysis**: AI-powered forecasting of AQI & disasters.

---
🌱 *Stay Safe, Stay Aware!* 🌱

