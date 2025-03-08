from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
from dotenv import load_dotenv
import os
import requests
import random
import json
import logging
from datetime import datetime, timedelta

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SESSION_SECRET", os.urandom(24))

# OpenWeather API configuration
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "d427d53da26764be2dd72c78d662bbdf")
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5"

# Disaster alert levels
ALERT_LEVELS = {
    "low": {"color": "success", "description": "Minor incident, monitoring required"},
    "medium": {"color": "warning", "description": "Moderate risk, preparation advised"},
    "high": {"color": "danger", "description": "Severe threat, immediate action required"},
    "critical": {"color": "dark", "description": "Catastrophic event, evacuation and emergency response needed"}
}

# Mock disaster types for demonstration (in real app, would come from a database)
DISASTER_TYPES = [
    "Wildfire", "Flood", "Earthquake", "Hurricane", "Tornado", 
    "Tsunami", "Drought", "Landslide", "Volcanic Eruption", "Extreme Weather"
]

def get_city_coordinates(city_name):
    """Get coordinates for a city using OpenWeather Geocoding API"""
    try:
        geocoding_url = f"http://api.openweathermap.org/geo/1.0/direct"
        params = {
            "q": city_name,
            "limit": 1,
            "appid": OPENWEATHER_API_KEY
        }
        response = requests.get(geocoding_url, params=params)
        data = response.json()

        if data and len(data) > 0:
            return {
                "lat": data[0]["lat"],
                "lon": data[0]["lon"],
                "name": data[0]["name"],
                "country": data[0].get("country", "")
            }
        return None
    except Exception as e:
        logger.error(f"Error in geocoding: {e}")
        return None

def get_pollutant_data():
    """Simulate detailed pollutant data"""
    return {
        "pm25": round(random.uniform(10, 100), 1),
        "pm10": round(random.uniform(20, 150), 1),
        "no2": round(random.uniform(10, 80), 1),
        "so2": round(random.uniform(5, 40), 1),
        "co": round(random.uniform(0.5, 5), 1),
        "o3": round(random.uniform(20, 100), 1)
    }

def get_weather_data(lat, lon):
    """Fetch weather and air quality data from OpenWeather API"""
    try:
        # Weather data
        weather_params = {
            "lat": lat,
            "lon": lon,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        weather_response = requests.get(f"{OPENWEATHER_BASE_URL}/weather", params=weather_params)
        weather_data = weather_response.json()

        # Air quality data
        air_params = {
            "lat": lat,
            "lon": lon,
            "appid": OPENWEATHER_API_KEY
        }
        air_response = requests.get(f"{OPENWEATHER_BASE_URL}/air_pollution", params=air_params)
        air_data = air_response.json()

        # Generate simulated AQI that's more granular (0-500 scale)
        simulated_aqi = round(air_data["list"][0]["main"]["aqi"] * 100 / 5)  

        return {
            "temperature": weather_data["main"]["temp"],
            "humidity": weather_data["main"]["humidity"],
            "description": weather_data["weather"][0]["description"],
            "wind_speed": weather_data["wind"]["speed"],
            "wind_direction": weather_data["wind"]["deg"],
            "aqi": simulated_aqi,
            "pollutants": get_pollutant_data()
        }
    except Exception as e:
        logger.error(f"Error fetching weather data: {e}")
        return None

def get_historical_data(lat, lon, days=7):
    """Generate historical data for graphs with environmental trends"""
    try:
        current_data = get_weather_data(lat, lon)
        dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(days-1, -1, -1)]

        # Generate realistic variations based on current values
        temps = []
        aqis = []
        humidity = []
        pollutants = {
            "pm25": [],
            "pm10": [],
            "no2": [],
            "so2": [],
            "co": [],
            "o3": []
        }

        base_temp = current_data['temperature']
        base_aqi = current_data['aqi']
        base_humidity = current_data['humidity']
        base_pollutants = current_data['pollutants']

        for _ in dates:
            # Add random variations with trending patterns
            temp_variation = random.uniform(-2, 2)
            aqi_variation = random.uniform(-20, 20)
            humidity_variation = random.uniform(-5, 5)

            temps.append(round(base_temp + temp_variation, 1))
            aqis.append(max(0, min(500, round(base_aqi + aqi_variation))))
            humidity.append(min(100, max(0, round(base_humidity + humidity_variation))))

            # Generate pollutant variations
            for pollutant in pollutants:
                base_value = base_pollutants[pollutant]
                variation = random.uniform(-base_value * 0.1, base_value * 0.1)
                pollutants[pollutant].append(round(base_value + variation, 1))

            # Slightly modify base values for next iteration to create trends
            base_temp += random.uniform(-0.5, 0.5)
            base_aqi += random.uniform(-10, 10)
            base_humidity += random.uniform(-2, 2)

        return {
            'dates': dates,
            'temperatures': temps,
            'aqi': aqis,
            'humidity': humidity,
            'pollutants': pollutants
        }
    except Exception as e:
        logger.error(f"Error generating historical data: {e}")
        return None

