import streamlit as st
import folium
from streamlit_folium import folium_static
from utils.api_client import OpenWeatherClient
from utils.visualization import create_metric_card, plot_prediction
import os

st.set_page_config(page_title="Air Quality Monitor", page_icon="💨", layout="wide")

def air_quality_page():
    st.title("💨 Air Quality Monitoring")
    
    api_key = os.getenv("OPENWEATHER_API_KEY", "d427d53da26764be2dd72c78d662bbdf")
    weather_client = OpenWeatherClient(api_key)
    
    # Location selection
    st.sidebar.title("Location Settings")
    lat = st.sidebar.number_input("Latitude", value=28.6139, step=0.0001)
    lon = st.sidebar.number_input("Longitude", value=77.2090, step=0.0001)
    
    try:
        data = weather_client.get_current_data(lat, lon)
        
        # Display current AQI
        st.header("Current Air Quality")
        create_metric_card("Air Quality Index", data['aqi'], "AQI", [50, 100])
        
        # Safety instructions based on AQI
        st.subheader("Safety Instructions")
        if data['aqi'] <= 50:
            st.success("Air quality is good. Perfect for outdoor activities!")
        elif data['aqi'] <= 100:
            st.warning("Moderate air quality. Sensitive individuals should limit outdoor exposure.")
        else:
            st.error("""
            Poor air quality! Safety measures:
            - Wear N95 masks outdoors
            - Limit outdoor activities
            - Keep windows closed
            - Use air purifiers indoors
            """)
        
        # Map visualization
        st.subheader("Air Quality Map")
        m = folium.Map(location=[lat, lon], zoom_start=10)
        folium.CircleMarker(
            location=[lat, lon],
            radius=30,
            popup=f"AQI: {data['aqi']}",
            color='red' if data['aqi'] > 100 else 'green',
            fill=True
        ).add_to(m)
        folium_static(m)
        
    except Exception as e:
        st.error(f"Error fetching air quality data: {str(e)}")

if __name__ == "__main__":
    air_quality_page()
