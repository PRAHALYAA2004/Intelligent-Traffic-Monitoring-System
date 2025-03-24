/**
 * Dynamic Route Adjustment
 * Enhanced script with modern features, better visualization, and improved UX
 */



// DOM Elements
const elements = {
    // Stats
    activeRoutesCount: document.getElementById('active-routes-count'),
    avgDeliveryTime: document.getElementById('avg-delivery-time'),
    routeAdjustments: document.getElementById('route-adjustments'),
    trafficIncidents: document.getElementById('traffic-incidents'),
    
    // Route Info
    deliveryId: document.getElementById('delivery-id'),
    status: document.getElementById('status'),
    startPoint: document.getElementById('start-point'),
    endPoint: document.getElementById('end-point'),
    currentPath: document.getElementById('current-path'),
    estimatedArrival: document.getElementById('estimated-arrival'),
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notification-text'),
    
    // Route Options
    routeOptions: document.getElementById('route-options'),
    
    // Timeline
    routeTimeline: document.getElementById('route-timeline'),
    
    // Selectors
    deliverySelector: document.getElementById('delivery-selector'),
    mapViewSelector: document.getElementById('map-view-selector'),
    routeSort: document.getElementById('route-sort'),
    
    // Buttons
    updateRouteBtn: document.getElementById('update-route'),
    optimizeRouteBtn: document.getElementById('optimize-route'),
    refreshMapBtn: document.getElementById('refresh-map'),
    
    // Map
    routeMap: document.getElementById('route-map'),
    
    // Modal
    routeDetailModal: document.getElementById('route-detail-modal'),
    modalRouteInfo: document.getElementById('modal-route-info'),
    modalRouteMap: document.getElementById('modal-route-map'),
    modalWaypoints: document.getElementById('modal-waypoints'),
    modalSelectRouteBtn: document.getElementById('modal-select-route'),
    closeModalBtns: document.querySelectorAll('.close-modal, .close-modal-btn'),
    
    // Search
    routeSearch: document.getElementById('route-search'),
    
    // Mobile
    menuToggle: document.querySelector('.menu-toggle'),
    sidebar: document.querySelector('.sidebar')
};

// Global state
const state = {
    deliveries: {},
    currentDeliveryId: 'delivery1',
    selectedRouteOption: null,
    map: null,
    modalMap: null,
    routeLayers: {},
    darkMode: localStorage.getItem('darkMode') === 'true'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Add console logging for debugging
    console.log("DOM Content Loaded");
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log("Initializing app");
    
    // Check if Leaflet is available globally
    if (typeof L !== 'undefined') {
        console.log("Leaflet is available globally");
        // Initialize maps
        initializeMap();
        
        // Fetch initial data
        fetchDeliveryData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize stats
        updateStats();
    } else {
        console.error("Leaflet is not available. Make sure the Leaflet script is loaded correctly.");
        // Add a visible error message on the page
        const mapContainer = document.getElementById('route-map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div class="map-error">Error: Leaflet library not loaded. Please check console for details.</div>';
        }
    }
}

/**
 * Initialize the map
 */
