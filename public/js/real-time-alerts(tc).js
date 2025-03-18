/**
 * Real-Time Alerts Management
 * Enhanced script with improved UI and functionality
 */

// Mock data for demonstration
const mockData = [
    {
        routeId: "route1",
        routeName: "Main Street Corridor",
        currentStatus: "Active",
        lastUpdated: "2023-06-15T14:30:00",
        alerts: [
            {
                id: "alert1",
                routeId: "route1",
                type: "Traffic Congestion",
                severity: "high",
                description: "Heavy traffic congestion detected on Main St between 5th and 7th Ave",
                timestamp: "2023-06-15T14:25:00"
            },
            {
                id: "alert2",
                routeId: "route1",
                type: "Signal Malfunction",
                severity: "medium",
                description: "Traffic signal at Main St & 6th Ave operating in flashing mode",
                timestamp: "2023-06-15T13:45:00"
            }
        ]
    },
    {
        routeId: "route2",
        routeName: "Downtown Express",
        currentStatus: "Active",
        lastUpdated: "2023-06-15T14:15:00",
        alerts: [
            {
                id: "alert3",
                routeId: "route2",
                type: "Road Closure",
                severity: "high",
                description: "Road closed due to construction at Broadway & 42nd St",
                timestamp: "2023-06-15T14:10:00"
            }
        ]
    },
    {
        routeId: "route3",
        routeName: "Riverside Drive",
        currentStatus: "Active",
        lastUpdated: "2023-06-15T14:00:00",
        alerts: [
            {
                id: "alert4",
                routeId: "route3",
                type: "Weather Alert",
                severity: "medium",
                description: "Slippery conditions reported due to rain on Riverside Dr",
                timestamp: "2023-06-15T13:55:00"
            },
            {
                id: "alert5",
                routeId: "route3",
                type: "Traffic Incident",
                severity: "low",
                description: "Minor accident cleared, residual delays on Riverside Dr & 96th St",
                timestamp: "2023-06-15T12:30:00"
            }
        ]
    },
    {
        routeId: "route4",
        routeName: "East Side Highway",
        currentStatus: "Active",
        lastUpdated: "2023-06-15T13:45:00",
        alerts: [
            {
                id: "alert6",
                routeId: "route4",
                type: "Speed Reduction",
                severity: "low",
                description: "Speed limit temporarily reduced to 45mph due to road work",
                timestamp: "2023-06-15T13:40:00"
            }
        ]
    },
    {
        routeId: "route5",
        routeName: "North Bridge Crossing",
        currentStatus: "Restricted",
        lastUpdated: "2023-06-15T13:30:00",
        alerts: [
            {
                id: "alert7",
                routeId: "route5",
                type: "Lane Closure",
                severity: "high",
                description: "Two lanes closed on North Bridge due to emergency repairs",
                timestamp: "2023-06-15T13:25:00"
            },
            {
                id: "alert8",
                routeId: "route5",
                type: "Heavy Traffic",
                severity: "medium",
                description: "Delays of up to 25 minutes reported on North Bridge approaches",
                timestamp: "2023-06-15T13:20:00"
            },
            {
                id: "alert9",
                routeId: "route5",
                type: "Alternative Route",
                severity: "low",
                description: "Drivers advised to use South Bridge as an alternative",
                timestamp: "2023-06-15T13:15:00"
            }
        ]
    }
];

