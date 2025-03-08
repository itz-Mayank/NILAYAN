import streamlit as st
import folium
from streamlit_folium import folium_static
from utils.api_client import OpenWeatherClient
from utils.visualization import create_metric_card, plot_prediction
from utils.predictions import predict_metrics
import os

st.set_page_config(page_title="Weather Monitor", page_icon="🌤️", layout="wide")

def weather_page():
    st.title("🌤️ Weather Monitoring")
    
    api_key = os.getenv("OPENWEATHER_API_KEY", "d427d53da26764be2dd72c78d662bbdf")
    weather_client = OpenWeatherClient(api_key)
    
    # Location selection
    st.sidebar.title("Location Settings")
    lat = st.sidebar.number_input("Latitude", value=28.6139, step=0.0001)
    lon = st.sidebar.number_input("Longitude", value=77.2090, step=0.0001)
    
    try:
        data = weather_client.get_current_data(lat, lon)
        
        # Current weather metrics
        col1, col2 = st.columns(2)
        
        with col1:
            create_metric_card("Temperature", data['temp'], "°C", [20, 30])
            
        with col2:
            create_metric_card("Humidity", data['humidity'], "%", [30, 70])
        
        # Weather description
        st.subheader("Current Conditions")
        st.write(f"Weather condition: {data['description'].capitalize()}")
        
        # Weather safety alerts
        st.subheader("Weather Alerts")
        if data['temp'] > 35:
            st.warning("""
            High temperature alert!
            - Stay hydrated
            - Avoid direct sunlight
            - Limit outdoor activities
            """)
        elif data['temp'] < 10:
            st.warning("""
            Low temperature alert!
            - Dress in warm layers
            - Watch for icy conditions
            - Protect water pipes
            """)
            
        # Weather map
        st.subheader("Weather Map")
        m = folium.Map(location=[lat, lon], zoom_start=10)
        folium.CircleMarker(
            location=[lat, lon],
            radius=30,
            popup=f"Temp: {data['temp']}°C",
            color='red' if data['temp'] > 30 else 'blue',
            fill=True
        ).add_to(m)
        folium_static(m)
        
        # Weather predictions
        st.subheader("7-Day Weather Forecast")
        predictions = predict_metrics(data)
        plot_prediction(predictions)
        
    except Exception as e:
        st.error(f"Error fetching weather data: {str(e)}")

if __name__ == "__main__":
    weather_page()