function initializeMap() {
    try {
        console.log("Initializing map");
        // Check if the map element exists
        if (!elements.routeMap) {
            console.error("Map element not found");
            return;
        }
        
        // Initialize the map
        state.map = L.map(elements.routeMap).setView([40.7128, -74.0060], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(state.map);
        
        console.log("Map initialized successfully");
    } catch (error) {
        console.error("Error initializing map:", error);
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    console.log("Setting up event listeners");
    
    // Delivery selector
    if (elements.deliverySelector) {
        elements.deliverySelector.addEventListener('change', (e) => {
            state.currentDeliveryId = e.target.value;
            updateDeliveryDisplay();
            updateRouteMap();
        });
    }
    
    // Map view selector
    if (elements.mapViewSelector) {
        elements.mapViewSelector.addEventListener('change', () => {
            updateRouteMap();
        });
    }
    
    // Route sort
    if (elements.routeSort) {
        elements.routeSort.addEventListener('change', () => {
            updateRouteOptions();
        });
    }
    
    // Update route button
    if (elements.updateRouteBtn) {
        elements.updateRouteBtn.addEventListener('click', updateRoute);
    }
    
    // Optimize route button
    if (elements.optimizeRouteBtn) {
        elements.optimizeRouteBtn.addEventListener('click', optimizeRoute);
    }
    
    // Refresh map button
    if (elements.refreshMapBtn) {
        elements.refreshMapBtn.addEventListener('click', () => {
            updateRouteMap();
        });
    }
    
    // Close modal buttons
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.routeDetailModal.classList.remove('active');
        });
    });
    
    // Modal select route button
    if (elements.modalSelectRouteBtn) {
        elements.modalSelectRouteBtn.addEventListener('click', () => {
            if (state.selectedRouteOption) {
                selectRoute(state.selectedRouteOption);
                elements.routeDetailModal.classList.remove('active');
            }
        });
    }
    
    // Route search
    if (elements.routeSearch) {
        elements.routeSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterRoutes(searchTerm);
        });
    }
    
    // Mobile menu toggle
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', () => {
            elements.sidebar.classList.toggle('active');
        });
    }
    
    console.log("Event listeners set up successfully");
}

/**
 * Fetch delivery data from API
 */
async function fetchDeliveryData() {
    try {
        console.log("Fetching delivery data");
        // Show loading state
        showLoading();
        
        // In a real application, this would be an API call
        // For demo purposes, we'll use mock data
        const mockData = generateMockData();
        
        // Store the data
        state.deliveries = mockData;
        
        // Update the UI
        updateDeliveryDisplay();
        updateRouteMap();
        updateStats();
        
        // Hide loading state
        hideLoading();
        
        console.log("Delivery data fetched successfully");
    } catch (error) {
        console.error('Error fetching delivery data:', error);
        showNotification('Error loading delivery data. Please try again.', 'error');
        hideLoading();
    }
}

/**
 * Generate mock data for demonstration
 */
