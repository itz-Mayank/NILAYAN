import numpy as np
from typing import Dict, List
from datetime import datetime, timedelta

def predict_metrics(current_data: Dict) -> Dict[str, List]:
    """Generate 7-day predictions based on current data"""
    # Initialize predictions with some variability
    days = 7
    dates = [(datetime.now() + timedelta(days=x)).strftime('%Y-%m-%d') for x in range(days)]
    
    # Add random variations to create realistic predictions
    temp_base = current_data['temp']
    humidity_base = current_data['humidity']
    aqi_base = current_data['aqi']
    
    temps = [temp_base + np.random.normal(0, 2) for _ in range(days)]
    humidity = [min(100, max(0, humidity_base + np.random.normal(0, 5))) for _ in range(days)]
    aqi = [max(1, min(5, aqi_base + np.random.normal(0, 0.5))) for _ in range(days)]
    
    return {
        'dates': dates,
        'temperature': temps,
        'humidity': humidity,
        'aqi': aqi
    }
