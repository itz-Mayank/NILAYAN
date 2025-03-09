// Charts JavaScript for data visualization

// Create temperature chart
function createTemperatureChart(dates, temperatures) {
    const ctx = document.getElementById('temperature-chart');
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Create air quality chart
function createAQIChart(dates, aqiData) {
    const ctx = document.getElementById('aqi-chart');
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Air Quality Index',
                data: aqiData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            let label = context.dataset.label || '';
                            label += ': ' + value;
                            
                            // Add AQI category
                            if (value <= 50) label += ' (Good)';
                            else if (value <= 100) label += ' (Moderate)';
                            else if (value <= 150) label += ' (Unhealthy for Sensitive Groups)';
                            else if (value <= 200) label += ' (Unhealthy)';
                            else if (value <= 300) label += ' (Very Unhealthy)';
                            else label += ' (Hazardous)';
                            
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    // Custom grid lines at AQI category boundaries
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 50 || 
                                context.tick.value === 100 || 
                                context.tick.value === 150 || 
                                context.tick.value === 200 || 
                                context.tick.value === 300) {
                                return 'rgba(255, 0, 0, 0.3)';
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        }
                    }
                }
            }
        }
    });
}

// Create humidity chart
function createHumidityChart(dates, humidityData) {
    const ctx = document.getElementById('humidity-chart');
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Humidity (%)',
                data: humidityData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Create pollutants chart
function createPollutantsChart(dates, pollutantsData) {
    const ctx = document.getElementById('pollutants-chart');
    if (!ctx) return;
    
    const datasets = [];
    const colors = {
        'pm25': { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
        'pm10': { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
        'no2': { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
        'so2': { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
        'co': { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
        'o3': { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' }
    };
    
    const labels = {
        'pm25': 'PM2.5 (μg/m³)',
        'pm10': 'PM10 (μg/m³)',
        'no2': 'NO₂ (μg/m³)',
        'so2': 'SO₂ (μg/m³)',
        'co': 'CO (mg/m³)',
        'o3': 'O₃ (μg/m³)'
    };
    
    for (const [key, values] of Object.entries(pollutantsData)) {
        datasets.push({
            label: labels[key] || key,
            data: values,
            backgroundColor: colors[key]?.bg || 'rgba(0, 0, 0, 0.2)',
            borderColor: colors[key]?.border || 'rgba(0, 0, 0, 1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3
        });
    }
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create deforestation chart
function createDeforestationChart(dates, data, labels = ['Forest Cover Change (%)']) {
    const ctx = document.getElementById('deforestation-chart');
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: labels[0],
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Create water quality chart
function createWaterQualityChart(dates, ph, turbidity, dissolvedOxygen) {
    const ctx = document.getElementById('water-quality-chart');
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'pH',
                    data: ph,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    yAxisID: 'pH'
                },
                {
                    label: 'Turbidity (NTU)',
                    data: turbidity,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    yAxisID: 'turbidity'
                },
                {
                    label: 'Dissolved Oxygen (mg/L)',
                    data: dissolvedOxygen,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    yAxisID: 'do'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                'pH': {
                    type: 'linear',
                    position: 'left',
                    min: 6,
                    max: 9,
                    title: {
                        display: true,
                        text: 'pH'
                    }
                },
                'turbidity': {
                    type: 'linear',
                    position: 'right',
                    min: 0,
                    max: 10,
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Turbidity (NTU)'
                    }
                },
                'do': {
                    type: 'linear',
                    position: 'right',
                    min: 0,
                    max: 14,
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'DO (mg/L)'
                    }
                }
            }
        }
    });
}

// Create gauge chart for single value visualization
function createGaugeChart(elementId, value, maxValue, label, colorRanges) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    
    // Calculate percentage for gauge
    const percentage = (value / maxValue) * 100;
    
    // Determine color based on ranges
    let color = '#4caf50'; // Default green
    for (const range of colorRanges) {
        if (percentage >= range.min && percentage <= range.max) {
            color = range.color;
            break;
        }
    }
    
    // Create the chart
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: [color, '#f5f5f5'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: '80%',
            circumference: 180,
            rotation: 270,
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: label,
                    position: 'bottom'
                }
            },
            animation: {
                animateRotate: true,
                animateScale: false
            }
        },
        plugins: [{
            id: 'gaugeText',
            afterDraw: (chart) => {
                const { ctx, width, height } = chart;
                const centerX = width / 2;
                const centerY = height - (height / 3);
                ctx.restore();
                
                // Display value
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = color;
                ctx.fillText(value, centerX, centerY);
                
                // Display unit
                ctx.font = '14px Arial';
                ctx.fillStyle = '#666';
                ctx.fillText(maxValue === 100 ? '%' : '', centerX, centerY + 25);
                
                ctx.save();
            }
        }]
    });
}

// Create sustainability metrics radar chart
function createSustainabilityChart(data) {
    const ctx = document.getElementById('sustainability-chart');
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Forest Cover', 
                'Renewable Energy', 
                'Waste Recycled', 
                'Carbon Footprint (Inverted)'
            ],
            datasets: [{
                label: 'Sustainability Metrics',
                data: [
                    data.forest_cover,
                    data.renewable_energy,
                    data.waste_recycled,
                    100 - (data.carbon_footprint * 6) // Invert and scale
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const value = context.raw;
                            
                            if (index === 3) { // Carbon Footprint
                                // Convert the inverted scale back to original value
                                const originalValue = (100 - value) / 6;
                                return `Carbon Footprint: ${originalValue.toFixed(1)} tons per capita`;
                            }
                            
                            return `${context.chart.data.labels[index]}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}