function generateMockData() {
    return {
        delivery1: {
            deliveryId: 'DEL-2023-001',
            startPoint: 'Warehouse A, 123 Main St',
            endPoint: 'Customer HQ, 456 Park Ave',
            currentPath: 'Route A via Highway 101',
            status: 'in-transit',
            estimatedArrival: '2023-06-15 14:30',
            notification: {
                type: 'warning',
                message: 'Traffic congestion detected on Highway 101. Consider alternate routes.'
            },
            timeline: [
                {
                    time: '08:00 AM',
                    title: 'Order Processed',
                    description: 'Order confirmed and ready for dispatch',
                    status: 'completed'
                },
                {
                    time: '09:15 AM',
                    title: 'Departed Warehouse',
                    description: 'Vehicle left Warehouse A with package',
                    status: 'completed'
                },
                {
                    time: '10:30 AM',
                    title: 'Route Adjustment',
                    description: 'Route changed due to traffic on Main St',
                    status: 'completed'
                },
                {
                    time: '11:45 AM',
                    title: 'In Transit',
                    description: 'Currently on Highway 101',
                    status: 'current'
                },
                {
                    time: '02:30 PM',
                    title: 'Estimated Delivery',
                    description: 'Expected arrival at Customer HQ',
                    status: 'pending'
                }
            ],
            possiblePaths: [
                {
                    pathId: 'Route A',
                    waypoints: ['Warehouse A', 'Main St', 'Highway 101', 'Downtown Exit', 'Park Ave', 'Customer HQ'],
                    trafficCondition: 'medium',
                    estimatedTime: 45,
                    distance: 12.5,
                    coordinates: [
                        [40.712, -74.006],
                        [40.718, -74.012],
                        [40.725, -74.018],
                        [40.732, -74.015],
                        [40.738, -74.008],
                        [40.745, -74.001]
                    ],
                    isRecommended: false,
                    isCurrent: true
                },
                {
                    pathId: 'Route B',
                    waypoints: ['Warehouse A', 'River Rd', 'Bridge St', 'Park Ave', 'Customer HQ'],
                    trafficCondition: 'low',
                    estimatedTime: 50,
                    distance: 14.2,
                    coordinates: [
                        [40.712, -74.006],
                        [40.715, -74.015],
                        [40.725, -74.025],
                        [40.735, -74.015],
                        [40.745, -74.001]
                    ],
                    isRecommended: true,
                    isCurrent: false
                },
                {
                    pathId: 'Route C',
                    waypoints: ['Warehouse A', 'Industrial Blvd', 'Highway 202', 'City Center', 'Park Ave', 'Customer HQ'],
                    trafficCondition: 'high',
                    estimatedTime: 55,
                    distance: 11.8,
                    coordinates: [
                        [40.712, -74.006],
                        [40.708, -74.015],
                        [40.715, -74.025],
                        [40.725, -74.020],
                        [40.735, -74.010],
                        [40.745, -74.001]
                    ],
                    isRecommended: false,
                    isCurrent: false
                }
            ],
            coordinates: {
                start: [40.712, -74.006],
                end: [40.745, -74.001],
                current: [40.725, -74.018]
            }
        },
        delivery2: {
            deliveryId: 'DEL-2023-002',
            startPoint: 'Distribution Center B, 789 Oak St',
            endPoint: 'Retail Store, 321 Maple Ave',
            currentPath: 'Route X via Interstate 95',
            status: 'delayed',
            estimatedArrival: '2023-06-15 16:45',
            notification: {
                type: 'error',
                message: 'Delivery delayed due to accident on Interstate 95. ETA extended by 30 minutes.'
            },
            timeline: [
                {
                    time: '09:30 AM',
                    title: 'Order Processed',
                    description: 'Order confirmed and ready for dispatch',
                    status: 'completed'
                },
                {
                    time: '10:45 AM',
                    title: 'Departed Distribution Center',
                    description: 'Vehicle left Distribution Center B with package',
                    status: 'completed'
                },
                {
                    time: '12:15 PM',
                    title: 'Delay Reported',
                    description: 'Accident on Interstate 95 causing delays',
                    status: 'current'
                },
                {
                    time: '04:45 PM',
                    title: 'Estimated Delivery',
                    description: 'Expected arrival at Retail Store (delayed)',
                    status: 'pending'
                }
            ],
            possiblePaths: [
                {
                    pathId: 'Route X',
                    waypoints: ['Distribution Center B', 'Oak St', 'Interstate 95', 'Exit 23', 'Maple Ave', 'Retail Store'],
                    trafficCondition: 'high',
                    estimatedTime: 75,
                    distance: 18.3,
                    coordinates: [
                        [40.752, -74.026],
                        [40.758, -74.032],
                        [40.765, -74.038],
                        [40.772, -74.035],
                        [40.778, -74.028],
                        [40.785, -74.021]
                    ],
                    isRecommended: false,
                    isCurrent: true
                },
                {
                    pathId: 'Route Y',
                    waypoints: ['Distribution Center B', 'Cedar St', 'Highway 1', 'Maple Ave', 'Retail Store'],
                    trafficCondition: 'medium',
                    estimatedTime: 65,
                    distance: 20.1,
                    coordinates: [
                        [40.752, -74.026],
                        [40.755, -74.035],
                        [40.765, -74.045],
                        [40.775, -74.035],
                        [40.785, -74.021]
                    ],
                    isRecommended: true,
                    isCurrent: false
                }
            ],
            coordinates: {
                start: [40.752, -74.026],
                end: [40.785, -74.021],
                current: [40.765, -74.038]
            }
        },
        delivery3: {
            deliveryId: 'DEL-2023-003',
            startPoint: 'Fulfillment Center C, 555 Pine St',
            endPoint: 'Residential Address, 777 Elm St',
            currentPath: 'Route Z via Local Roads',
            status: 'completed',
            estimatedArrival: '2023-06-15 11:15',
            notification: null,
            timeline: [
                {
                    time: '07:45 AM',
                    title: 'Order Processed',
                    description: 'Order confirmed and ready for dispatch',
                    status: 'completed'
                },
                {
                    time: '08:30 AM',
                    title: 'Departed Fulfillment Center',
                    description: 'Vehicle left Fulfillment Center C with package',
                    status: 'completed'
                },
                {
                    time: '09:45 AM',
                    title: 'Route Optimization',
                    description: 'Route optimized to avoid school zone traffic',
                    status: 'completed'
                },
                {
                    time: '11:15 AM',
                    title: 'Delivered',
                    description: 'Package delivered to Residential Address',
                    status: 'completed'
                }
            ],
            possiblePaths: [
                {
                    pathId: 'Route Z',
                    waypoints: ['Fulfillment Center C', 'Pine St', 'Local Roads', 'Elm St', 'Residential Address'],
                    trafficCondition: 'low',
                    estimatedTime: 35,
                    distance: 8.7,
                    coordinates: [
                        [40.732, -74.046],
                        [40.738, -74.052],
                        [40.745, -74.058],
                        [40.752, -74.055],
                        [40.758, -74.048]
                    ],
                    isRecommended: true,
                    isCurrent: true
                }
            ],
            coordinates: {
                start: [40.732, -74.046],
                end: [40.758, -74.048],
                current: [40.758, -74.048]
            }
        }
    };
}

