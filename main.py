import streamlit as st
import folium
from streamlit_folium import folium_static
from datetime import datetime
import os

st.set_page_config(
    page_title="Environmental Monitor",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Import utility modules
from utils.api_client import OpenWeatherClient
from utils.visualization import create_metric_card, plot_prediction
from utils.predictions import predict_metrics

# Initialize API client
api_key = os.getenv("OPENWEATHER_API_KEY", "d427d53da26764be2dd72c78d662bbdf")
weather_client = OpenWeatherClient(api_key)

def main():
    st.title("🌍 Environmental Monitoring Dashboard")
    
    # Sidebar for location selection
    st.sidebar.title("Location Settings")
    lat = st.sidebar.number_input("Latitude", value=28.6139, step=0.0001)
    lon = st.sidebar.number_input("Longitude", value=77.2090, step=0.0001)
    
    try:
        # Fetch current data
        current_data = weather_client.get_current_data(lat, lon)
        
        # Create main dashboard layout
        col1, col2, col3 = st.columns(3)
        
        with col1:
            create_metric_card(
                "Air Quality",
                current_data['aqi'],
                "AQI",
                threshold=[50, 100]
            )
            
        with col2:
            create_metric_card(
                "Temperature",
                current_data['temp'],
                "°C",
                threshold=[20, 30]
            )
            
        with col3:
            create_metric_card(
                "Humidity",
                current_data['humidity'],
                "%",
                threshold=[30, 70]
            )
        
        # Create map
        st.subheader("Location Map")
        m = folium.Map(location=[lat, lon], zoom_start=10)
        folium.Marker(
            [lat, lon],
            popup="Selected Location",
            icon=folium.Icon(color='red', icon='info-sign')
        ).add_to(m)
        folium_static(m)
        
        # Predictions section
        st.subheader("7-Day Predictions")
        predictions = predict_metrics(current_data)
        plot_prediction(predictions)
        
        # Last updated timestamp
        st.sidebar.write(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        st.error(f"Error fetching data: {str(e)}")
        
if __name__ == "__main__":
    main()
