/**
 * Traffic Data Analysis Dashboard
 * Enhanced script with modern ES6+ features, better error handling,
 * loading states, and improved user experience
 */

// Global state
const state = {
    data: [],
    accidentSummary: [],
    speedByPrecipitation: [],
    charts: {},
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true'
  };
  
  // DOM Elements
  const elements = {
    filterForm: document.getElementById('filterForm'),
    locationSelect: document.getElementById('location'),
    startDate: document.getElementById('start'),
    endDate: document.getElementById('end'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    noDataMessage: document.getElementById('noDataMessage'),
    dashboardContent: document.getElementById('dashboardContent'),
    dataTable: document.getElementById('dataTable'),
    speedChart: document.getElementById('speedChart'),
    accidentChart: document.getElementById('accidentChart'),
    speedByPrecipChart: document.getElementById('speedByPrecipChart'),
    collapseBtn: document.querySelector('.collapse-btn'),
    filtersPanel: document.querySelector('.filters-panel'),
    expandModal: document.getElementById('expandModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    accidentCount: document.getElementById('accidentCount'),
    avgSpeed: document.getElementById('avgSpeed'),
    totalVolume: document.getElementById('totalVolume'),
    exportBtn: document.getElementById('exportBtn'),
    printBtn: document.getElementById('printBtn')
  };
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
  });
  
  /**
   * Initialize the application
   */
  function initializeApp() {
    // Set up DataTable
    initializeDataTable();
    
    // Fetch locations for dropdown
    fetchLocations();
    
    // Set default date range (last 7 days)
    setDefaultDateRange();
    
    // Apply sidebar state
    applySidebarState();
    
    // Set up event listeners
    setupEventListeners();
    
    // Mobile menu toggle
    document.querySelector('.menu-toggle').addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('active');
    });
  }
  
  /**
   * Initialize DataTable with enhanced configuration
   */
  function initializeDataTable() {
    // Check if jQuery and DataTables are loaded
    if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined') {
      console.error('jQuery or DataTables not loaded. Ensure they are included in your HTML.');
      return;
    }
  
    $(elements.dataTable).DataTable({
      columns: [
        { title: 'Timestamp', data: 'timestamp' },
        { title: 'Location', data: 'location' },
        { title: 'Speed (km/h)', data: 'speed' },
        { title: 'Volume (veh/h)', data: 'volume' },
        { title: 'Temp (°C)', data: 'temperature' },
        { title: 'Precipitation', data: 'precipitation' },
        { title: 'Accident', data: 'accident' }
      ],
      pageLength: 10,
      responsive: true,
      dom: '<"datatable-header"fl>t<"datatable-footer"ip>',
      language: {
        search: '<i class="fas fa-search"></i>',
        searchPlaceholder: 'Search data...',
        lengthMenu: 'Show _MENU_ entries',
        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
        infoEmpty: 'Showing 0 to 0 of 0 entries',
        infoFiltered: '(filtered from _MAX_ total entries)',
        paginate: {
          first: '<i class="fas fa-angle-double-left"></i>',
          previous: '<i class="fas fa-angle-left"></i>',
          next: '<i class="fas fa-angle-right"></i>',
          last: '<i class="fas fa-angle-double-right"></i>'
        }
      }
    });
  }
  
  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Form submission
    elements.filterForm.addEventListener('submit', handleFormSubmit);
    
    // Sidebar collapse
    elements.collapseBtn.addEventListener('click', toggleSidebar);
    
    // Expand buttons
    document.getElementById('expandTableBtn').addEventListener('click', () => expandView('dataTable', 'Data Table'));
    document.getElementById('expandSpeedBtn').addEventListener('click', () => expandView('speedChart', 'Average Speed Over Time'));
    document.getElementById('expandAccidentBtn').addEventListener('click', () => expandView('accidentChart', 'Accidents by Precipitation'));
    document.getElementById('expandSpeedPrecipBtn').addEventListener('click', () => expandView('speedByPrecipChart', 'Average Speed by Precipitation'));
    
    // Close modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Refresh buttons
    document.getElementById('refreshTableBtn').addEventListener('click', refreshData);
    document.getElementById('refreshSpeedBtn').addEventListener('click', refreshData);
    document.getElementById('refreshAccidentBtn').addEventListener('click', refreshData);
    document.getElementById('refreshSpeedPrecipBtn').addEventListener('click', refreshData);
    
    // Export and print
    elements.exportBtn.addEventListener('click', exportData);
    elements.printBtn.addEventListener('click', printDashboard);
  }
  
  /**
   * Fetch locations for the dropdown
   */
  async function fetchLocations() {
    try {
      showLoading(elements.locationSelect);
      
      // For demo purposes, we'll use mock locations
      // In a real application, this would be an API call
      const locations = [
        "Intersection of Main St and 1st Ave",
        "Highway 101, Mile 50",
        "Bridge Street Bridge",
        "Elm St between 5th and 6th",
        "Park Avenue Tunnel"
      ];
      
      // Clear any existing options except the placeholder
      while (elements.locationSelect.options.length > 1) {
        elements.locationSelect.remove(1);
      }
      
      // Add locations to select
      locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        elements.locationSelect.appendChild(option);
      });
      
      hideLoading(elements.locationSelect);
    } catch (error) {
      console.error('Error fetching locations:', error);
      showNotification('Error loading locations. Please try again.', 'error');
      hideLoading(elements.locationSelect);
    }
  }
  
  /**
   * Set default date range to last 7 days
   */
  function setDefaultDateRange() {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    elements.startDate.value = formatDateForInput(start);
    elements.endDate.value = formatDateForInput(end);
  }
  
  /**
   * Format date for datetime-local input
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  function formatDateForInput(date) {
    return date.toISOString().slice(0, 16);
  }
  
  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  async function handleFormSubmit(event) {
    event.preventDefault();
    
    const location = elements.locationSelect.value;
    const start = elements.startDate.value;
    const end = elements.endDate.value;
    
    if (!location || !start || !end) {
      showNotification('Please select location and date range', 'warning');
      return;
    }
    
    if (new Date(start) > new Date(end)) {
      showNotification('Start date cannot be after end date', 'warning');
      return;
    }
    
    await fetchData(location, start, end);
  }
  
  /**
   * Fetch all data based on filters
   * @param {string} location - Selected location
   * @param {string} start - Start date
   * @param {string} end - End date
   */
  async function fetchData(location, start, end) {
    try {
      // Show loading state
      showLoading();
      elements.noDataMessage.classList.add('hidden');
      elements.dashboardContent.classList.add('hidden');
      
      // For demo purposes, we'll use mock data
      // In a real application, this would be API calls
      
      // Generate mock data
      const data = generateMockData(location, start, end);
      const accidentSummary = generateMockAccidentSummary(data);
      const speedByPrecipitation = generateMockSpeedByPrecipitation(data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update state
      state.data = data;
      state.accidentSummary = accidentSummary;
      state.speedByPrecipitation = speedByPrecipitation;
      
      // Update UI
      updateDataTable(data);
      updateCharts(data, accidentSummary, speedByPrecipitation);
      updateQuickStats(data);
      
      // Show dashboard content
      elements.dashboardContent.classList.remove('hidden');
      
      // Hide loading state
      hideLoading();
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Error loading data. Please try again.', 'error');
      hideLoading();
      elements.noDataMessage.classList.remove('hidden');
    }
  }
  
  /**
   * Generate mock traffic data
   * @param {string} location - Selected location
   * @param {string} start - Start date
   * @param {string} end - End date
   * @returns {Array} Traffic data
   */
  function generateMockData(location, start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const data = [];
    
    // Generate data points for every hour in the date range
    for (let date = new Date(startDate); date <= endDate; date.setHours(date.getHours() + 1)) {
      const weather = generateWeather(date);
      const accident = generateAccident(weather);
      const traffic_flow = generateTrafficFlow(date, weather, accident);
      
      data.push({
        timestamp: new Date(date),
        location: location,
        traffic_flow,
        weather,
        accident
      });
    }
    
    return data;
  }
  
  /**
   * Generate mock weather data
   * @param {Date} date - Date to generate weather for
   * @returns {Object} Weather data
   */
  function generateWeather(date) {
    const month = date.getMonth(); // 0-11
    const baseTemp = 15 + 10 * Math.sin((month / 12) * 2 * Math.PI); // Seasonal variation
    const temperature = baseTemp + (Math.random() - 0.5) * 5;
  
    const precipitationTypes = ["None", "Light Rain", "Heavy Rain", "Snow"];
    const precipitationProb = (month >= 11 || month <= 2) ? 0.5 : 0.3;
    const precipitation = Math.random() < precipitationProb
      ? precipitationTypes[Math.floor(Math.random() * 3) + 1]
      : "None";
  
    const visibility = precipitation === "None" ? 2000 : 500 + Math.random() * 1000;
    const wind_speed = Math.random() * 30;
  
    return { temperature, precipitation, visibility, wind_speed };
  }
  
  /**
   * Generate mock accident data
   * @param {Object} weather - Weather data
   * @returns {Object|null} Accident data or null if no accident
   */
  function generateAccident(weather) {
    let accidentProb = 0.01;
    if (weather.precipitation === "Heavy Rain" || weather.precipitation === "Snow") {
      accidentProb = 0.05;
    } else if (weather.precipitation === "Light Rain") {
      accidentProb = 0.02;
    }
  
    if (Math.random() < accidentProb) {
      const severity = Math.ceil(Math.random() * 5);
      const vehicles_involved = Math.ceil(Math.random() * 3) + 1;
      const injuries = Math.floor(Math.random() * (severity * 2));
      const fatalities = Math.random() < 0.1 ? Math.floor(Math.random() * 2) : 0;
      const cause = weather.precipitation !== "None" ? "Weather-related" : "Other";
      return { severity, vehicles_involved, injuries, fatalities, cause };
    }
    return null;
  }
  
  /**
   * Generate mock traffic flow data
   * @param {Date} date - Date to generate traffic flow for
   * @param {Object} weather - Weather data
   * @param {Object|null} accident - Accident data
   * @returns {Object} Traffic flow data
   */
  function generateTrafficFlow(date, weather, accident) {
    let baseSpeed = 50;
    let speedReduction = 0;
    if (weather.precipitation === "Heavy Rain" || weather.precipitation === "Snow") {
      speedReduction += 10;
    } else if (weather.precipitation === "Light Rain") {
      speedReduction += 5;
    }
    if (accident) speedReduction += accident.severity * 5;
    const average_speed = Math.max(10, baseSpeed - speedReduction + (Math.random() - 0.5) * 10);
  
    const hour = date.getHours();
    let volume = 1000;
    if (hour >= 7 && hour <= 9) volume = 1800; // Morning rush
    else if (hour >= 16 && hour <= 18) volume = 1600; // Evening rush
    else if (hour >= 22 || hour <= 5) volume = 300; // Night
    volume += (Math.random() - 0.5) * 200;
  
    return { average_speed, volume };
  }
  
  /**
   * Generate mock accident summary data
   * @param {Array} data - Traffic data
   * @returns {Array} Accident summary data
   */
  function generateMockAccidentSummary(data) {
    const precipitationTypes = ["None", "Light Rain", "Heavy Rain", "Snow"];
    const summary = [];
    
    precipitationTypes.forEach(type => {
      const accidents = data.filter(item => 
        item.accident && item.weather.precipitation === type
      );
      
      if (accidents.length > 0 || type !== "None") {
        summary.push({
          _id: type,
          count: accidents.length
        });
      }
    });
    
    return summary;
  }
  
  /**
   * Generate mock speed by precipitation data
   * @param {Array} data - Traffic data
   * @returns {Array} Speed by precipitation data
   */
  function generateMockSpeedByPrecipitation(data) {
    const precipitationTypes = ["None", "Light Rain", "Heavy Rain", "Snow"];
    const summary = [];
    
    precipitationTypes.forEach(type => {
      const records = data.filter(item => item.weather.precipitation === type);
      
      if (records.length > 0) {
        const totalSpeed = records.reduce((sum, item) => sum + item.traffic_flow.average_speed, 0);
        const averageSpeed = totalSpeed / records.length;
        
        summary.push({
          _id: type,
          average_speed: averageSpeed
        });
      }
    });
    
    return summary;
  }
  
  /**
   * Update the data table with new data
   * @param {Array} data - Traffic data
   */
  function updateDataTable(data) {
    // Check if jQuery and DataTables are loaded
    if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined') {
      console.error('jQuery or DataTables not loaded. Ensure they are included in your HTML.');
      return;
    }
  
    const table = $(elements.dataTable).DataTable();
    table.clear();
    
    const formattedData = data.map(doc => ({
      timestamp: new Date(doc.timestamp).toLocaleString(),
      location: doc.location,
      speed: doc.traffic_flow.average_speed.toFixed(1),
      volume: doc.traffic_flow.volume.toFixed(0),
      temperature: doc.weather.temperature.toFixed(1),
      precipitation: doc.weather.precipitation,
      accident: doc.accident ? `Severity ${doc.accident.severity}` : 'No'
    }));
    
    table.rows.add(formattedData).draw();
  }
  
  /**
   * Update all charts with new data
   * @param {Array} data - Traffic data
   * @param {Array} accidentSummary - Accident summary data
   * @param {Array} speedByPrecipitation - Speed by precipitation data
   */
  function updateCharts(data, accidentSummary, speedByPrecipitation) {
    // Destroy existing charts to prevent memory leaks
    Object.values(state.charts).forEach(chart => chart.destroy());
    
    // Create new charts
    createSpeedChart(data);
    createAccidentChart(accidentSummary);
    createSpeedByPrecipChart(speedByPrecipitation);
  }
  
  /**
   * Create speed over time chart
   * @param {Array} data - Traffic data
   */
  function createSpeedChart(data) {
    const ctx = elements.speedChart.getContext('2d');
    
    // Prepare data
    const chartData = data.map(d => ({
      x: new Date(d.timestamp),
      y: d.traffic_flow.average_speed
    }));
    
    // Create chart
    state.charts.speed = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Average Speed (km/h)',
          data: chartData,
          borderColor: '#0066cc',
          backgroundColor: 'rgba(0, 102, 204, 0.1)',
          borderWidth: 2,
          tension: 0.2,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: (tooltipItems) => {
                return new Date(tooltipItems[0].parsed.x).toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'MMM d, HH:mm'
              }
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Speed (km/h)'
            }
          }
        }
      }
    });
  }
  
  /**
   * Create accidents by precipitation chart
   * @param {Array} accidentSummary - Accident summary data
   */
  function createAccidentChart(accidentSummary) {
    const ctx = elements.accidentChart.getContext('2d');
    
    // Prepare data
    const labels = accidentSummary.map(d => d._id || 'Unknown');
    const data = accidentSummary.map(d => d.count);
    
    // Create color array based on precipitation type
    const backgroundColors = labels.map(label => {
      switch(label) {
        case 'Heavy Rain': return '#ef4444';
        case 'Light Rain': return '#f59e0b';
        case 'Snow': return '#3b82f6';
        default: return '#10b981';
      }
    });
    
    // Create chart
    state.charts.accident = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Accidents',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                return tooltipItems[0].label;
              },
              label: (context) => {
                return `Accidents: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Accidents'
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            title: {
              display: true,
              text: 'Precipitation Type'
            }
          }
        }
      }
    });
  }
  
  /**
   * Create speed by precipitation chart
   * @param {Array} speedByPrecipitation - Speed by precipitation data
   */
  function createSpeedByPrecipChart(speedByPrecipitation) {
    const ctx = elements.speedByPrecipChart.getContext('2d');
    
    // Prepare data
    const labels = speedByPrecipitation.map(d => d._id || 'Unknown');
    const data = speedByPrecipitation.map(d => d.average_speed);
    
    // Create color array based on precipitation type
    const backgroundColors = labels.map(label => {
      switch(label) {
        case 'Heavy Rain': return 'rgba(239, 68, 68, 0.7)';
        case 'Light Rain': return 'rgba(245, 158, 11, 0.7)';
        case 'Snow': return 'rgba(59, 130, 246, 0.7)';
        default: return 'rgba(16, 185, 129, 0.7)';
      }
    });
    
    // Create chart
    state.charts.speedByPrecip = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Speed (km/h)',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                return tooltipItems[0].label;
              },
              label: (context) => {
                return `Average Speed: ${context.parsed.y.toFixed(1)} km/h`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Average Speed (km/h)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Precipitation Type'
            }
          }
        }
      }
    });
  }
  
  /**
   * Update quick stats with summary data
   * @param {Array} data - Traffic data
   */
  function updateQuickStats(data) {
    // Count accidents
    const accidentCount = data.filter(item => item.accident).length;
    elements.accidentCount.textContent = accidentCount;
    
    // Calculate average speed
    const totalSpeed = data.reduce((sum, item) => sum + item.traffic_flow.average_speed, 0);
    const avgSpeed = data.length > 0 ? (totalSpeed / data.length).toFixed(1) : 0;
    elements.avgSpeed.textContent = avgSpeed;
    
    // Calculate total volume
    const totalVolume = data.reduce((sum, item) => sum + item.traffic_flow.volume, 0).toFixed(0);
    elements.totalVolume.textContent = totalVolume;
  }
  
  /**
   * Show loading state
   * @param {HTMLElement} [element] - Optional specific element to show loading for
   */
  function showLoading(element) {
    if (element) {
      element.classList.add('loading');
      element.disabled = true;
    } else {
      elements.loadingIndicator.classList.remove('hidden');
    }
  }
  
  /**
   * Hide loading state
   * @param {HTMLElement} [element] - Optional specific element to hide loading for
   */
  function hideLoading(element) {
    if (element) {
      element.classList.remove('loading');
      element.disabled = false;
    } else {
      elements.loadingIndicator.classList.add('hidden');
    }
  }
  
  /**
   * Toggle sidebar collapsed state
   */
  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed);
    applySidebarState();
  }
  
  /**
   * Apply sidebar collapsed state
   */
  function applySidebarState() {
    if (state.sidebarCollapsed) {
      elements.filtersPanel.classList.add('collapsed');
      elements.collapseBtn.querySelector('svg').style.transform = 'rotate(180deg)';
    } else {
      elements.filtersPanel.classList.remove('collapsed');
      elements.collapseBtn.querySelector('svg').style.transform = 'rotate(0deg)';
    }
  }
  
  /**
   * Expand a view in modal
   * @param {string} elementId - ID of element to expand
   * @param {string} title - Modal title
   */
  function expandView(elementId, title) {
    // Set modal title
    elements.modalTitle.textContent = title;
    
    // Clear modal body
    elements.modalBody.innerHTML = '';
    
    // Clone the element to expand
    const originalElement = document.getElementById(elementId);
    const clonedElement = originalElement.cloneNode(true);
    clonedElement.id = `${elementId}Expanded`;
    
    // Add to modal
    elements.modalBody.appendChild(clonedElement);
    
    // If it's a chart, recreate it in the modal
    if (elementId.includes('Chart')) {
      const chartType = elementId.replace('Chart', '');
      let data;
      
      switch(chartType) {
        case 'speed':
          createSpeedChart(state.data, clonedElement);
          break;
        case 'accident':
          createAccidentChart(state.accidentSummary, clonedElement);
          break;
        case 'speedByPrecip':
          createSpeedByPrecipChart(state.speedByPrecipitation, clonedElement);
          break;
      }
    }
    
    // If it's a table, initialize DataTable
    if (elementId === 'dataTable') {
      // Check if jQuery and DataTables are loaded
      if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined') {
        console.error('jQuery or DataTables not loaded. Ensure they are included in your HTML.');
        return;
      }
  
      $(clonedElement).DataTable({
        data: $(originalElement).DataTable().data().toArray(),
        columns: [
          { title: 'Timestamp', data: 'timestamp' },
          { title: 'Location', data: 'location' },
          { title: 'Speed (km/h)', data: 'speed' },
          { title: 'Volume (veh/h)', data: 'volume' },
          { title: 'Temp (°C)', data: 'temperature' },
          { title: 'Precipitation', data: 'precipitation' },
          { title: 'Accident', data: 'accident' }
        ],
        pageLength: 25,
        scrollY: '60vh',
        scrollCollapse: true
      });
    }
    
    // Show modal
    elements.expandModal.classList.add('active');
  }
  
  /**
   * Close the modal
   */
  function closeModal() {
    elements.expandModal.classList.remove('active');
  }
  
  /**
   * Refresh data
   */
  function refreshData() {
    const location = elements.locationSelect.value;
    const start = elements.startDate.value;
    const end = elements.endDate.value;
    
    if (location && start && end) {
      fetchData(location, start, end);
    } else {
      showNotification('Please select location and date range', 'warning');
    }
  }
  
  /**
   * Export data to CSV
   */
  function exportData() {
    if (!state.data || state.data.length === 0) {
      showNotification('No data to export', 'warning');
      return;
    }
    
    try {
      // Convert data to CSV format
      const headers = ['Timestamp', 'Location', 'Speed (km/h)', 'Volume (veh/h)', 'Temperature (°C)', 'Precipitation', 'Accident'];
      
      const rows = state.data.map(item => [
        new Date(item.timestamp).toLocaleString(),
        item.location,
        item.traffic_flow.average_speed.toFixed(1),
        item.traffic_flow.volume.toFixed(0),
        item.weather.temperature.toFixed(1),
        item.weather.precipitation,
        item.accident ? `Severity ${item.accident.severity}` : 'No'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `traffic_data_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('Data exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showNotification('Error exporting data', 'error');
    }
  }
  
  /**
   * Print dashboard
   */
  function printDashboard() {
    if (!state.data || state.data.length === 0) {
      showNotification('No data to print', 'warning');
      return;
    }
    
    try {
      // Open print window
      window.print();
    } catch (error) {
      console.error('Error printing dashboard:', error);
      showNotification('Error printing dashboard', 'error');
    }
  }
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, warning, error, info)
   */
  function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'notification';
      document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('active');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('active');
    }, 3000);
  }
  
  // Add notification styles
  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      transform: translateX(120%);
      transition: transform 0.3s ease;
    }
    
    .notification.active {
      transform: translateX(0);
    }
    
    .notification.success {
      background-color: #28a745;
    }
    
    .notification.warning {
      background-color: #ffc107;
      color: #212529;
    }
    
    .notification.error {
      background-color: #dc3545;
    }
    
    .notification.info {
      background-color: #0066cc;
    }
  `;
  document.head.appendChild(notificationStyles);
  
  // Add jQuery import
  const script = document.createElement('script');
  script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
  script.onload = function() {
      console.log("jQuery loaded");
      // You can initialize other scripts or functions that depend on jQuery here
  };
  document.head.appendChild(script);