/**
 * Update the delivery display with current delivery data
 */
function updateDeliveryDisplay() {
    console.log("Updating delivery display");
    const delivery = state.deliveries[state.currentDeliveryId];
    
    if (!delivery) {
        console.error('Delivery not found:', state.currentDeliveryId);
        return;
    }
    
    // Update basic info
    if (elements.deliveryId) elements.deliveryId.textContent = delivery.deliveryId;
    if (elements.startPoint) elements.startPoint.textContent = delivery.startPoint;
    if (elements.endPoint) elements.endPoint.textContent = delivery.endPoint;
    if (elements.currentPath) elements.currentPath.textContent = delivery.currentPath;
    if (elements.estimatedArrival) elements.estimatedArrival.textContent = delivery.estimatedArrival;
    
    // Update status with appropriate class
    if (elements.status) {
        elements.status.textContent = delivery.status.replace('-', ' ');
        elements.status.className = 'info-value status-badge ' + delivery.status;
    }
    
    // Update notification
    if (elements.notification && elements.notificationText) {
        if (delivery.notification) {
            elements.notification.classList.remove('hidden');
            elements.notification.classList.remove('warning', 'error', 'info');
            elements.notification.classList.add(delivery.notification.type);
            elements.notificationText.textContent = delivery.notification.message;
        } else {
            elements.notification.classList.add('hidden');
        }
    }
    
    // Update timeline
    updateTimeline(delivery.timeline);
    
    // Update route options
    updateRouteOptions();
    
    console.log("Delivery display updated successfully");
}

/**
 * Update the timeline display
 * @param {Array} timeline - Timeline data
 */
