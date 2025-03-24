// Initialize when document is ready
$(document).ready(function() {
    // Initialize Select2 dropdowns
    $('.select2-dropdown').select2({
        width: '100%',
        placeholder: function() {
            return $(this).data('placeholder');
        }
    });

    // Initialize the map
    initMap();

    // Mobile menu toggle
    $('.menu-toggle').on('click', function() {
        $('.sidebar').toggleClass('active');
    });

    // Search button click handler
    $('#searchBtn').on('click', function() {
        const origin = $('#originSearch').val();
        const destination = $('#destinationSearch').val();
        
        if (!origin || !destination) {
            alert('Please select both origin and destination');
            return;
        }
        
        // In a real app, this would call an API to get route data
        // For demo purposes, we'll simulate finding a route
        findRoute(origin, destination);
    });

    // Refresh alerts button
    $('#refreshAlerts').on('click', function() {
        $(this).addClass('rotating');
        // Simulate refreshing alerts
        setTimeout(() => {
            loadMockAlerts();
            $(this).removeClass('rotating');
        }, 1000);
    });

    // Filter map incidents
    $('#mapViewSelect').on('change', function() {
        const filter = $(this).val();
        filterMapIncidents(filter);
    });

    // Load initial data
    loadMockAlerts();
    loadMockRoutes();
});

// Initialize the map using Leaflet.js with OpenStreetMap
function initMap() {
    // Create a map centered on a default location
    const map = L.map('map').setView([28.6139, 77.2090], 12); // Default to Delhi

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Store the map in a global variable for later use
    window.trafficMap = map;

    // Add mock incidents to the map
    addMockIncidents(map);
}

