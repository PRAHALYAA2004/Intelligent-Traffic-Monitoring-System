document.addEventListener('DOMContentLoaded', function() {
  // Initialize traffic simulation
  const simulation = new TrafficSimulation('trafficSimulation');
  
  // Get DOM elements
  const signalInputs = [
    document.getElementById('signal-0'),
    document.getElementById('signal-1'),
    document.getElementById('signal-2'),
    document.getElementById('signal-3')
  ];
  
  const pedestrianBtn = document.getElementById('pedestrianBtn');
  const cyclistBtn = document.getElementById('cyclistBtn');
  const rushHourBtn = document.getElementById('rushHourBtn');
  const accidentBtn = document.getElementById('accidentBtn');
  const emergencyBtn = document.getElementById('emergencyBtn');
  const cycleBtn = document.getElementById('cycleBtn');
  const timeOfDaySelect = document.getElementById('timeOfDay');
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
  
  // Update signal durations when inputs change
  signalInputs.forEach((input, index) => {
    input.addEventListener('change', function() {
      const durations = signalInputs.map(input => parseInt(input.value) || 10);
      simulation.updateSignalDurations(durations);
      
      simulation.logEvent('Admin', `Changed Signal ${index + 1} duration to ${input.value} seconds`);
    });
  });
  
  // Pedestrian request button
  pedestrianBtn.addEventListener('click', function() {
    if (!simulation.pedestrianRequest) {
      simulation.setPedestrianRequest(true);
      pedestrianBtn.textContent = 'Pedestrian Crossing Active';
      pedestrianBtn.disabled = true;
      
      // Reset button after 30 seconds
      setTimeout(() => {
        pedestrianBtn.textContent = 'Request Pedestrian Crossing';
        pedestrianBtn.disabled = false;
      }, 30000);
    }
  });
  
  // Cyclist request button
  cyclistBtn.addEventListener('click', function() {
    if (!simulation.cyclistRequest) {
      simulation.setCyclistRequest(true);
      cyclistBtn.textContent = 'Cyclist Crossing Active';
      cyclistBtn.disabled = true;
      
      // Reset button after 20 seconds
      setTimeout(() => {
        cyclistBtn.textContent = 'Request Cyclist Crossing';
        cyclistBtn.disabled = false;
      }, 20000);
    }
  });
  
  // Rush hour mode button
  rushHourBtn.addEventListener('click', function() {
    const isActive = rushHourBtn.classList.toggle('active');
    simulation.setRushHourMode(isActive);
    rushHourBtn.textContent = isActive ? 'Disable Rush Hour' : 'Enable Rush Hour';
  });
  
  // Accident mode button
  accidentBtn.addEventListener('click', function() {
    const isActive = accidentBtn.classList.toggle('active');
    simulation.setAccidentMode(isActive);
    accidentBtn.textContent = isActive ? 'Clear Accident' : 'Simulate Accident';
  });
  
  // Emergency vehicle button
  emergencyBtn.addEventListener('click', function() {
    if (!simulation.emergencyMode) {
      simulation.setEmergencyMode(true);
      emergencyBtn.textContent = 'Emergency Vehicle Active';
      emergencyBtn.disabled = true;
      
      // Reset button after 30 seconds
      setTimeout(() => {
        emergencyBtn.textContent = 'Emergency Vehicle Override';
        emergencyBtn.disabled = false;
      }, 30000);
    }
  });
  
  // Time of day select
  timeOfDaySelect.addEventListener('change', function() {
    simulation.setTimeOfDay(this.value);
  });
  
  // Auto cycle time button
  cycleBtn.addEventListener('click', function() {
    const isActive = cycleBtn.classList.toggle('active');
    simulation.setAutoCycleMode(isActive);
    cycleBtn.textContent = isActive ? 'Stop Auto Cycle' : 'Auto Cycle Time';
  });
  
  // Initialize time of day
  simulation.setTimeOfDay(timeOfDaySelect.value);
  
  // Update countdown displays
  function updateCountdowns() {
    for (let i = 0; i < 4; i++) {
      const countdown = document.getElementById(`countdown${i}`);
      if (countdown) {
        countdown.textContent = `${simulation.signals[i].countdown}s`;
      }
    }
    
    requestAnimationFrame(updateCountdowns);
  }
  
  updateCountdowns();
  
  // Responsive canvas sizing
  function resizeCanvas() {
    const canvas = document.getElementById('trafficSimulation');
    const container = canvas.parentElement;
    
    if (window.innerWidth < 768) {
      const aspectRatio = canvas.width / canvas.height;
      const newWidth = container.clientWidth;
      const newHeight = newWidth / aspectRatio;
      
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
    } else {
      canvas.style.width = '';
      canvas.style.height = '';
    }
  }
  
  // Initial resize and add event listener
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
});