function updateTimeline(timeline) {
    if (!elements.routeTimeline) {
        console.error("Route timeline element not found");
        return;
    }
    
    elements.routeTimeline.innerHTML = '';
    
    timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-dot ${item.status}"></div>
            <div class="timeline-content">
                <div class="timeline-time">${item.time}</div>
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-description">${item.description}</div>
            </div>
        `;
        
        elements.routeTimeline.appendChild(timelineItem);
    });
}

/**
 * Update route options display
 */
function updateRouteOptions() {
    if (!elements.routeOptions) {
        console.error("Route options element not found");
        return;
    }
    
    const delivery = state.deliveries[state.currentDeliveryId];
    
    if (!delivery) {
        console.error('Delivery not found:', state.currentDeliveryId);
        return;
    }
    
    // Sort routes based on selected criteria
    const sortCriteria = elements.routeSort ? elements.routeSort.value : 'time';
    const sortedRoutes = [...delivery.possiblePaths].sort((a, b) => {
        switch (sortCriteria) {
            case 'time':
                return a.estimatedTime - b.estimatedTime;
            case 'traffic':
                const trafficOrder = { 'low': 1, 'medium': 2, 'high': 3 };
                return trafficOrder[a.trafficCondition] - trafficOrder[b.trafficCondition];
            case 'distance':
                return a.distance - b.distance;
            default:
                return 0;
        }
    });
    
    // Clear existing options
    elements.routeOptions.innerHTML = '';
    
    // Add route cards
    sortedRoutes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.className = 'route-card';
        if (route.isCurrent) routeCard.classList.add('selected');
        if (route.isRecommended) routeCard.classList.add('recommended');
        
        routeCard.innerHTML = `
            <h3>${route.pathId}</h3>
            <div class="route-card-content">
                <div class="route-info-row">
                    <span class="route-info-label">Traffic:</span>
                    <span class="traffic-indicator ${route.trafficCondition}">${route.trafficCondition.charAt(0).toUpperCase() + route.trafficCondition.slice(1)}</span>
                </div>
                <div class="route-info-row">
                    <span class="route-info-label">Est. Time:</span>
                    <span class="route-info-value">${route.estimatedTime} min</span>
                </div>
                <div class="route-info-row">
                    <span class="route-info-label">Distance:</span>
                    <span class="route-info-value">${route.distance} miles</span>
                </div>
                <div class="route-info-row">
                    <span class="route-info-label">Via:</span>
                    <span class="route-info-value">${route.waypoints[2]}</span>
                </div>
            </div>
            <div class="route-card-footer">
                <span class="route-eta">ETA: ${getETA(route.estimatedTime)}</span>
                <span class="route-distance">${route.waypoints.length - 2} stops</span>
            </div>
        `;
        
        // Add click event to show route details
        routeCard.addEventListener('click', () => {
            showRouteDetails(route);
        });
        
        elements.routeOptions.appendChild(routeCard);
    });
}

/**
 * Calculate ETA based on current time and estimated minutes
 * @param {number} minutes - Estimated minutes
 * @returns {string} Formatted ETA time
 */
function getETA(minutes) {
    const now = new Date();
    const eta = new Date(now.getTime() + minutes * 60000);
    
    const hours = eta.getHours();
    const mins = eta.getMinutes();
    
    return `${hours % 12 || 12}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
}

/**
 * Update the route map
 */
function updateRouteMap() {
    if (!state.map) {
        console.error("Map not initialized");
        return;
    }
    
    // Clear existing layers
    clearMapLayers();
    
    const viewMode = elements.mapViewSelector ? elements.mapViewSelector.value : 'all';
    
    if (viewMode === 'all') {
        // Show all deliveries
        Object.values(state.deliveries).forEach(delivery => {
            addDeliveryToMap(delivery);
        });
        
        // Fit bounds to all markers
        const allMarkers = [];
        Object.values(state.routeLayers).forEach(layer => {
            if (layer.getBounds) {
                allMarkers.push(layer.getBounds());
            }
        });
        
        if (allMarkers.length > 0) {
            state.map.fitBounds(L.featureGroup(Object.values(state.routeLayers)).getBounds());
        }
    } else {
        // Filter deliveries by status
        Object.values(state.deliveries).forEach(delivery => {
            if ((viewMode === 'active' && delivery.status === 'in-transit') ||
                (viewMode === 'delayed' && delivery.status === 'delayed')) {
                addDeliveryToMap(delivery);
            }
        });
        
        // Fit bounds to filtered markers
        const filteredMarkers = [];
        Object.values(state.routeLayers).forEach(layer => {
            if (layer.getBounds) {
                filteredMarkers.push(layer.getBounds());
            }
        });
        
        if (filteredMarkers.length > 0) {
            state.map.fitBounds(L.featureGroup(Object.values(state.routeLayers)).getBounds());
        }
    }
}

/**
 * Clear all map layers
 */
function clearMapLayers() {
    if (!state.map) return;
    
    Object.values(state.routeLayers).forEach(layer => {
        state.map.removeLayer(layer);
    });
    
    state.routeLayers = {};
}

/**
 * Add a delivery to the map
 * @param {Object} delivery - Delivery data
 */