// DOM Elements
const elements = {
    // Stats
    criticalCount: document.getElementById('critical-count'),
    warningCount: document.getElementById('warning-count'),
    infoCount: document.getElementById('info-count'),
    resolvedCount: document.getElementById('resolved-count'),
    
    // Tables and Lists
    routesTable: document.querySelector('#routes-table tbody'),
    alertsList: document.getElementById('alerts-list'),
    
    // Filters and Search
    routeFilter: document.getElementById('route-filter'),
    globalSearch: document.getElementById('global-search'),
    
    // Buttons
    refreshRoutes: document.getElementById('refresh-routes'),
    refreshAlerts: document.getElementById('refresh-alerts'),
    resolveAllBtn: document.getElementById('resolve-all-btn'),
    
    // Modal
    alertModal: document.getElementById('alert-modal'),
    modalRouteName: document.getElementById('modal-route-name'),
    modalRouteId: document.getElementById('modal-route-id'),
    modalRouteStatus: document.getElementById('modal-route-status'),
    modalRouteUpdated: document.getElementById('modal-route-updated'),
    modalCriticalCount: document.getElementById('modal-critical-count'),
    modalWarningCount: document.getElementById('modal-warning-count'),
    modalInfoCount: document.getElementById('modal-info-count'),
    modalAlertsList: document.getElementById('modal-alerts-list'),
    resolveAllRouteAlerts: document.getElementById('resolve-all-route-alerts'),
    closeModalBtns: document.querySelectorAll('.close-modal, .close-modal-btn')
};

// Declare $ and L as global variables
var $ = jQuery;
var L = window.L;

// Initialize when document is ready
$(document).ready(function() {
    // Initialize Select2 dropdowns if they exist
    if ($.fn.select2) {
        $('.select2-dropdown').select2({
            width: '100%',
            placeholder: function() {
                return $(this).data('placeholder');
            }
        });
    }

    // Initialize the map if Leaflet is available
    if (typeof L !== 'undefined') {
        initMap();
    }

    // Mobile menu toggle
    $('.menu-toggle').on('click', function() {
        $('.sidebar').toggleClass('active');
    });

    // Load initial data
    initializeApp();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // This is a backup initialization in case jQuery ready event doesn't fire
    if (!window.appInitialized) {
        initializeApp();
    }
});



/**
 * Initialize the application
 */
function initializeApp() {
    window.appInitialized = true;
    
    // Load data
    loadData();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Load and display data
 */
function loadData() {
    // In a real application, this would be an API call
    // For demo purposes, we'll use the mock data
    
    // Update stats
    updateAlertStats(mockData);
    
    // Populate routes table
    populateRoutesTable(mockData);
    
    // Populate alerts list
    populateAlertsList(mockData);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Route filter change
    if (elements.routeFilter) {
        elements.routeFilter.addEventListener('change', () => {
            filterRoutes(elements.routeFilter.value);
        });
    }
    
    // Global search
    if (elements.globalSearch) {
        elements.globalSearch.addEventListener('input', () => {
            const searchTerm = elements.globalSearch.value.toLowerCase();
            searchAlerts(searchTerm);
        });
    }
    
    // Refresh buttons
    if (elements.refreshRoutes) {
        elements.refreshRoutes.addEventListener('click', () => {
            refreshData('routes');
        });
    }
    
    if (elements.refreshAlerts) {
        elements.refreshAlerts.addEventListener('click', () => {
            refreshData('alerts');
        });
    }
    
    // Resolve all alerts button
    if (elements.resolveAllBtn) {
        elements.resolveAllBtn.addEventListener('click', resolveAllAlerts);
    }
    
    // Modal resolve all route alerts button
    if (elements.resolveAllRouteAlerts) {
        elements.resolveAllRouteAlerts.addEventListener('click', () => {
            const routeId = elements.modalRouteId.textContent;
            resolveRouteAlerts(routeId);
        });
    }
    
    // Close modal buttons
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.alertModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.alertModal) {
            elements.alertModal.classList.remove('active');
        }
    });
    
    // Set up event delegation for dynamic elements
    document.addEventListener('click', handleDelegatedEvents);
}

/**
 * Handle delegated events for dynamically created elements
 */
function handleDelegatedEvents(e) {
    // View route alerts button
    if (e.target.closest('.view-alerts-btn')) {
        const routeId = e.target.closest('.view-alerts-btn').dataset.routeId;
        openRouteAlertsModal(routeId);
    }
    
    // Resolve alert button
    if (e.target.closest('.resolve-alert-btn')) {
        const alertId = e.target.closest('.resolve-alert-btn').dataset.alertId;
        resolveAlert(alertId);
    }
    
    // Delete alert button
    if (e.target.closest('.delete-alert-btn')) {
        const alertId = e.target.closest('.delete-alert-btn').dataset.alertId;
        deleteAlert(alertId);
    }
}

