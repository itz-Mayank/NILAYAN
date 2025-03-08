import requests
from typing import Dict, Any

class OpenWeatherClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "http://api.openweathermap.org/data/2.5"
        
    def get_current_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch current weather and air quality data"""
        try:
            # Fetch weather data
            weather_url = f"{self.base_url}/weather"
            weather_params = {
                "lat": lat,
                "lon": lon,
                "appid": self.api_key,
                "units": "metric"
            }
            weather_response = requests.get(weather_url, params=weather_params)
            weather_data = weather_response.json()
            
            # Fetch air quality data
            air_url = f"{self.base_url}/air_pollution"
            air_params = {
                "lat": lat,
                "lon": lon,
                "appid": self.api_key
            }
            air_response = requests.get(air_url, params=air_params)
            air_data = air_response.json()
            
            return {
                "temp": weather_data["main"]["temp"],
                "humidity": weather_data["main"]["humidity"],
                "aqi": air_data["list"][0]["main"]["aqi"],
                "description": weather_data["weather"][0]["description"]
            }
            
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch data from OpenWeather API: {str(e)}")