function addDeliveryToMap(delivery) {
    if (!state.map) return;
    
    // Add start marker
    const startMarker = L.marker(delivery.coordinates.start, {
        icon: L.divIcon({
            className: 'map-marker start-marker',
            html: '<div class="marker-icon start"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).bindPopup(`<b>Start:</b> ${delivery.startPoint}`);
    
    // Add end marker
    const endMarker = L.marker(delivery.coordinates.end, {
        icon: L.divIcon({
            className: 'map-marker end-marker',
            html: '<div class="marker-icon end"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).bindPopup(`<b>Destination:</b> ${delivery.endPoint}`);
    
    // Add current position marker if not completed
    let currentMarker = null;
    if (delivery.status !== 'completed') {
        currentMarker = L.marker(delivery.coordinates.current, {
            icon: L.divIcon({
                className: 'map-marker current-marker',
                html: '<div class="marker-icon current"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).bindPopup(`<b>Current Location:</b> ${delivery.currentPath}`);
    }
    
    // Add route lines for all possible paths
    const routeLines = [];
    delivery.possiblePaths.forEach(path => {
        const color = path.isCurrent ? '#0066cc' : (path.isRecommended ? '#28a745' : '#6c757d');
        const opacity = path.isCurrent ? 1 : (path.isRecommended ? 0.8 : 0.5);
        const weight = path.isCurrent ? 5 : (path.isRecommended ? 4 : 3);
        
        const routeLine = L.polyline(path.coordinates, {
            color: color,
            weight: weight,
            opacity: opacity,
            dashArray: path.isCurrent ? null : '5, 10'
        }).bindPopup(`<b>${path.pathId}</b><br>Traffic: ${path.trafficCondition}<br>ETA: ${path.estimatedTime} min`);
        
        routeLines.push(routeLine);
    });
    
    // Create a feature group for this delivery
    const deliveryGroup = L.featureGroup([
        startMarker,
        endMarker,
        ...(currentMarker ? [currentMarker] : []),
        ...routeLines
    ]);
    
    // Add to map and store in layers
    deliveryGroup.addTo(state.map);
    state.routeLayers[delivery.deliveryId] = deliveryGroup;
}

/**
 * Show route details in modal
 * @param {Object} route - Route data
 */
function showRouteDetails(route) {
    if (!elements.routeDetailModal || !elements.modalRouteInfo) {
        console.error("Modal elements not found");
        return;
    }
    
    // Store selected route
    state.selectedRouteOption = route;
    
    // Update modal content
    elements.modalRouteInfo.innerHTML = `
        <h4>${route.pathId}</h4>
        <div class="route-info-grid">
            <div class="info-item">
                <span class="info-label">Traffic Condition:</span>
                <span class="info-value">
                    <span class="traffic-indicator ${route.trafficCondition}">${route.trafficCondition.charAt(0).toUpperCase() + route.trafficCondition.slice(1)}</span>
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">Estimated Time:</span>
                <span class="info-value">${route.estimatedTime} minutes</span>
            </div>
            <div class="info-item">
                <span class="info-label">Distance:</span>
                <span class="info-value">${route.distance} miles</span>
            </div>
            <div class="info-item">
                <span class="info-label">ETA:</span>
                <span class="info-value">${getETA(route.estimatedTime)}</span>
            </div>
        </div>
    `;
    
    // Initialize modal map if not already
    if (!state.modalMap && elements.modalRouteMap) {
        try {
            state.modalMap = L.map(elements.modalRouteMap).setView([40.7128, -74.0060], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(state.modalMap);
        } catch (error) {
            console.error("Error initializing modal map:", error);
            if (elements.modalRouteMap) {
                elements.modalRouteMap.innerHTML = '<div class="map-error">Error initializing map. Please check console for details.</div>';
            }
        }
    }
    
    // Clear previous layers
    if (state.modalMap) {
        state.modalMap.eachLayer(layer => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                state.modalMap.removeLayer(layer);
            }
        });
        
        // Add route to modal map
        const routeLine = L.polyline(route.coordinates, {
            color: '#0066cc',
            weight: 5
        }).addTo(state.modalMap);
        
        // Add start and end markers
        L.marker(route.coordinates[0], {
            icon: L.divIcon({
                className: 'map-marker start-marker',
                html: '<div class="marker-icon start"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(state.modalMap);
        
        L.marker(route.coordinates[route.coordinates.length - 1], {
            icon: L.divIcon({
                className: 'map-marker end-marker',
                html: '<div class="marker-icon end"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(state.modalMap);
        
        // Fit map to route
        state.modalMap.fitBounds(routeLine.getBounds());
    }
    
    // Update waypoints
    if (elements.modalWaypoints) {
        elements.modalWaypoints.innerHTML = '';
        route.waypoints.forEach((waypoint, index) => {
            const waypointItem = document.createElement('div');
            waypointItem.className = 'waypoint-item';
            
            let iconClass = 'waypoint';
            if (index === 0) iconClass = 'start';
            if (index === route.waypoints.length - 1) iconClass = 'end';
            
            waypointItem.innerHTML = `
                <div class="waypoint-icon ${iconClass}">${index + 1}</div>
                <div class="waypoint-content">
                    <div class="waypoint-name">${waypoint}</div>
                    <div class="waypoint-address">Estimated arrival: ${getWaypointETA(route.estimatedTime, index, route.waypoints.length)}</div>
                </div>
            `;
            
            elements.modalWaypoints.appendChild(waypointItem);
        });
    }
    
    // Show modal
    elements.routeDetailModal.classList.add('active');
    
    // Invalidate map size after modal is visible
    if (state.modalMap) {
        setTimeout(() => {
            state.modalMap.invalidateSize();
        }, 100);
    }
}

/**
 * Calculate estimated arrival time at a waypoint
 * @param {number} totalMinutes - Total estimated minutes for the route
 * @param {number} waypointIndex - Index of the waypoint
 * @param {number} totalWaypoints - Total number of waypoints
 * @returns {string} Formatted ETA
 */
function getWaypointETA(totalMinutes, waypointIndex, totalWaypoints) {
    // Simple calculation: distribute time proportionally
    const minutesPerSegment = totalMinutes / (totalWaypoints - 1);
    const waypointMinutes = Math.round(minutesPerSegment * waypointIndex);
    
    return getETA(waypointMinutes);
}

/**
 * Update route with selected option
 */
function updateRoute() {
    const delivery = state.deliveries[state.currentDeliveryId];
    
    if (!delivery) {
        console.error('Delivery not found:', state.currentDeliveryId);
        return;
    }
    
    // If a route is selected, use it
    if (state.selectedRouteOption) {
        selectRoute(state.selectedRouteOption);
    } else {
        // Otherwise, find the recommended route
        const recommendedRoute = delivery.possiblePaths.find(route => route.isRecommended);
        if (recommendedRoute) {
            selectRoute(recommendedRoute);
        } else {
            showNotification('No recommended route available. Please select a route manually.', 'warning');
        }
    }
}

/**
 * Select a route and update the current path
 * @param {Object} route - Selected route
 */
function selectRoute(route) {
    const delivery = state.deliveries[state.currentDeliveryId];
    
    if (!delivery) {
        console.error('Delivery not found:', state.currentDeliveryId);
        return;
    }
    
    // Update current path
    delivery.currentPath = `${route.pathId} via ${route.waypoints[2]}`;
    
    // Update route status
    delivery.possiblePaths.forEach(path => {
        path.isCurrent = (path.pathId === route.pathId);
    });
    
    // Add a timeline entry
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    delivery.timeline.push({
        time: timeString,
        title: 'Route Updated',
        description: `Route changed to ${route.pathId} via ${route.waypoints[2]}`,
        status: 'current'
    });
    
    // Update previous current to completed
    const previousCurrentIndex = delivery.timeline.findIndex(item => item.status === 'current' && item !== delivery.timeline[delivery.timeline.length - 1]);
    if (previousCurrentIndex !== -1) {
        delivery.timeline[previousCurrentIndex].status = 'completed';
    }
    
    // Update UI
    updateDeliveryDisplay();
    updateRouteMap();
    
    // Update stats
    if (elements.routeAdjustments) {
        state.routeAdjustments = (parseInt(elements.routeAdjustments.textContent) || 0) + 1;
        elements.routeAdjustments.textContent = state.routeAdjustments;
    }
    
    showNotification('Route updated successfully!', 'success');
}

/**
 * Optimize route automatically
 */
function optimizeRoute() {
    const delivery = state.deliveries[state.currentDeliveryId];
    
    if (!delivery) {
        console.error('Delivery not found:', state.currentDeliveryId);
        return;
    }
    
    // Find the recommended route
    const recommendedRoute = delivery.possiblePaths.find(route => route.isRecommended);
    
    if (recommendedRoute) {
        selectRoute(recommendedRoute);
        showNotification('Route optimized automatically!', 'success');
    } else {
        // If no recommended route, find the one with lowest traffic and time
        const bestRoute = delivery.possiblePaths.reduce((best, current) => {
            const trafficScore = { 'low': 1, 'medium': 2, 'high': 3 };
            const currentScore = trafficScore[current.trafficCondition] * 10 + current.estimatedTime;
            const bestScore = trafficScore[best.trafficCondition] * 10 + best.estimatedTime;
            
            return currentScore < bestScore ? current : best;
        }, delivery.possiblePaths[0]);
        
        selectRoute(bestRoute);
        showNotification('Route optimized based on traffic and time!', 'success');
    }
}

/**
 * Filter routes based on search term
 * @param {string} searchTerm - Search term
 */
function filterRoutes(searchTerm) {
    const routeCards = elements.routeOptions ? elements.routeOptions.querySelectorAll('.route-card') : [];
    
    routeCards.forEach(card => {
        const routeName = card.querySelector('h3').textContent.toLowerCase();
        const routeInfo = card.textContent.toLowerCase();
        
        if (routeName.includes(searchTerm) || routeInfo.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Update dashboard stats
 */
function updateStats() {
    // Count active routes
    const activeRoutes = Object.values(state.deliveries).filter(delivery => 
        delivery.status === 'in-transit'
    ).length;
    if (elements.activeRoutesCount) elements.activeRoutesCount.textContent = activeRoutes;
    
    // Calculate average delivery time
    const deliveryTimes = Object.values(state.deliveries)
        .map(delivery => {
            const currentRoute = delivery.possiblePaths.find(path => path.isCurrent);
            return currentRoute ? currentRoute.estimatedTime : 0;
        })
        .filter(time => time > 0);
    
    const avgTime = deliveryTimes.length > 0 
        ? Math.round(deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length) 
        : 0;
    if (elements.avgDeliveryTime) elements.avgDeliveryTime.textContent = `${avgTime} min`;
    
    // Count route adjustments (this would normally come from the API)
    if (elements.routeAdjustments) elements.routeAdjustments.textContent = '12';
    
    // Count traffic incidents
    const incidents = Object.values(state.deliveries)
        .filter(delivery => delivery.notification && 
               (delivery.notification.type === 'warning' || delivery.notification.type === 'error'))
        .length;
    if (elements.trafficIncidents) elements.trafficIncidents.textContent = incidents;
}

/**
 * Show loading state
 */
function showLoading() {
    // Add loading indicator if needed
    console.log('Loading...');
}

/**
 * Hide loading state
 */
function hideLoading() {
    // Remove loading indicator if needed
    console.log('Loading complete');
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    console.log(`Notification (${type}): ${message}`);
    
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification-toast');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification-toast';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification-toast ${type}`;
    
    // Show notification
    notification.classList.add('active');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Add notification toast styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .notification-toast.active {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification-toast.success {
        background-color: var(--status-green);
    }
    
    .notification-toast.warning {
        background-color: var(--alert-warning);
    }
    
    .notification-toast.error {
        background-color: var(--alert-critical);
    }
    
    .notification-toast.info {
        background-color: var(--primary-color);
    }
    
    .map-marker .marker-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .map-marker .marker-icon svg {
        width: 20px;
        height: 20px;
    }
    
    .map-marker .marker-icon.start {
        color: var(--status-green);
    }
    
    .map-marker .marker-icon.end {
        color: var(--alert-critical);
    }
    
    .map-marker .marker-icon.current {
        color: var(--primary-color);
    }
    
    .map-marker .marker-icon.waypoint {
        color: var(--text-light);
    }
    
    .map-error {
        padding: 20px;
        background-color: #ffebee;
        color: #d32f2f;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
    }
`;

document.head.appendChild(notificationStyles);