// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Enable tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Create time series graphs if data is available
    if (typeof timeSeriesData !== 'undefined') {
        createTimeSeriesGraphs(timeSeriesData);
    }
});

// Create time series graphs using Plotly.js
function createTimeSeriesGraphs(data) {
    // AQI Trend Chart
    const aqiTrace = {
        x: data.dates,
        y: data.aqi,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Air Quality Index',
        line: {
            color: '#43a047',
            width: 3
        },
        marker: {
            size: 8
        }
    };

    const aqiLayout = {
        title: 'Air Quality Trends',
        xaxis: {
            title: 'Date',
            showgrid: true,
            gridwidth: 1,
            gridcolor: '#f5f5f5'
        },
        yaxis: {
            title: 'AQI Level',
            showgrid: true,
            gridwidth: 1,
            gridcolor: '#f5f5f5'
        },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        margin: { t: 40, r: 20, l: 40, b: 40 }
    };

    Plotly.newPlot('aqiTrendChart', [aqiTrace], aqiLayout, {responsive: true});

    // Temperature Trend Chart
    const tempTrace = {
        x: data.dates,
        y: data.temperatures,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Temperature',
        line: {
            color: '#e53935',
            width: 3
        },
        marker: {
            size: 8
        }
    };

    const humidityTrace = {
        x: data.dates,
        y: data.humidity,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Humidity',
        line: {
            color: '#1e88e5',
            width: 3,
            dash: 'dot'
        },
        marker: {
            size: 8
        },
        yaxis: 'y2'
    };

    const tempLayout = {
        title: 'Climate Indicators',
        xaxis: {
            title: 'Date',
            showgrid: true,
            gridwidth: 1,
            gridcolor: '#f5f5f5'
        },
        yaxis: {
            title: 'Temperature (°C)',
            showgrid: true,
            gridwidth: 1,
            gridcolor: '#f5f5f5'
        },
        yaxis2: {
            title: 'Humidity (%)',
            overlaying: 'y',
            side: 'right'
        },
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        margin: { t: 40, r: 60, l: 40, b: 40 },
        showlegend: true,
        legend: {
            x: 0,
            y: 1.2,
            orientation: 'h'
        }
    };

    Plotly.newPlot('tempTrendChart', [tempTrace, humidityTrace], tempLayout, {responsive: true});
}

// Format numbers with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Update metrics with fade animation
function updateMetric(elementId, value, unit = '') {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = `${value}${unit}`;
            element.style.opacity = '1';
        }, 200);
    }
}