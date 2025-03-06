// Initialize socket connection (assuming you have a socket server on the backend)
const socket = io.connect('http://localhost:3000');

// Listen for new alerts and update the UI
socket.on('new-alert', (alert) => {
    const alertList = document.getElementById('alertList');
    const alertItem = document.createElement('li');
    alertItem.classList.add('alert-item');
    
    // Add alert type-specific class (e.g., warning, error)
    alertItem.classList.add(alert.type);
    
    alertItem.innerHTML = `
        <span class="alert-title">${alert.title}</span>
        <span class="alert-time">${alert.time}</span>
    `;
    
    alertList.appendChild(alertItem);
});

// Listen for real-time route suggestions and update the UI
socket.on('route-suggestions', (routes) => {
    console.log('Received route suggestions:', routes);  // Debugging: Log received routes
    const suggestionsList = document.getElementById('suggestedRoutes');
    suggestionsList.innerHTML = '';  // Clear previous suggestions

    // Loop through the routes and display them
    routes.forEach(route => {
        const li = document.createElement('li');
        li.textContent = `Route: ${route.start} to ${route.end} - ${route.description}`;
        suggestionsList.appendChild(li);
    });
});

// Simulating real-time alerts (for testing purposes)
function mockAlertData() {
    const alerts = [
        { title: 'Accident on Highway 5', type: 'error', time: '2 minutes ago' },
        { title: 'Weather delay on Route 22', type: 'warning', time: '10 minutes ago' },
        { title: 'Road closure on Main St.', type: 'error', time: '15 minutes ago' }
    ];

    alerts.forEach(alert => {
        socket.emit('new-alert', alert);
    });
}

// Mock the alerts every 10 seconds for testing
setInterval(mockAlertData, 10000);

// Simulating route suggestions (for testing purposes)
function mockRouteSuggestions() {
    const routes = [
        { start: 'Main St.', end: 'Route 22', description: 'Clear roads, no incidents.' },
        { start: 'Oak Rd.', end: 'Highway 5', description: 'Expect delays due to road work.' },
        { start: 'Broadway Ave.', end: 'Route 8', description: 'Accident-free route.' }
    ];

    // Emit route suggestions to the client
    socket.emit('route-suggestions', routes);
}

// Mock the route suggestions every 10 seconds
setInterval(mockRouteSuggestions, 10000);


// Function to handle the search input for specific location-based alerts
$('#locationSearch').on('input', function() {
    const searchText = $(this).val().toLowerCase();
    $('#alertList .alert-item').each(function() {
        const alertText = $(this).find('.alert-title').text().toLowerCase();
        if (alertText.includes(searchText)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

// Dummy map initialization (you can integrate Google Maps, Leaflet, etc.)
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12
    });

    // Add mock markers for incidents
    const incidents = [
        { lat: 37.7749, lng: -122.4194, title: 'Accident' },
        { lat: 37.8044, lng: -122.2711, title: 'Weather Delay' },
    ];

    incidents.forEach(incident => {
        new google.maps.Marker({
            position: { lat: incident.lat, lng: incident.lng },
            map: map,
            title: incident.title
        });
    });
}

// Load Google Maps (replace YOUR_API_KEY with your actual key)
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDkLQ8Ozu4jCC3qh_Kz8kGxm8iv330_ics&callback=initMap`;
    document.body.appendChild(script);
}

loadGoogleMapsAPI();
