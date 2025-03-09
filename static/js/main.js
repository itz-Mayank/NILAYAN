// Map related JavaScript for disaster visualization

// Global variables
let map;
let markers = [];
let allDisasters = [];
let currentFilter = 'all';

// Initialize the map
function initMap(lat, lon, zoom = 10) {
    // Create a map centered at the provided coordinates
    map = L.map('disaster-map').setView([lat, lon], zoom);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add scale control
    L.control.scale().addTo(map);
    
    // Load disasters data
    loadDisasterData(lat, lon);
}

// Load disaster data from the API
function loadDisasterData(lat, lon, radius = 500) {
    fetch(`/api/disasters/${lat}/${lon}?radius=${radius}`)
        .then(response => response.json())
        .then(data => {
            allDisasters = data;
            renderDisasters(data);
            updateDisastersList(data);
            
            // Update the disaster counter in navbar
            if (typeof updateDisasterCounter === 'function') {
                updateDisasterCounter(data.filter(d => d.status === 'active').length);
            }
        })
        .catch(error => {
            console.error('Error fetching disaster data:', error);
            showAlert('Failed to load disaster data', 'danger');
        });
}

// Render disaster markers on the map
function renderDisasters(disasters) {
    // Clear existing markers
    clearMarkers();
    
    // Create new markers for each disaster
    disasters.forEach(disaster => {
        // Skip if filtered out
        if (currentFilter !== 'all' && disaster.severity !== currentFilter && 
            disaster.type !== currentFilter && disaster.status !== currentFilter) {
            return;
        }
        
        // Choose marker color based on severity
        const markerColor = getMarkerColor(disaster.severity);
        
        // Create custom icon
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor};" class="marker-pin"></div><i class="fa ${getDisasterIcon(disaster.type)}"></i>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        
        // Create marker
        const marker = L.marker([disaster.lat, disaster.lon], {icon: icon})
            .addTo(map)
            .bindPopup(createMarkerPopup(disaster));
        
        // Add to markers array
        markers.push(marker);
    });
}

// Clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
}

// Update the list of disasters in the sidebar
function updateDisastersList(disasters) {
    const listElement = document.getElementById('disasters-list');
    if (!listElement) return;
    
    // Sort by date (newest first)
    disasters.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear existing list
    listElement.innerHTML = '';
    
    // Add disasters to list
    disasters.forEach(disaster => {
        const listItem = document.createElement('div');
        listItem.className = 'card mb-2';
        
        const severityClass = `border-${getSeverityColor(disaster.severity)}`;
        listItem.classList.add(severityClass);
        
        listItem.innerHTML = `
            <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="card-title mb-1">${disaster.type}</h6>
                    <span class="badge bg-${getSeverityColor(disaster.severity)}">${disaster.severity}</span>
                </div>
                <p class="card-text small mb-1">${disaster.description}</p>
                <div class="d-flex justify-content-between">
                    <small class="text-muted">${formatDate(disaster.date)}</small>
                    <button class="btn btn-sm btn-outline-primary" onclick="panToDisaster(${disaster.lat}, ${disaster.lon})">
                        View
                    </button>
                </div>
            </div>
        `;
        
        listElement.appendChild(listItem);
    });
    
    // Show empty state if no disasters
    if (disasters.length === 0) {
        listElement.innerHTML = '<div class="alert alert-info">No disaster alerts in this area</div>';
    }
}

// Pan the map to a specific disaster
function panToDisaster(lat, lon) {
    map.setView([lat, lon], 13);
    
    // Find and open the popup for this location
    markers.forEach(marker => {
        const position = marker.getLatLng();
        if (position.lat === lat && position.lng === lon) {
            marker.openPopup();
        }
    });
}

// Update markers based on filter
function updateMapMarkers(filterType) {
    currentFilter = filterType;
    renderDisasters(allDisasters);
    
    // Also update the list
    if (filterType === 'all') {
        updateDisastersList(allDisasters);
    } else {
        const filtered = allDisasters.filter(d => 
            d.severity === filterType || d.type === filterType || d.status === filterType
        );
        updateDisastersList(filtered);
    }
}

// Helper function to get marker color based on severity
function getMarkerColor(severity) {
    switch(severity) {
        case 'low': return '#28a745';
        case 'medium': return '#ffc107';
        case 'high': return '#dc3545';
        case 'critical': return '#212529';
        default: return '#0d6efd';
    }
}

// Helper function to get severity bootstrap color
function getSeverityColor(severity) {
    switch(severity) {
        case 'low': return 'success';
        case 'medium': return 'warning';
        case 'high': return 'danger';
        case 'critical': return 'dark';
        default: return 'primary';
    }
}

// Helper function to get appropriate icon for disaster type
function getDisasterIcon(type) {
    switch(type.toLowerCase()) {
        case 'wildfire': return 'fa-fire';
        case 'flood': return 'fa-water';
        case 'earthquake': return 'fa-house-damage';
        case 'hurricane': return 'fa-wind';
        case 'tornado': return 'fa-tornado';
        case 'tsunami': return 'fa-water';
        case 'drought': return 'fa-sun';
        case 'landslide': return 'fa-mountain';
        case 'volcanic eruption': return 'fa-mountain';
        case 'extreme weather': return 'fa-cloud-showers-heavy';
        default: return 'fa-exclamation-triangle';
    }
}

// Create HTML for marker popup
function createMarkerPopup(disaster) {
    return `
        <div class="disaster-popup">
            <h5>${disaster.type}</h5>
            <p>${disaster.description}</p>
            <div class="mb-2">
                <span class="badge bg-${getSeverityColor(disaster.severity)}">
                    ${disaster.severity.toUpperCase()}
                </span>
                <span class="badge bg-secondary">${disaster.status}</span>
            </div>
            <p class="mb-0"><strong>Date:</strong> ${formatDate(disaster.date)}</p>
            <p class="mb-0"><strong>Affected Area:</strong> ${disaster.affected_area} km²</p>
            <p class="mb-0"><strong>Affected Population:</strong> ${disaster.affected_population.toLocaleString()}</p>
            <div class="mt-2">
                <button class="btn btn-sm btn-primary" onclick="window.location.href='/sos'">
                    Request Help
                </button>
            </div>
        </div>
    `;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