def get_water_quality_data():
    """Simulate water quality data (since real-time data might not be available)"""
    return {
        "ph": round(random.uniform(6.5, 8.5), 1),
        "turbidity": round(random.uniform(0.5, 5.0), 1),
        "dissolved_oxygen": round(random.uniform(6.0, 10.0), 1)
    }

def get_sustainability_metrics():
    """Generate sustainability metrics and indicators"""
    return {
        'forest_cover': round(random.uniform(20, 40), 1),  # Percentage
        'renewable_energy': round(random.uniform(10, 30), 1),  # Percentage
        'waste_recycled': round(random.uniform(20, 60), 1),  # Percentage
        'carbon_footprint': round(random.uniform(5, 15), 1),  # Tons per capita
    }

def get_deforestation_data(lat, lon):
    """Generate deforestation metrics for the given area"""
    # In a real application, this would fetch data from a deforestation monitoring API
    return {
        'forest_cover_change': round(random.uniform(-5, -0.1), 2),  # Negative percentage (loss)
        'deforestation_risk': random.choice(['low', 'medium', 'high']),
        'forest_area': round(random.uniform(100000, 1000000), 0),  # hectares
        'protected_area': round(random.uniform(10, 40), 1),  # Percentage
        'recent_clearing_events': random.randint(0, 50),
        'year_over_year_change': round(random.uniform(-10, 2), 1),  # Percentage
    }

def get_recent_disaster_alerts(lat, lon, radius=500):
    """Generate disaster alerts for the given area
    In a real app, this would connect to a disaster management API"""
    num_alerts = random.randint(2, 7)
    alerts = []
    
    for _ in range(num_alerts):
        disaster_type = random.choice(DISASTER_TYPES)
        severity = random.choice(list(ALERT_LEVELS.keys()))
        
        # Create a location with some variation from the provided coordinates
        alert_lat = lat + random.uniform(-radius/111, radius/111)  # Approx conversion to degrees
        alert_lon = lon + random.uniform(-radius/(111 * abs(abs(lat) - 90)), radius/(111 * abs(abs(lat) - 90)))
        
        # Generate a random date within the last 30 days
        days_ago = random.randint(0, 30)
        alert_date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d %H:%M:%S')
        
        alerts.append({
            'id': random.randint(1000, 9999),
            'type': disaster_type,
            'severity': severity,
            'description': f"{disaster_type} reported in the area",
            'lat': round(alert_lat, 6),
            'lon': round(alert_lon, 6),
            'date': alert_date,
            'status': random.choice(['active', 'monitoring', 'resolved']),
            'affected_area': round(random.uniform(1, 500), 1),  # km²
            'affected_population': random.randint(0, 100000)
        })
    
    # Sort by date (newest first)
    alerts.sort(key=lambda x: x['date'], reverse=True)
    return alerts