// Add mock incidents to the map
function addMockIncidents(map) {
    const incidents = [
        { lat: 28.6139, lng: 77.2090, title: 'Accident', type: 'accident', description: 'Multi-vehicle collision' },
        { lat: 28.6229, lng: 77.2080, title: 'Road Work', type: 'roadwork', description: 'Lane closure due to construction' },
        { lat: 28.6339, lng: 77.2190, title: 'Heavy Traffic', type: 'congestion', description: 'Slow moving traffic' },
        { lat: 28.6039, lng: 77.2290, title: 'Accident', type: 'accident', description: 'Vehicle breakdown' },
        { lat: 28.6239, lng: 77.1990, title: 'Road Closure', type: 'roadwork', description: 'Complete road closure' }
    ];

    // Create a marker for each incident
    incidents.forEach(incident => {
        // Choose icon based on incident type
        let iconUrl = '';
        let iconColor = '';
        
        switch(incident.type) {
            case 'accident':
                iconColor = '#dc3545'; // Red
                break;
            case 'roadwork':
                iconColor = '#fd7e14'; // Orange
                break;
            case 'congestion':
                iconColor = '#ffc107'; // Yellow
                break;
            default:
                iconColor = '#0dcaf0'; // Blue
        }
        
        // Create a custom icon
        const incidentIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${iconColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Create marker with popup
        const marker = L.marker([incident.lat, incident.lng], { icon: incidentIcon })
            .addTo(map)
            .bindPopup(`
                <strong>${incident.title}</strong><br>
                ${incident.description}
            `);
            
        // Store the incident type on the marker for filtering
        marker.incidentType = incident.type;
        
        // Store all markers in a global array for filtering
        if (!window.incidentMarkers) {
            window.incidentMarkers = [];
        }
        window.incidentMarkers.push(marker);
    });
}

// Filter map incidents based on type
function filterMapIncidents(filter) {
    if (!window.incidentMarkers) return;
    
    window.incidentMarkers.forEach(marker => {
        if (filter === 'all' || marker.incidentType === filter) {
            marker.addTo(window.trafficMap);
        } else {
            window.trafficMap.removeLayer(marker);
        }
    });
}

// Simulate finding a route
function findRoute(origin, destination) {
    // In a real app, this would call a routing API
    console.log(`Finding route from ${origin} to ${destination}`);
    
    // Clear existing routes
    $('#suggestedRoutes').empty();
    
    // Add mock routes
    const routes = [
        {
            name: `${origin} to ${destination} via Highway`,
            description: 'Fastest route, moderate traffic',
            distance: '24.5 km',
            time: '35 min'
        },
        {
            name: `${origin} to ${destination} via City Center`,
            description: 'Alternative route with less traffic',
            distance: '28.2 km',
            time: '42 min'
        },
        {
            name: `${origin} to ${destination} via Ring Road`,
            description: 'Longer but less congested',
            distance: '32.7 km',
            time: '45 min'
        }
    ];
    
    // Add routes to the list
    routes.forEach(route => {
        $('#suggestedRoutes').append(`
            <li class="route-item">
                <h4>${route.name}</h4>
                <p>${route.description}</p>
                <div class="route-meta">
                    <span class="route-distance">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                            <path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path>
                            <path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path>
                            <path d="m8 22 4-10 4 10"></path>
                        </svg>
                        ${route.distance}
                    </span>
                    <span class="route-time">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${route.time}
                    </span>
                </div>
            </li>
        `);
    });
    
    // In a real app, you would also draw the route on the map
    // For demo purposes, we'll just show a notification
    alert(`Route found from ${origin} to ${destination}. Check the suggested routes panel.`);
}

// Load mock alerts
function loadMockAlerts() {
    const alerts = [
        {
            title: 'Major Accident',
            location: 'Highway 5, Mile Marker 23',
            time: '5 minutes ago',
            type: 'critical'
        },
        {
            title: 'Heavy Congestion',
            location: 'Downtown Area, Main Street',
            time: '12 minutes ago',
            type: 'warning'
        },
        {
            title: 'Road Construction',
            location: 'West Boulevard, Between 4th and 6th Ave',
            time: '30 minutes ago',
            type: 'info'
        },
        {
            title: 'Weather Alert: Heavy Rain',
            location: 'City-wide',
            time: '45 minutes ago',
            type: 'warning'
        },
        {
            title: 'Traffic Signal Malfunction',
            location: 'Intersection of Park St and River Rd',
            time: '1 hour ago',
            type: 'info'
        }
    ];
    
    // Clear existing alerts
    $('#alertList').empty();
    
    // Add alerts to the list
    alerts.forEach(alert => {
        $('#alertList').append(`
            <li class="alert-item ${alert.type}">
                <div class="alert-icon">
                    ${getAlertIcon(alert.type)}
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.location}</p>
                    <span class="alert-time">${alert.time}</span>
                </div>
            </li>
        `);
    });
}

// Load mock routes
function loadMockRoutes() {
    const routes = [
        {
            name: 'Home to Office',
            description: 'Via Highway 5, moderate traffic',
            distance: '12.3 km',
            time: '18 min'
        },
        {
            name: 'Downtown to Airport',
            description: 'Via Express Route, light traffic',
            distance: '28.5 km',
            time: '32 min'
        },
        {
            name: 'Shopping Mall to Residential Area',
            description: 'Via City Center, heavy traffic',
            distance: '8.7 km',
            time: '25 min'
        }
    ];
    
    // Add routes to the list
    routes.forEach(route => {
        $('#suggestedRoutes').append(`
            <li class="route-item">
                <h4>${route.name}</h4>
                <p>${route.description}</p>
                <div class="route-meta">
                    <span class="route-distance">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                            <path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path>
                            <path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path>
                            <path d="m8 22 4-10 4 10"></path>
                        </svg>
                        ${route.distance}
                    </span>
                    <span class="route-time">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${route.time}
                    </span>
                </div>
            </li>
        `);
    });
}

// Get appropriate icon for alert type
function getAlertIcon(type) {
    switch(type) {
        case 'critical':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path d="M12 9v4"></path><path d="M12 17h.01"></path>
            </svg>`;
        case 'warning':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 9v4"></path><path d="M12 17h.01"></path>
                <circle cx="12" cy="12" r="10"></circle>
            </svg>`;
        case 'info':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path><path d="M12 8h.01"></path>
            </svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path><path d="M12 8h.01"></path>
            </svg>`;
    }
}

// Add CSS for the rotating refresh button
$('<style>')
    .prop('type', 'text/css')
    .html(`
        @keyframes rotating {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        .rotating {
            animation: rotating 1s linear infinite;
        }
    `)
    .appendTo('head');