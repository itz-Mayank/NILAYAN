import streamlit as st
import plotly.graph_objects as go
from typing import List, Dict

def create_metric_card(title: str, value: float, unit: str, threshold: List[float]):
    """Create a metric card with color coding based on thresholds"""
    if value < threshold[0]:
        color = "green"
        status = "Good"
    elif value < threshold[1]:
        color = "orange"
        status = "Moderate"
    else:
        color = "red"
        status = "Poor"
        
    st.markdown(
        f"""
        <div style="
            padding: 20px;
            border-radius: 10px;
            background-color: {color}20;
            border: 2px solid {color}">
            <h3>{title}</h3>
            <h2>{value:.1f} {unit}</h2>
            <p>Status: {status}</p>
        </div>
        """,
        unsafe_allow_html=True
    )

def plot_prediction(predictions: Dict):
    """Create prediction plots using Plotly"""
    # Temperature prediction
    fig_temp = go.Figure()
    fig_temp.add_trace(go.Scatter(
        x=predictions['dates'],
        y=predictions['temperature'],
        mode='lines+markers',
        name='Temperature'
    ))
    fig_temp.update_layout(
        title='Temperature Forecast',
        xaxis_title='Date',
        yaxis_title='Temperature (°C)'
    )
    st.plotly_chart(fig_temp)
    
    # AQI prediction
    fig_aqi = go.Figure()
    fig_aqi.add_trace(go.Scatter(
        x=predictions['dates'],
        y=predictions['aqi'],
        mode='lines+markers',
        name='Air Quality Index'
    ))
    fig_aqi.update_layout(
        title='Air Quality Forecast',
        xaxis_title='Date',
        yaxis_title='AQI'
    )
    st.plotly_chart(fig_aqi)