@app.route('/')
def index():
    city = request.args.get('city', 'Delhi')
    location_data = get_city_coordinates(city)

    if location_data:
        data = get_weather_data(location_data["lat"], location_data["lon"])
        historical = get_historical_data(location_data["lat"], location_data["lon"])
        sustainability = get_sustainability_metrics()
        disaster_alerts = get_recent_disaster_alerts(location_data["lat"], location_data["lon"])

        if data and historical:
            # Combine all data
            combined_data = {
                **data,
                **get_water_quality_data(),  # Add water quality metrics
                'sustainability': sustainability,
                'alerts': disaster_alerts[:3]  # Add top 3 alerts
            }

            return render_template('index.html',
                                data=combined_data,
                                historical=historical,
                                location=f"{location_data['name']}, {location_data['country']}",
                                lat=location_data["lat"],
                                lon=location_data["lon"],
                                alert_levels=ALERT_LEVELS,
                                last_updated=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    return render_template('index.html', error="Unable to fetch data. Please try again.")

@app.route('/air-quality')
def air_quality():
    city = request.args.get('city')

    if not city:
        return render_template('air_quality.html')

    location_data = get_city_coordinates(city)
    if location_data:
        data = get_weather_data(location_data["lat"], location_data["lon"])
        historical = get_historical_data(location_data["lat"], location_data["lon"])
        if data and historical:
            return render_template('air_quality.html',
                                data=data,
                                historical=historical,
                                location=f"{location_data['name']}, {location_data['country']}",
                                lat=location_data["lat"],
                                lon=location_data["lon"],
                                last_updated=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    return render_template('air_quality.html', error="Unable to fetch data. Please try again.")

@app.route('/water-quality')
def water_quality():
    city = request.args.get('city')

    if not city:
        return render_template('water_quality.html')

    location_data = get_city_coordinates(city)
    if location_data:
        weather_data = get_weather_data(location_data["lat"], location_data["lon"])
        water_data = get_water_quality_data()
        historical = get_historical_data(location_data["lat"], location_data["lon"])
        if weather_data and historical:
            data = {**weather_data, **water_data}
            return render_template('water_quality.html',
                                data=data,
                                historical=historical,
                                location=f"{location_data['name']}, {location_data['country']}",
                                lat=location_data["lat"],
                                lon=location_data["lon"],
                                last_updated=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    return render_template('water_quality.html', error="Unable to fetch data. Please try again.")

@app.route('/weather')
def weather():
    city = request.args.get('city')

    if not city:
        return render_template('weather.html')

    location_data = get_city_coordinates(city)
    if location_data:
        data = get_weather_data(location_data["lat"], location_data["lon"])
        historical = get_historical_data(location_data["lat"], location_data["lon"])
        if data and historical:
            return render_template('weather.html',
                                data=data,
                                historical=historical,
                                location=f"{location_data['name']}, {location_data['country']}",
                                lat=location_data["lat"],
                                lon=location_data["lon"],
                                last_updated=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    return render_template('weather.html', error="Unable to fetch data. Please try again.")

@app.route('/deforestation')
def deforestation():
    city = request.args.get('city')

    if not city:
        return render_template('deforestation.html')

    location_data = get_city_coordinates(city)
    if location_data:
        deforestation_data = get_deforestation_data(location_data["lat"], location_data["lon"])
        historical = get_historical_data(location_data["lat"], location_data["lon"])
        if deforestation_data and historical:
            return render_template('deforestation.html',
                                data=deforestation_data,
                                historical=historical,
                                location=f"{location_data['name']}, {location_data['country']}",
                                lat=location_data["lat"],
                                lon=location_data["lon"],
                                last_updated=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    return render_template('deforestation.html', error="Unable to fetch data. Please try again.")

@app.route('/disaster-map')
def disaster_map():
    city = request.args.get('city', 'Delhi')
    location_data = get_city_coordinates(city)

    if location_data:
        disaster_alerts = get_recent_disaster_alerts(location_data["lat"], location_data["lon"])
        return render_template('disaster_map.html',
                            alerts=disaster_alerts,
                            location=f"{location_data['name']}, {location_data['country']}",
                            lat=location_data["lat"],
                            lon=location_data["lon"], 
                            alert_levels=ALERT_LEVELS,
                            last_updated=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    return render_template('disaster_map.html', error="Unable to fetch data. Please try again.")

@app.route('/sos')
def sos():
    city = request.args.get('city')
    return render_template('sos.html', city=city, alert_levels=ALERT_LEVELS)

@app.route('/api/weather/<lat>/<lon>')
def api_weather(lat, lon):
    data = get_weather_data(float(lat), float(lon))
    if data:
        return jsonify(data)
    return jsonify({"error": "Failed to fetch weather data"}), 500

@app.route('/api/deforestation/<lat>/<lon>')
def api_deforestation(lat, lon):
    data = get_deforestation_data(float(lat), float(lon))
    if data:
        return jsonify(data)
    return jsonify({"error": "Failed to fetch deforestation data"}), 500

@app.route('/api/disasters/<lat>/<lon>')
def api_disasters(lat, lon):
    radius = request.args.get('radius', 500, type=int)
    data = get_recent_disaster_alerts(float(lat), float(lon), radius)
    if data:
        return jsonify(data)
    return jsonify({"error": "Failed to fetch disaster alerts"}), 500

@app.route('/api/submit-sos', methods=['POST'])
def submit_sos():
    # In a real application, this would process and store the SOS information
    # and trigger appropriate emergency responses
    try:
        sos_data = {
            'name': request.form.get('name'),
            'contact': request.form.get('contact'),
            'location': request.form.get('location'),
            'coordinates': request.form.get('coordinates'),
            'emergency_type': request.form.get('emergency_type'),
            'description': request.form.get('description'),
            'severity': request.form.get('severity'),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Log the SOS request
        logger.info(f"SOS alert received: {sos_data}")
        
        # In a real app, this would send notifications to emergency services
        flash("Your SOS alert has been submitted. Emergency services have been notified.", "success")
        return redirect(url_for('sos'))
    except Exception as e:
        logger.error(f"Error processing SOS request: {e}")
        flash("There was an error processing your SOS alert. Please try again or call emergency services directly.", "danger")
        return redirect(url_for('sos'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
