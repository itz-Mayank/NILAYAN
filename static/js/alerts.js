// Alert system JavaScript for disaster notifications

// Global variables
let alertsData = [];
let alertsCheckInterval;
let alertSound;

// Initialize alerts system
function initAlerts() {
    // Create audio element for alert sounds
    alertSound = new Audio('https://bigsoundbank.com/UPLOAD/mp3/1482.mp3');
    
    // Start checking for new alerts
    startAlertChecking();
    
    // Register service worker for push notifications if supported
    registerServiceWorker();
}

// Start periodic checking for new alerts
function startAlertChecking() {
    // First check immediately
    checkForNewAlerts();
    
    // Then set interval (every 5 minutes)
    alertsCheckInterval = setInterval(checkForNewAlerts, 300000);
}

// Check for new alerts based on current location
function checkForNewAlerts() {
    // Get current location data from page (if available)
    const latElement = document.getElementById('lat');
    const lonElement = document.getElementById('lon');
    
    if (!latElement || !lonElement) return;
    
    const lat = latElement.value;
    const lon = lonElement.value;
    
    // Fetch alerts for this location
    fetch(`/api/disasters/${lat}/${lon}?radius=500`)
        .then(response => response.json())
        .then(data => {
            processNewAlerts(data);
        })
        .catch(error => {
            console.error('Error fetching alerts:', error);
        });
}

// Process new alerts and show notifications for them
function processNewAlerts(newAlerts) {
    // If it's the first check, just save the current state
    if (alertsData.length === 0) {
        alertsData = newAlerts;
        return;
    }
    
    // Check for new alerts (not in our current data)
    const newAlertIds = newAlerts.map(alert => alert.id);
    const existingAlertIds = alertsData.map(alert => alert.id);
    
    // Find completely new alerts
    const brandNewAlerts = newAlerts.filter(alert => 
        !existingAlertIds.includes(alert.id) && alert.status === 'active'
    );
    
    // Notify for each new alert
    if (brandNewAlerts.length > 0) {
        notifyNewAlerts(brandNewAlerts);
    }
    
    // Update our stored data
    alertsData = newAlerts;
    
    // Update the UI counter for active alerts
    const activeAlerts = newAlerts.filter(alert => alert.status === 'active');
    if (typeof updateDisasterCounter === 'function') {
        updateDisasterCounter(activeAlerts.length);
    }
}

// Notify the user about new alerts
function notifyNewAlerts(alerts) {
    // Play sound if allowed
    if (alertSound) {
        alertSound.play().catch(e => console.log('Alert sound playback prevented'));
    }
    
    // Create notification element
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;
    
    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${getSeverityClass(alert.severity)} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        
        alertDiv.innerHTML = `
            <strong>New ${alert.type} Alert!</strong> ${alert.description}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertsContainer.appendChild(alertDiv);
        
        // Browser notification if permitted
        showBrowserNotification(alert);
    });
}

// Show browser notification
function showBrowserNotification(alert) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        createNotification(alert);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                createNotification(alert);
            }
        });
    }
}

// Create browser notification
function createNotification(alert) {
    const notification = new Notification(`${alert.type} Alert - ${getSeverityLabel(alert.severity)}`, {
        body: alert.description,
        icon: '/static/img/alert-icon.svg', // This would be a placeholder as we're not generating binary files
        tag: `disaster-${alert.id}`,
        vibrate: [200, 100, 200]
    });
    
    notification.onclick = function() {
        window.open('/disaster-map');
    };
}

// Register service worker for push notifications
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/js/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

// Get severity class for bootstrap alerts
function getSeverityClass(severity) {
    switch(severity) {
        case 'low': return 'success';
        case 'medium': return 'warning';
        case 'high': return 'danger';
        case 'critical': return 'dark';
        default: return 'info';
    }
}

// Get human-readable severity label
function getSeverityLabel(severity) {
    switch(severity) {
        case 'low': return 'Minor';
        case 'medium': return 'Moderate';
        case 'high': return 'Severe';
        case 'critical': return 'Critical';
        default: return 'Unknown';
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    initAlerts();
});
