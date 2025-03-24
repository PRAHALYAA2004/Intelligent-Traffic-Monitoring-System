/**
 * Traffic Risk Management
 * Script for managing traffic risks, accident-prone zones, and diversions
 */

// Mock data for demonstration
const mockRiskZones = [
    {
      id: "risk1",
      name: "Main Street Intersection",
      location: "Main St & 5th Ave",
      riskLevel: "high",
      incidents: 12,
      traffic: "15,000 vehicles",
      peakHours: "8:00 - 10:00, 17:00 - 19:00",
      factors: "Poor visibility, Intersection design",
      coordinates: [28.6139, 77.209],
    },
    {
      id: "risk2",
      name: "Highway 101 Curve",
      location: "Highway 101, Mile 42",
      riskLevel: "high",
      incidents: 8,
      traffic: "22,000 vehicles",
      peakHours: "7:00 - 9:00, 16:00 - 18:00",
      factors: "Sharp curve, High speed",
      coordinates: [28.6229, 77.208],
    },
    {
      id: "risk3",
      name: "Downtown Bridge",
      location: "River Bridge, Downtown",
      riskLevel: "medium",
      incidents: 5,
      traffic: "18,000 vehicles",
      peakHours: "8:30 - 10:30, 16:30 - 18:30",
      factors: "Narrow lanes, Merging traffic",
      coordinates: [28.6339, 77.219],
    },
    {
      id: "risk4",
      name: "School Zone Crossing",
      location: "Oak St near Central School",
      riskLevel: "medium",
      incidents: 4,
      traffic: "8,000 vehicles",
      peakHours: "7:30 - 8:30, 14:30 - 15:30",
      factors: "Pedestrian crossing, School traffic",
      coordinates: [28.6039, 77.229],
    },
    {
      id: "risk5",
      name: "Industrial Park Entrance",
      location: "Commerce Dr & Factory Rd",
      riskLevel: "high",
      incidents: 7,
      traffic: "12,000 vehicles",
      peakHours: "6:00 - 8:00, 15:00 - 17:00",
      factors: "Heavy trucks, Poor signage",
      coordinates: [28.6239, 77.199],
    },
    {
      id: "risk6",
      name: "Shopping Mall Exit",
      location: "Retail Dr & Highway 10",
      riskLevel: "medium",
      incidents: 6,
      traffic: "20,000 vehicles",
      peakHours: "12:00 - 14:00, 17:00 - 19:00",
      factors: "Congestion, Multiple lanes",
      coordinates: [28.6159, 77.229],
    },
    {
      id: "risk7",
      name: "Hospital Approach",
      location: "Medical Center Rd",
      riskLevel: "low",
      incidents: 3,
      traffic: "10,000 vehicles",
      peakHours: "8:00 - 17:00",
      factors: "Emergency vehicles, Pedestrians",
      coordinates: [28.6339, 77.239],
    },
    {
      id: "risk8",
      name: "Railway Crossing",
      location: "Train St & Commerce Ave",
      riskLevel: "high",
      incidents: 9,
      traffic: "14,000 vehicles",
      peakHours: "7:00 - 9:00, 16:00 - 18:00",
      factors: "Railway crossing, Limited visibility",
      coordinates: [28.6439, 77.219],
    },
  ];
  
  const mockDiversions = [
    {
      id: "div1",
      name: "Main St Diversion",
      location: "Main St between 4th and 6th Ave",
      reason: "accident",
      status: "active",
      startTime: "2023-06-15T08:30:00",
      endTime: "2023-06-15T14:30:00",
      route: "Detour via Park Ave, then 6th St, returning to Main St at 7th Ave",
      coordinates: [
        [28.6139, 77.209],
        [28.6159, 77.211],
        [28.6179, 77.213],
      ],
    },
    {
      id: "div2",
      name: "Highway 101 Reroute",
      location: "Highway 101, Miles 40-45",
      reason: "construction",
      status: "scheduled",
      startTime: "2023-06-16T22:00:00",
      endTime: "2023-06-17T05:00:00",
      route: "Detour via Route 202, then County Road 15, returning to Highway 101 at Mile 46",
      coordinates: [
        [28.6229, 77.208],
        [28.6249, 77.21],
        [28.6269, 77.212],
      ],
    },
    {
      id: "div3",
      name: "Downtown Festival Closure",
      location: "Main St & Center Ave",
      reason: "event",
      status: "active",
      startTime: "2023-06-15T10:00:00",
      endTime: "2023-06-15T22:00:00",
      route: "Multiple detours via Broadway, Park Ave, and River Rd",
      coordinates: [
        [28.6339, 77.219],
        [28.6359, 77.221],
        [28.6379, 77.223],
      ],
    },
    {
      id: "div4",
      name: "School Zone Safety Diversion",
      location: "Oak St near Central School",
      reason: "congestion",
      status: "active",
      startTime: "2023-06-15T07:30:00",
      endTime: "2023-06-15T16:30:00",
      route: "Detour via Elm St and Pine Ave during school hours",
      coordinates: [
        [28.6039, 77.229],
        [28.6059, 77.231],
        [28.6079, 77.233],
      ],
    },
    {
      id: "div5",
      name: "Bridge Maintenance Detour",
      location: "River Bridge, Downtown",
      reason: "construction",
      status: "scheduled",
      startTime: "2023-06-17T23:00:00",
      endTime: "2023-06-18T05:00:00",
      route: "Detour via North Bridge, 3 miles upstream",
      coordinates: [
        [28.6239, 77.199],
        [28.6259, 77.201],
        [28.6279, 77.203],
      ],
    },
  ];
  
  // DOM Elements
  const elements = {
    // Map elements
    riskMap: document.getElementById("risk-map"),
    mapViewSelector: document.getElementById("mapViewSelector"),
    refreshMap: document.getElementById("refreshMap"),
  
    // Risk zones elements
    riskZonesList: document.getElementById("riskZonesList"),
    riskZoneFilter: document.getElementById("riskZoneFilter"),
    refreshRiskZones: document.getElementById("refreshRiskZones"),
  
    // Diversions elements
    diversionsList: document.getElementById("diversionsList"),
    createDiversionBtn: document.getElementById("createDiversionBtn"),
  
    // Modals
    createDiversionModal: document.getElementById("createDiversionModal"),
    riskZoneModal: document.getElementById("riskZoneModal"),
  
    // Modal elements
    saveDiversionBtn: document.getElementById("saveDiversionBtn"),
    createDiversionFromRiskBtn: document.getElementById("createDiversionFromRiskBtn"),
    viewHistoricalDataBtn: document.getElementById("viewHistoricalDataBtn"),
  
    // Risk zone modal elements
    riskZoneTitle: document.getElementById("riskZoneTitle"),
    riskLevelDetail: document.getElementById("riskLevelDetail"),
    locationDetail: document.getElementById("locationDetail"),
    incidentsDetail: document.getElementById("incidentsDetail"),
    trafficDetail: document.getElementById("trafficDetail"),
    peakHoursDetail: document.getElementById("peakHoursDetail"),
    factorsDetail: document.getElementById("factorsDetail"),
    recommendedActionsList: document.getElementById("recommendedActionsList"),
  
    // Charts
    riskPredictionChart: document.getElementById("riskPredictionChart"),
    incidentHistoryChart: document.getElementById("incidentHistoryChart"),
  
    // Close modal buttons
    closeModalBtns: document.querySelectorAll(".close-modal, .close-modal-btn"),
  };
  
  // Map variables
  let map;
  let riskZonesLayer;
  let diversionsLayer;
  let congestionLayer;
  
  // Initialize when document is ready
  document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
  });
  
  /**
   * Initialize the application
   */
  function initializeApp() {
    // Initialize the map
    initMap();
  
    // Load data
    loadData();
  
    // Set up event listeners
    setupEventListeners();
  
    // Initialize charts
    initCharts();
  }
  
  /**
   * Initialize the map
   */
  function initMap() {
    // Check if map element exists
    if (!elements.riskMap) {
      console.error("Map element not found");
      return;
    }
  
    try {
      // Create a map centered on a default location (Delhi for this example)
      map = L.map("risk-map").setView([28.6139, 77.209], 12);
  
      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
  
      // Create layer groups
      riskZonesLayer = L.layerGroup().addTo(map);
      diversionsLayer = L.layerGroup().addTo(map);
      congestionLayer = L.layerGroup().addTo(map);
  
      // Add risk zones to the map
      addRiskZonesToMap();
  
      // Add diversions to the map
      addDiversionsToMap();
  
      // Add congestion to the map
      addCongestionToMap();
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }
  
  /**
   * Add risk zones to the map
   */
  function addRiskZonesToMap() {
    // Clear existing markers
    riskZonesLayer.clearLayers();
  
    // Add risk zones
    mockRiskZones.forEach((zone) => {
      // Determine color based on risk level
      let color = "#28a745"; // low risk (green)
      if (zone.riskLevel === "high") {
        color = "#dc3545"; // high risk (red)
      } else if (zone.riskLevel === "medium") {
        color = "#fd7e14"; // medium risk (orange)
      }
  
      // Create circle marker
      const marker = L.circleMarker([zone.coordinates[0], zone.coordinates[1]], {
        radius: 15,
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        weight: 2,
      }).addTo(riskZonesLayer);
  
      // Add popup
      marker.bindPopup(`
              <strong>${zone.name}</strong><br>
              Risk Level: <span style="color:${color};font-weight:bold;">${zone.riskLevel.toUpperCase()}</span><br>
              Incidents: ${zone.incidents}<br>
              <button class="map-popup-btn" onclick="openRiskZoneModal('${zone.id}')">View Details</button>
          `);
  
      // Store zone id on marker for reference
      marker.zoneId = zone.id;
    });
  }
  
  /**
   * Add diversions to the map
   */
  function addDiversionsToMap() {
    // Clear existing diversions
    diversionsLayer.clearLayers();
  
    // Add diversions
    mockDiversions.forEach((diversion) => {
      // Only show active or scheduled diversions
      if (diversion.status === "active" || diversion.status === "scheduled") {
        // Create polyline for the diversion route
        const line = L.polyline(diversion.coordinates, {
          color: "#0066cc",
          weight: 5,
          opacity: 0.7,
          dashArray: diversion.status === "scheduled" ? "10, 10" : null,
        }).addTo(diversionsLayer);
  
        // Add popup
        line.bindPopup(`
                  <strong>${diversion.name}</strong><br>
                  Status: ${diversion.status.toUpperCase()}<br>
                  Reason: ${formatReason(diversion.reason)}<br>
                  <button class="map-popup-btn" onclick="viewDiversionDetails('${diversion.id}')">View Details</button>
              `);
  
        // Add start and end markers
        const startMarker = L.marker(diversion.coordinates[0], {
          icon: L.divIcon({
            className: "diversion-marker start",
            html: '<div style="background-color:#0066cc;width:10px;height:10px;border-radius:50%;border:2px solid white;"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          }),
        }).addTo(diversionsLayer);
  
        const endMarker = L.marker(diversion.coordinates[diversion.coordinates.length - 1], {
          icon: L.divIcon({
            className: "diversion-marker end",
            html: '<div style="background-color:#0066cc;width:10px;height:10px;border-radius:50%;border:2px solid white;"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          }),
        }).addTo(diversionsLayer);
  
        // Store diversion id on line for reference
        line.diversionId = diversion.id;
      }
    });
  }
  
  /**
   * Add congestion to the map
   */
  function addCongestionToMap() {
    // Clear existing congestion
    congestionLayer.clearLayers();
  
    // Mock congestion data - in a real app, this would come from real-time traffic data
    const congestionAreas = [
      {
        center: [28.6139, 77.209],
        radius: 300,
        level: "high",
      },
      {
        center: [28.6229, 77.208],
        radius: 200,
        level: "medium",
      },
      {
        center: [28.6339, 77.219],
        radius: 250,
        level: "high",
      },
      {
        center: [28.6039, 77.229],
        radius: 150,
        level: "low",
      },
    ];
  
    // Add congestion areas
    congestionAreas.forEach((area) => {
      // Determine color based on congestion level
      let color = "#28a745"; // low congestion (green)
      let opacity = 0.2;
  
      if (area.level === "high") {
        color = "#dc3545"; // high congestion (red)
        opacity = 0.4;
      } else if (area.level === "medium") {
        color = "#fd7e14"; // medium congestion (orange)
        opacity = 0.3;
      }
  
      // Create circle
      const circle = L.circle(area.center, {
        radius: area.radius,
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        weight: 1,
      }).addTo(congestionLayer);
  
      // Add popup
      circle.bindPopup(`
              <strong>Traffic Congestion</strong><br>
              Level: <span style="color:${color};font-weight:bold;">${area.level.toUpperCase()}</span><br>
              Estimated Delay: ${area.level === "high" ? "15-20 min" : area.level === "medium" ? "5-10 min" : "< 5 min"}
          `);
    });
  }
  
  /**
   * Load and display data
   */
  function loadData() {
    // Populate risk zones list
    populateRiskZonesList(mockRiskZones);
  
    // Populate diversions list
    populateDiversionsList(mockDiversions);
  }
  
  /**
   * Populate risk zones list
   */
  function populateRiskZonesList(zones) {
    if (!elements.riskZonesList) return;
  
    // Clear existing items
    elements.riskZonesList.innerHTML = "";
  
    // Filter zones based on selected risk level
    const riskFilter = elements.riskZoneFilter ? elements.riskZoneFilter.value : "all";
    const filteredZones = riskFilter === "all" ? zones : zones.filter((zone) => zone.riskLevel === riskFilter);
  
    // Add zone items
    filteredZones.forEach((zone) => {
      const item = document.createElement("li");
      item.className = "risk-zone-item";
  
      item.innerHTML = `
              <div class="risk-zone-info">
                  <span class="risk-level ${zone.riskLevel}"></span>
                  <div>
                      <div class="risk-zone-name">${zone.name}</div>
                      <div class="risk-zone-location">${zone.location}</div>
                  </div>
              </div>
              <div class="risk-zone-actions">
                  <button class="action-btn view-btn" data-zone-id="${zone.id}" title="View Details">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button class="action-btn divert-btn" data-zone-id="${zone.id}" title="Create Diversion">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
                  </button>
              </div>
          `;
  
      elements.riskZonesList.appendChild(item);
    });
  }
  
  /**
   * Populate diversions list
   */
  function populateDiversionsList(diversions) {
    if (!elements.diversionsList) return;
  
    // Clear existing items
    elements.diversionsList.innerHTML = "";
  
    // Add diversion items
    diversions.forEach((diversion) => {
      const item = document.createElement("li");
      item.className = "diversion-item";
  
      // Format dates
      const startTime = new Date(diversion.startTime).toLocaleString();
      const endTime = new Date(diversion.endTime).toLocaleString();
  
      item.innerHTML = `
              <div class="diversion-info">
                  <div class="diversion-name">${diversion.name}</div>
                  <div class="diversion-details">${diversion.location} • ${formatReason(diversion.reason)}</div>
                  <div class="diversion-details">${startTime} - ${endTime}</div>
              </div>
              <div class="diversion-status ${diversion.status}">${diversion.status}</div>
          `;
  
      elements.diversionsList.appendChild(item);
    });
  }
  
  /**
   * Format reason text
   */
  function formatReason(reason) {
    const reasons = {
      accident: "Accident",
      congestion: "Heavy Congestion",
      construction: "Road Construction",
      event: "Special Event",
      weather: "Weather Conditions",
    };
  
    return reasons[reason] || reason;
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Map view selector
    if (elements.mapViewSelector) {
      elements.mapViewSelector.addEventListener("change", () => {
        updateMapLayers(elements.mapViewSelector.value);
      });
    }
  
    // Refresh map button
    if (elements.refreshMap) {
      elements.refreshMap.addEventListener("click", () => {
        refreshMap();
      });
    }
  
    // Risk zone filter
    if (elements.riskZoneFilter) {
      elements.riskZoneFilter.addEventListener("change", () => {
        populateRiskZonesList(mockRiskZones);
      });
    }
  
    // Refresh risk zones button
    if (elements.refreshRiskZones) {
      elements.refreshRiskZones.addEventListener("click", () => {
        populateRiskZonesList(mockRiskZones);
      });
    }
  
    // Create diversion button
    if (elements.createDiversionBtn) {
      elements.createDiversionBtn.addEventListener("click", () => {
        openCreateDiversionModal();
      });
    }
  
    // Save diversion button
    if (elements.saveDiversionBtn) {
      elements.saveDiversionBtn.addEventListener("click", () => {
        saveDiversion();
      });
    }
  
    // Create diversion from risk button
    if (elements.createDiversionFromRiskBtn) {
      elements.createDiversionFromRiskBtn.addEventListener("click", () => {
        const zoneId = elements.riskZoneModal.dataset.zoneId;
        openCreateDiversionModal(zoneId);
      });
    }
  
    // View historical data button
    if (elements.viewHistoricalDataBtn) {
      elements.viewHistoricalDataBtn.addEventListener("click", () => {
        const zoneId = elements.riskZoneModal.dataset.zoneId;
        viewHistoricalData(zoneId);
      });
    }
  
    // Close modal buttons
    elements.closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        closeAllModals();
      });
    });
  
    // Event delegation for risk zone actions
    document.addEventListener("click", (e) => {
      // View risk zone button
      if (e.target.closest(".view-btn")) {
        const zoneId = e.target.closest(".view-btn").dataset.zoneId;
        openRiskZoneModal(zoneId);
      }
  
      // Create diversion from risk zone button
      if (e.target.closest(".divert-btn")) {
        const zoneId = e.target.closest(".divert-btn").dataset.zoneId;
        openCreateDiversionModal(zoneId);
      }
    });
  
    // Mobile menu toggle
    document.querySelector(".menu-toggle").addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("active");
    });
  }
  
  /**
   * Update map layers based on selected view
   */
  function updateMapLayers(view) {
    // Hide all layers first
    map.removeLayer(riskZonesLayer);
    map.removeLayer(diversionsLayer);
    map.removeLayer(congestionLayer);
  
    // Show selected layers
    if (view === "risk" || view === "all") {
      map.addLayer(riskZonesLayer);
    }
  
    if (view === "congestion" || view === "all") {
      map.addLayer(congestionLayer);
    }
  
    if (view === "diversions" || view === "all") {
      map.addLayer(diversionsLayer);
    }
  }
  
  /**
   * Refresh the map
   */
  function refreshMap() {
    // In a real application, this would fetch fresh data from the API
    // For demo purposes, we'll just reload the existing data
  
    // Refresh risk zones
    addRiskZonesToMap();
  
    // Refresh diversions
    addDiversionsToMap();
  
    // Refresh congestion
    addCongestionToMap();
  
    // Show notification
    showNotification("Map data refreshed successfully", "success");
  }
  
  /**
   * Open risk zone modal
   */
  function openRiskZoneModal(zoneId) {
    // Find the zone
    const zone = mockRiskZones.find((z) => z.id === zoneId);
    if (!zone) return;
  
    // Update modal content
    elements.riskZoneTitle.textContent = zone.name;
    elements.riskLevelDetail.textContent = zone.riskLevel.charAt(0).toUpperCase() + zone.riskLevel.slice(1);
    elements.riskLevelDetail.className = `detail-value risk-${zone.riskLevel}`;
    elements.locationDetail.textContent = zone.location;
    elements.incidentsDetail.textContent = zone.incidents;
    elements.trafficDetail.textContent = zone.traffic;
    elements.peakHoursDetail.textContent = zone.peakHours;
    elements.factorsDetail.textContent = zone.factors;
  
    // Store zone id on modal
    elements.riskZoneModal.dataset.zoneId = zoneId;
  
    // Populate recommended actions
    populateRecommendedActions(zone);
  
    // Initialize incident history chart
    initIncidentHistoryChart(zone);
  
    // Show the modal
    elements.riskZoneModal.classList.add("active");
  
    // Center map on the risk zone
    if (map) {
      map.setView(zone.coordinates, 15);
    }
  }
  
  /**
   * Populate recommended actions
   */
  function populateRecommendedActions(zone) {
    if (!elements.recommendedActionsList) return;
  
    // Clear existing items
    elements.recommendedActionsList.innerHTML = "";
  
    // Generate recommendations based on risk level and factors
    const recommendations = [];
  
    if (zone.riskLevel === "high") {
      recommendations.push("Implement immediate traffic diversion during peak hours");
      recommendations.push("Install additional warning signage");
      recommendations.push("Deploy traffic officers during peak hours");
      recommendations.push("Conduct engineering assessment for structural improvements");
    } else if (zone.riskLevel === "medium") {
      recommendations.push("Monitor traffic patterns during peak hours");
      recommendations.push("Evaluate signal timing adjustments");
      recommendations.push("Install speed monitoring displays");
    } else {
      recommendations.push("Routine monitoring of traffic conditions");
      recommendations.push("Scheduled maintenance checks");
    }
  
    // Add factor-specific recommendations
    if (zone.factors.includes("visibility")) {
      recommendations.push("Improve street lighting and visibility");
    }
  
    if (zone.factors.includes("design")) {
      recommendations.push("Review intersection design for potential improvements");
    }
  
    if (zone.factors.includes("speed")) {
      recommendations.push("Implement speed reduction measures");
    }
  
    if (zone.factors.includes("pedestrian")) {
      recommendations.push("Enhance pedestrian crossing safety features");
    }
  
    // Add recommendations to the list
    recommendations.forEach((recommendation) => {
      const item = document.createElement("li");
      item.textContent = recommendation;
      elements.recommendedActionsList.appendChild(item);
    });
  }
  
  /**
   * Open create diversion modal
   */
  function openCreateDiversionModal(zoneId) {
    // If zoneId is provided, pre-fill the form with zone data
    if (zoneId) {
      const zone = mockRiskZones.find((z) => z.id === zoneId);
      if (zone) {
        document.getElementById("diversionName").value = `${zone.name} Diversion`;
        document.getElementById("diversionLocation").value = zone.location;
  
        // Set default reason based on factors
        if (zone.factors.includes("congestion")) {
          document.getElementById("diversionReason").value = "congestion";
        } else {
          document.getElementById("diversionReason").value = "accident";
        }
  
        // Set default times
        const now = new Date();
        const later = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours later
  
        document.getElementById("diversionStart").value = now.toISOString().slice(0, 16);
        document.getElementById("diversionEnd").value = later.toISOString().slice(0, 16);
  
        // Suggest a route
        document.getElementById("diversionRoute").value =
          `Suggested diversion around ${zone.location} via alternate routes.`;
      }
    } else {
      // Clear the form
      document.getElementById("diversionForm").reset();
  
      // Set default times
      const now = new Date();
      const later = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours later
  
      document.getElementById("diversionStart").value = now.toISOString().slice(0, 16);
      document.getElementById("diversionEnd").value = later.toISOString().slice(0, 16);
    }
  
    // Show the modal
    elements.createDiversionModal.classList.add("active");
  }
  
  /**
   * Save diversion
   */
  function saveDiversion() {
    // Get form values
    const name = document.getElementById("diversionName").value;
    const location = document.getElementById("diversionLocation").value;
    const reason = document.getElementById("diversionReason").value;
    const startTime = document.getElementById("diversionStart").value;
    const endTime = document.getElementById("diversionEnd").value;
    const route = document.getElementById("diversionRoute").value;
  
    // Validate form
    if (!name || !location || !startTime || !endTime || !route) {
      showNotification("Please fill in all required fields", "error");
      return;
    }
  
    // In a real application, this would save to a database
    // For demo purposes, we'll just add it to our mock data
    const newDiversion = {
      id: `div${mockDiversions.length + 1}`,
      name,
      location,
      reason,
      status: "scheduled",
      startTime,
      endTime,
      route,
      coordinates: [
        [28.6139, 77.209],
        [28.6159, 77.211],
        [28.6179, 77.213],
      ], // Mock coordinates
    };
  
    mockDiversions.unshift(newDiversion);
  
    // Refresh diversions list
    populateDiversionsList(mockDiversions);
  
    // Refresh map
    addDiversionsToMap();
  
    // Close the modal
    closeAllModals();
  
    // Show notification
    showNotification("Diversion created successfully", "success");
  }
  
  /**
   * View historical data for a risk zone
   */
  function viewHistoricalData(zoneId) {
    // In a real application, this would navigate to a detailed historical data page
    // For demo purposes, we'll just show a notification
    showNotification("Historical data view would open in a real application", "info");
  }
  
  /**
   * Close all modals
   */
  function closeAllModals() {
    elements.createDiversionModal.classList.remove("active");
    elements.riskZoneModal.classList.remove("active");
  }
  
  /**
   * Initialize charts
   */
  function initCharts() {
    // Risk prediction chart
    initRiskPredictionChart();
  }
  
  /**
   * Initialize risk prediction chart
   */
  function initRiskPredictionChart() {
    if (!elements.riskPredictionChart) return;
  
    const ctx = elements.riskPredictionChart.getContext("2d");
  
    // Sample data for risk prediction
    const data = {
      labels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
      datasets: [
        {
          label: "High Risk Zones",
          data: [3, 2, 4, 8, 6, 5, 7, 4],
          borderColor: "#dc3545",
          backgroundColor: "rgba(220, 53, 69, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Medium Risk Zones",
          data: [8, 7, 9, 12, 10, 11, 13, 9],
          borderColor: "#fd7e14",
          backgroundColor: "rgba(253, 126, 20, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Low Risk Zones",
          data: [15, 14, 12, 10, 12, 14, 15, 16],
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  
    // Chart configuration
    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Zones",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
          },
        },
      },
    };
  
    // Create the chart
    const riskPredictionChart = new Chart(ctx, config);
  
    // Handle time range changes
    document.getElementById("predictionTimeRange").addEventListener("change", function () {
      const timeRange = this.value;
      let newLabels = [];
      let newHighRiskData = [];
      let newMediumRiskData = [];
      let newLowRiskData = [];
  
      // Update data based on selected time range
      if (timeRange === "day") {
        newLabels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
        newHighRiskData = [3, 2, 4, 8, 6, 5, 7, 4];
        newMediumRiskData = [8, 7, 9, 12, 10, 11, 13, 9];
        newLowRiskData = [15, 14, 12, 10, 12, 14, 15, 16];
      } else if (timeRange === "week") {
        newLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        newHighRiskData = [5, 6, 8, 7, 9, 4, 3];
        newMediumRiskData = [10, 11, 13, 12, 15, 9, 8];
        newLowRiskData = [14, 13, 11, 12, 10, 15, 16];
      } else if (timeRange === "month") {
        newLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        newHighRiskData = [6, 7, 5, 4];
        newMediumRiskData = [11, 13, 10, 9];
        newLowRiskData = [13, 11, 14, 15];
      }
  
      // Update chart data
      riskPredictionChart.data.labels = newLabels;
      riskPredictionChart.data.datasets[0].data = newHighRiskData;
      riskPredictionChart.data.datasets[1].data = newMediumRiskData;
      riskPredictionChart.data.datasets[2].data = newLowRiskData;
  
      // Update the chart
      riskPredictionChart.update();
    });
  }
  
  /**
   * Initialize incident history chart
   */
  function initIncidentHistoryChart(zone) {
    if (!elements.incidentHistoryChart) return;
  
    const ctx = elements.incidentHistoryChart.getContext("2d");
  
    // Generate mock incident history data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const incidentData = [];
  
    // Base the data on the zone's risk level
    let baseValue = 0;
    if (zone.riskLevel === "high") {
      baseValue = 5;
    } else if (zone.riskLevel === "medium") {
      baseValue = 3;
    } else {
      baseValue = 1;
    }
  
    // Generate random data with an upward trend
    for (let i = 0; i < months.length; i++) {
      incidentData.push(baseValue + Math.floor(Math.random() * 3) + Math.floor(i / 2));
    }
  
    // Chart configuration
    const config = {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Incidents",
            data: incidentData,
            backgroundColor: "#0066cc",
            borderColor: "#0052a3",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Incidents",
            },
          },
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
        },
      },
    };
  
    // Create the chart
    if (window.incidentHistoryChart) {
      window.incidentHistoryChart.destroy();
    }
  
    window.incidentHistoryChart = new Chart(ctx, config);
  }
  
  /**
   * Show notification
   */
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement("div");
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
      notification.classList.add("active");
    }, 10);
  
    // Set up close button
    const closeBtn = notification.querySelector(".close-notification");
    closeBtn.addEventListener("click", () => {
      notification.classList.remove("active");
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
  
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.remove("active");
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }
  
  // Make functions available globally for map popups
  window.openRiskZoneModal = openRiskZoneModal;
  window.viewDiversionDetails = (diversionId) => {
    showNotification("Diversion details would open in a real application", "info");
  };