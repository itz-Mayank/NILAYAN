import streamlit as st
import folium
from streamlit_folium import folium_static
from utils.visualization import create_metric_card
import random

st.set_page_config(page_title="Water Quality Monitor", page_icon="💧", layout="wide")

def water_quality_page():
    st.title("💧 Water Quality Monitoring")
    
    # Location selection
    st.sidebar.title("Location Settings")
    lat = st.sidebar.number_input("Latitude", value=28.6139, step=0.0001)
    lon = st.sidebar.number_input("Longitude", value=77.2090, step=0.0001)
    
    try:
        # Simulated water quality metrics
        ph_level = random.uniform(6.5, 8.5)
        turbidity = random.uniform(0, 5)
        dissolved_oxygen = random.uniform(6, 10)
        
        # Display water quality metrics
        col1, col2, col3 = st.columns(3)
        
        with col1:
            create_metric_card("pH Level", ph_level, "pH", [6.5, 8.5])
        
        with col2:
            create_metric_card("Turbidity", turbidity, "NTU", [1, 5])
            
        with col3:
            create_metric_card("Dissolved Oxygen", dissolved_oxygen, "mg/L", [6, 8])
        
        # Safety instructions
        st.subheader("Water Quality Guidelines")
        st.info("""
        Safe drinking water parameters:
        - pH: 6.5-8.5
        - Turbidity: <1 NTU
        - Dissolved Oxygen: >6 mg/L
        
        If values exceed these ranges:
        - Boil water before consumption
        - Use water filtration systems
        - Contact local water authorities
        """)
        
        # Map visualization
        st.subheader("Water Quality Map")
        m = folium.Map(location=[lat, lon], zoom_start=10)
        folium.CircleMarker(
            location=[lat, lon],
            radius=30,
            popup=f"pH: {ph_level:.1f}",
            color='blue',
            fill=True
        ).add_to(m)
        folium_static(m)
        
    except Exception as e:
        st.error(f"Error in water quality monitoring: {str(e)}")

if __name__ == "__main__":
    water_quality_page()
