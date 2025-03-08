// Main JavaScript file for the application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Initialize popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    
    // Handle city search form submission
    const citySearchForm = document.getElementById('city-search-form');
    if (citySearchForm) {
        citySearchForm.addEventListener('submit', function(e) {
            const cityInput = document.getElementById('city-input');
            if (!cityInput.value.trim()) {
                e.preventDefault();
                showAlert('Please enter a city name', 'warning');
            }
        });
    }
    
    // Auto-fetch current location if available and user allows
    const fetchLocationBtn = document.getElementById('fetch-location');
    if (fetchLocationBtn) {
        fetchLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    // SOS form validation
    const sosForm = document.getElementById('sos-form');
    if (sosForm) {
        sosForm.addEventListener('submit', function(e) {
            if (!sosForm.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                showAlert('Please fill all required fields', 'danger');
            }
            sosForm.classList.add('was-validated');
        });
    }
    
    // Handle disaster filter on disaster map page
    const disasterFilters = document.querySelectorAll('.disaster-filter');
    if (disasterFilters.length > 0) {
        disasterFilters.forEach(filter => {
            filter.addEventListener('change', function() {
                const filterType = this.value;
                filterDisasters(filterType);
            });
        });
    }
    
    // Set active state for current page in sidebar
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Handle alert dismissal with fade effect
    const alertsClose = document.querySelectorAll('.alert .btn-close');
    alertsClose.forEach(btn => {
        btn.addEventListener('click', function() {
            const alert = this.closest('.alert');
            alert.classList.add('fade');
            setTimeout(() => {
                alert.style.display = 'none';
            }, 150);
        });
    });
});

// Function to get current location using browser geolocation
function getCurrentLocation() {
    const statusElement = document.getElementById('location-status');
    
    if (!navigator.geolocation) {
        showAlert('Geolocation is not supported by your browser', 'danger');
        return;
    }
    
    if (statusElement) {
        statusElement.textContent = 'Locating...';
        statusElement.className = 'text-info';
    }
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Reverse geocode to get city name
            fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=d427d53da26764be2dd72c78d662bbdf`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const cityName = data[0].name;
                        const cityInput = document.getElementById('city-input');
                        if (cityInput) {
                            cityInput.value = cityName;
                            if (statusElement) {
                                statusElement.textContent = `Located: ${cityName}`;
                                statusElement.className = 'text-success';
                            }
                            
                            // If we're on a page that needs immediate updating, submit the form
                            const autoUpdatePages = ['/', '/weather', '/air-quality', '/water-quality', '/deforestation', '/disaster-map'];
                            if (autoUpdatePages.includes(window.location.pathname)) {
                                document.getElementById('city-search-form').submit();
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error getting location name:', error);
                    if (statusElement) {
                        statusElement.textContent = 'Error getting location name';
                        statusElement.className = 'text-danger';
                    }
                });
        },
        function(error) {
            if (statusElement) {
                statusElement.textContent = `Error: ${getGeolocationErrorMessage(error)}`;
                statusElement.className = 'text-danger';
            }
            showAlert(getGeolocationErrorMessage(error), 'danger');
        }
    );
}

// Get readable error message for geolocation errors
function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "User denied the request for geolocation";
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable";
        case error.TIMEOUT:
            return "The request to get user location timed out";
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred";
        default:
            return "Error getting location";
    }
}

// Function to filter disaster markers on the map
function filterDisasters(filterType) {
    if (typeof updateMapMarkers === 'function') {
        updateMapMarkers(filterType);
    }
}

// Function to show alert messages
function showAlert(message, type = 'info') {
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertsContainer.appendChild(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            alertDiv.remove();
        }, 150);
    }, 5000);
}

// Function to update disaster counter in the navbar
function updateDisasterCounter(count) {
    const counterElement = document.getElementById('disaster-counter');
    if (counterElement) {
        counterElement.textContent = count;
        counterElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Function to copy emergency contact to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
        function() {
            showAlert('Contact copied to clipboard!', 'success');
        },
        function(err) {
            showAlert('Could not copy text: ' + err, 'danger');
        }
    );
}