/**
 * Update alert statistics
 */
function updateAlertStats(data) {
    // Count alerts by severity
    let criticalCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    
    data.forEach(route => {
        route.alerts.forEach(alert => {
            if (alert.severity === 'high') {
                criticalCount++;
            } else if (alert.severity === 'medium') {
                warningCount++;
            } else if (alert.severity === 'low') {
                infoCount++;
            }
        });
    });
    
    // Update stats in the UI
    if (elements.criticalCount) elements.criticalCount.textContent = criticalCount;
    if (elements.warningCount) elements.warningCount.textContent = warningCount;
    if (elements.infoCount) elements.infoCount.textContent = infoCount;
    if (elements.resolvedCount) elements.resolvedCount.textContent = '24'; // Mock resolved count
}

// Initialize the map using Leaflet.js with OpenStreetMap
function initMap() {
    // Check if map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }

    // Check if Leaflet is defined
    if (typeof L === 'undefined') {
        console.error('Leaflet is not loaded. Please include Leaflet in your HTML.');
        return;
    }

    try {
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
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Add mock incidents to the map
function addMockIncidents(map) {
    if (!map) return;
    
    const incidents = [
        { lat: 28.6139, lng: 77.2090, title: 'Accident', type: 'accident', description: 'Multi-vehicle collision' },
        { lat: 28.6229, lng: 77.2080, title: 'Road Work', type: 'roadwork', description: 'Lane closure due to construction' },
        { lat: 28.6339, lng: 77.2190, title: 'Heavy Traffic', type: 'congestion', description: 'Slow moving traffic' },
        { lat: 28.6039, lng: 77.2290, title: 'Accident', type: 'accident', description: 'Vehicle breakdown' },
        { lat: 28.6239, lng: 77.1990, title: 'Road Closure', type: 'roadwork', description: 'Complete road closure' }
    ];

    try {
        // Create a marker for each incident
        incidents.forEach(incident => {
            // Choose icon based on incident type
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
    } catch (error) {
        console.error('Error adding map incidents:', error);
    }
}

// Filter map incidents based on type
function filterMapIncidents(filter) {
    if (!window.incidentMarkers || !window.trafficMap) return;
    
    window.incidentMarkers.forEach(marker => {
        if (filter === 'all' || marker.incidentType === filter) {
            marker.addTo(window.trafficMap);
        } else {
            window.trafficMap.removeLayer(marker);
        }
    });
}

/**
 * Populate routes table
 */
function populateRoutesTable(data) {
    if (!elements.routesTable) return;
    
    // Clear existing rows
    elements.routesTable.innerHTML = '';
    
    // Add route rows
    data.forEach(route => {
        // Determine highest severity
        let highestSeverity = 'low';
        if (route.alerts.some(alert => alert.severity === 'high')) {
            highestSeverity = 'high';
        } else if (route.alerts.some(alert => alert.severity === 'medium')) {
            highestSeverity = 'medium';
        }
        
        // Format last updated time
        const lastUpdated = new Date(route.lastUpdated).toLocaleString();
        
        // Create row
        const row = document.createElement('tr');
        row.className = `severity-${highestSeverity}`;
        
        row.innerHTML = `
            <td>${route.routeName}</td>
            <td>${route.currentStatus}</td>
            <td>${route.alerts.length}</td>
            <td>
                <span class="severity-badge ${highestSeverity}">
                    ${highestSeverity.charAt(0).toUpperCase() + highestSeverity.slice(1)}
                </span>
            </td>
            <td>${lastUpdated}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn view-btn view-alerts-btn" data-route-id="${route.routeId}" title="View Alerts">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button class="action-btn resolve-btn resolve-route-alerts-btn" data-route-id="${route.routeId}" title="Resolve All">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </button>
                </div>
            </td>
        `;
        
        elements.routesTable.appendChild(row);
    });
}

/**
 * Populate alerts list
 */
function populateAlertsList(data) {
    if (!elements.alertsList) return;
    
    // Clear existing alerts
    elements.alertsList.innerHTML = '';
    
    // Get all alerts and sort by timestamp (newest first)
    const allAlerts = [];
    data.forEach(route => {
        route.alerts.forEach(alert => {
            allAlerts.push({
                ...alert,
                routeName: route.routeName
            });
        });
    });
    
    allAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Display the 5 most recent alerts
    const recentAlerts = allAlerts.slice(0, 5);
    
    recentAlerts.forEach(alert => {
        const alertItem = document.createElement('li');
        alertItem.className = `alert-item ${alert.severity}`;
        
        // Determine icon based on alert type
        let icon = '';
        if (alert.type.includes('Traffic')) {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>';
        } else if (alert.type.includes('Signal')) {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="10" height="20" x="7" y="2" rx="2"></rect><circle cx="12" cy="7" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="17" r="2"></circle></svg>';
        } else if (alert.type.includes('Road') || alert.type.includes('Lane')) {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
        } else if (alert.type.includes('Weather')) {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>';
        } else {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>';
        }
        
        // Format timestamp
        const timestamp = new Date(alert.timestamp).toLocaleString();
        
        alertItem.innerHTML = `
            <div class="alert-icon">
                ${icon}
            </div>
            <div class="alert-content">
                <h4>
                    ${alert.type}
                    <span class="alert-route">${alert.routeName}</span>
                </h4>
                <p>${alert.description}</p>
                <span class="alert-time">${timestamp}</span>
                <div class="alert-actions">
                    <button class="action-btn resolve-btn resolve-alert-btn" data-alert-id="${alert.id}" title="Resolve Alert">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </button>
                    <button class="action-btn delete-btn delete-alert-btn" data-alert-id="${alert.id}" title="Delete Alert">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
        
        elements.alertsList.appendChild(alertItem);
    });
}

/**
 * Filter routes by severity
 */
function filterRoutes(severity) {
    const rows = elements.routesTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        if (severity === 'all') {
            row.style.display = '';
        } else {
            if (row.classList.contains(`severity-${severity}`)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

/**
 * Search alerts by term
 */
function searchAlerts(term) {
    // Search in routes table
    const routeRows = elements.routesTable.querySelectorAll('tr');
    routeRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Search in alerts list
    const alertItems = elements.alertsList.querySelectorAll('.alert-item');
    alertItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Refresh data
 */
function refreshData(section) {
    // In a real application, this would fetch fresh data from the API
    // For demo purposes, we'll just reload the existing data
    
    if (section === 'routes' || section === 'all') {
        populateRoutesTable(mockData);
    }
    
    if (section === 'alerts' || section === 'all') {
        populateAlertsList(mockData);
    }
    
    // Show notification
    showNotification('Data refreshed successfully', 'success');
}

/**
 * Open route alerts modal
 */
function openRouteAlertsModal(routeId) {
    // Find the route
    const route = mockData.find(r => r.routeId === routeId);
    if (!route) return;
    
    // Update modal header
    elements.modalRouteName.textContent = route.routeName;
    elements.modalRouteId.textContent = route.routeId;
    elements.modalRouteStatus.textContent = route.currentStatus;
    elements.modalRouteUpdated.textContent = new Date(route.lastUpdated).toLocaleString();
    
    // Count alerts by severity
    let criticalCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    
    route.alerts.forEach(alert => {
        if (alert.severity === 'high') {
            criticalCount++;
        } else if (alert.severity === 'medium') {
            warningCount++;
        } else if (alert.severity === 'low') {
            infoCount++;
        }
    });
    
    // Update alert counts
    elements.modalCriticalCount.textContent = criticalCount;
    elements.modalCriticalCount.className = criticalCount > 0 ? 'summary-count high' : 'summary-count';
    
    elements.modalWarningCount.textContent = warningCount;
    elements.modalWarningCount.className = warningCount > 0 ? 'summary-count medium' : 'summary-count';
    
    elements.modalInfoCount.textContent = infoCount;
    elements.modalInfoCount.className = infoCount > 0 ? 'summary-count low' : 'summary-count';
    
    // Clear existing alerts
    elements.modalAlertsList.innerHTML = '';
    
    // Add alerts to the table
    route.alerts.forEach(alert => {
        const row = document.createElement('tr');
        row.className = `severity-${alert.severity}`;
        
        // Format timestamp
        const timestamp = new Date(alert.timestamp).toLocaleString();
        
        row.innerHTML = `
            <td>${alert.type}</td>
            <td>
                <span class="severity-badge ${alert.severity}">
                    ${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
            </td>
            <td>${alert.description}</td>
            <td>${timestamp}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn resolve-btn resolve-alert-btn" data-alert-id="${alert.id}" title="Resolve Alert">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </button>
                    <button class="action-btn delete-btn delete-alert-btn" data-alert-id="${alert.id}" title="Delete Alert">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            </td>
        `;
        
        elements.modalAlertsList.appendChild(row);
    });
    
    // Show the modal
    elements.alertModal.classList.add('active');
}

/**
 * Resolve a single alert
 */
function resolveAlert(alertId) {
    // In a real application, this would call an API to resolve the alert
    // For demo purposes, we'll just remove it from the UI
    
    // Find and remove the alert from the alerts list
    const alertItem = document.querySelector(`.alert-item .resolve-alert-btn[data-alert-id="${alertId}"]`);
    if (alertItem) {
        const item = alertItem.closest('.alert-item');
        if (item) {
            item.remove();
        }
    }
    
    // Find and remove the alert from the modal
    const modalAlertRow = document.querySelector(`#modal-alerts-list .resolve-alert-btn[data-alert-id="${alertId}"]`);
    if (modalAlertRow) {
        const row = modalAlertRow.closest('tr');
        if (row) {
            row.remove();
        }
    }
    
    // Update stats
    // In a real application, we would refetch the data
    // For demo purposes, we'll just increment the resolved count
    const resolvedCount = parseInt(elements.resolvedCount.textContent) || 0;
    elements.resolvedCount.textContent = resolvedCount + 1;
    
    // Show notification
    showNotification('Alert resolved successfully', 'success');
}

/**
 * Delete an alert
 */
function deleteAlert(alertId) {
    // In a real application, this would call an API to delete the alert
    // For demo purposes, we'll just remove it from the UI
    
    // Find and remove the alert from the alerts list
    const alertItem = document.querySelector(`.alert-item .delete-alert-btn[data-alert-id="${alertId}"]`);
    if (alertItem) {
        const item = alertItem.closest('.alert-item');
        if (item) {
            item.remove();
        }
    }
    
    // Find and remove the alert from the modal
    const modalAlertRow = document.querySelector(`#modal-alerts-list .delete-alert-btn[data-alert-id="${alertId}"]`);
    if (modalAlertRow) {
        const row = modalAlertRow.closest('tr');
        if (row) {
            row.remove();
        }
    }
    
    // Show notification
    showNotification('Alert deleted successfully', 'success');
}

/**
 * Resolve all alerts for a route
 */
function resolveRouteAlerts(routeId) {
    // In a real application, this would call an API to resolve all alerts for the route
    // For demo purposes, we'll just remove them from the UI
    
    // Find all alerts for this route in the modal
    const modalAlertRows = document.querySelectorAll(`#modal-alerts-list tr`);
    modalAlertRows.forEach(row => {
        row.remove();
    });
    
    // Update the route's alert count in the routes table
    const routeRow = document.querySelector(`.view-alerts-btn[data-route-id="${routeId}"]`);
    if (routeRow) {
        const row = routeRow.closest('tr');
        if (row) {
            const alertCountCell = row.querySelector('td:nth-child(3)');
            alertCountCell.textContent = '0';
            
            // Update severity
            row.className = '';
            const severityCell = row.querySelector('td:nth-child(4)');
            severityCell.innerHTML = '<span class="severity-badge resolved">Resolved</span>';
        }
    }
    
    // Update stats
    // In a real application, we would refetch the data
    // For demo purposes, we'll just update the counts
    const resolvedCount = parseInt(elements.resolvedCount.textContent) || 0;
    const criticalCount = parseInt(elements.criticalCount.textContent) || 0;
    const warningCount = parseInt(elements.warningCount.textContent) || 0;
    const infoCount = parseInt(elements.infoCount.textContent) || 0;
    
    const modalCriticalCount = parseInt(elements.modalCriticalCount.textContent) || 0;
    const modalWarningCount = parseInt(elements.modalWarningCount.textContent) || 0;
    const modalInfoCount = parseInt(elements.modalInfoCount.textContent) || 0;
    
    elements.resolvedCount.textContent = resolvedCount + modalCriticalCount + modalWarningCount + modalInfoCount;
    elements.criticalCount.textContent = Math.max(0, criticalCount - modalCriticalCount);
    elements.warningCount.textContent = Math.max(0, warningCount - modalWarningCount);
    elements.infoCount.textContent = Math.max(0, infoCount - modalInfoCount);
    
    // Reset modal counts
    elements.modalCriticalCount.textContent = '0';
    elements.modalCriticalCount.className = 'summary-count';
    elements.modalWarningCount.textContent = '0';
    elements.modalWarningCount.className = 'summary-count';
    elements.modalInfoCount.textContent = '0';
    elements.modalInfoCount.className = 'summary-count';
    
    // Show notification
    showNotification('All alerts for this route have been resolved', 'success');
}

/**
 * Resolve all alerts
 */
function resolveAllAlerts() {
    // In a real application, this would call an API to resolve all alerts
    // For demo purposes, we'll just clear the UI
    
    // Clear alerts list
    elements.alertsList.innerHTML = '';
    
    // Update routes table
    const routeRows = elements.routesTable.querySelectorAll('tr');
    routeRows.forEach(row => {
        const alertCountCell = row.querySelector('td:nth-child(3)');
        alertCountCell.textContent = '0';
        
        // Update severity
        row.className = '';
        const severityCell = row.querySelector('td:nth-child(4)');
        severityCell.innerHTML = '<span class="severity-badge resolved">Resolved</span>';
    });
    
    // Update stats
    const resolvedCount = parseInt(elements.resolvedCount.textContent) || 0;
    const criticalCount = parseInt(elements.criticalCount.textContent) || 0;
    const warningCount = parseInt(elements.warningCount.textContent) || 0;
    const infoCount = parseInt(elements.infoCount.textContent) || 0;
    
    elements.resolvedCount.textContent = resolvedCount + criticalCount + warningCount + infoCount;
    elements.criticalCount.textContent = '0';
    elements.warningCount.textContent = '0';
    elements.infoCount.textContent = '0';
    
    // Show notification
    showNotification('All alerts have been resolved', 'success');
}

/**
 * Show notification
 */
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="close-notification">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add active class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Set up close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add these functions to your existing JavaScript file

/**
 * Configure Alerts functionality
 */
function saveAlertConfiguration() {
    // Get form values
    const threshold = document.getElementById('alert-threshold').value;
    const emailNotification = document.getElementById('email-notification').checked;
    const smsNotification = document.getElementById('sms-notification').checked;
    const inAppNotification = document.getElementById('in-app-notification').checked;
    const frequency = document.getElementById('alert-frequency').value;
    
    // In a real application, this would save to a database
    // For demo purposes, we'll just log the values and show a notification
    console.log('Alert Configuration:', {
        threshold,
        notifications: {
            email: emailNotification,
            sms: smsNotification,
            inApp: inAppNotification
        },
        frequency
    });
    
    // Close the modal
    document.getElementById('configure-alerts-modal').classList.remove('active');
    
    // Show success notification
    showNotification('Alert configuration saved successfully', 'success');
}

/**
 * Alert Prioritization functionality
 */
function savePriorityConfiguration() {
    // Get form values
    const trafficCongestion = document.getElementById('traffic-congestion-priority').value;
    const signalMalfunction = document.getElementById('signal-malfunction-priority').value;
    const roadClosure = document.getElementById('road-closure-priority').value;
    const weatherAlert = document.getElementById('weather-alert-priority').value;
    
    // In a real application, this would save to a database
    // For demo purposes, we'll just log the values and show a notification
    console.log('Priority Configuration:', {
        trafficCongestion,
        signalMalfunction,
        roadClosure,
        weatherAlert
    });
    
    // Close the modal
    document.getElementById('prioritize-alerts-modal').classList.remove('active');
    
    // Show success notification
    showNotification('Alert priorities saved successfully', 'success');
}

/**
 * Auto Resolution functionality
 */
function saveAutoResolutionConfiguration() {
    // Get form values
    const enabled = document.getElementById('auto-resolution-toggle').checked;
    const resolveAfter = document.getElementById('auto-resolve-after').value;
    const resolveLow = document.getElementById('resolve-low').checked;
    const resolveMedium = document.getElementById('resolve-medium').checked;
    const resolveHigh = document.getElementById('resolve-high').checked;
    
    // In a real application, this would save to a database
    // For demo purposes, we'll just log the values and show a notification
    console.log('Auto Resolution Configuration:', {
        enabled,
        resolveAfter,
        severities: {
            low: resolveLow,
            medium: resolveMedium,
            high: resolveHigh
        }
    });
    
    // Close the modal
    document.getElementById('auto-resolution-modal').classList.remove('active');
    
    // Show success notification
    showNotification('Auto-resolution configuration saved successfully', 'success');
}

/**
 * Generate Reports functionality
 */
function generateReport() {
    // Get form values
    const reportType = document.getElementById('report-type').value;
    const includeFrequency = document.getElementById('include-frequency').checked;
    const includeResolution = document.getElementById('include-resolution').checked;
    const includeRoute = document.getElementById('include-route').checked;
    const includeSeverity = document.getElementById('include-severity').checked;
    const reportFormat = document.getElementById('report-format').value;
    
    // In a real application, this would generate a report
    // For demo purposes, we'll just log the values and show a notification
    console.log('Report Configuration:', {
        reportType,
        include: {
            frequency: includeFrequency,
            resolution: includeResolution,
            route: includeRoute,
            severity: includeSeverity
        },
        format: reportFormat
    });
    
    // Close the modal
    document.getElementById('generate-reports-modal').classList.remove('active');
    
    // Show success notification with download link
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <span>
                Report generated successfully! 
                <a href="#" class="download-link">Download ${reportFormat.toUpperCase()}</a>
            </span>
            <button class="close-notification">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add active class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Set up close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 8000);
    
    // Add download link functionality
    const downloadLink = notification.querySelector('.download-link');
    downloadLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`In a real application, this would download the ${reportType} report in ${reportFormat.toUpperCase()} format.`);
    });
}

// Add event listeners when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Configure Alerts
    const saveConfigBtn = document.getElementById('save-config-btn');
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', saveAlertConfiguration);
    }
    
    // Alert Prioritization
    const savePriorityBtn = document.getElementById('save-priority-btn');
    if (savePriorityBtn) {
        savePriorityBtn.addEventListener('click', savePriorityConfiguration);
    }
    
    // Auto Resolution
    const saveAutoResolutionBtn = document.getElementById('save-auto-resolution-btn');
    if (saveAutoResolutionBtn) {
        saveAutoResolutionBtn.addEventListener('click', saveAutoResolutionConfiguration);
    }
    
    // Generate Reports
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
});