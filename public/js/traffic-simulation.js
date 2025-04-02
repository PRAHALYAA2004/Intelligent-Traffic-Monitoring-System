class TrafficSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Load images
        this.loadImages();

        // Signal durations
        this.signalDurations = [10, 10, 10, 10];
        this.originalDurations = [...this.signalDurations];

        // Special conditions
        this.pedestrianRequest = false;
        this.cyclistRequest = false;
        this.accidentMode = false;
        this.rushHourMode = false;
        this.emergencyMode = false;
        this.autoCycleMode = false;

        // Time of day
        this.timeOfDay = 'evening'; // morning, afternoon, evening, night

        // Vehicles
        this.vehicles = [];
        this.vehicleIdCounter = 0;

        // Pedestrians
        this.pedestrians = [];
        this.pedestrianIdCounter = 0;

        // Cyclists
        this.cyclists = [];
        this.cyclistIdCounter = 0;

        // Signals
        this.signals = [
            { red: 0, yellow: 5, green: this.signalDurations[0], state: 'green', countdown: this.signalDurations[0] },
            { red: this.signalDurations[0] + 5, yellow: 5, green: this.signalDurations[1], state: 'red', countdown: 0 },
            { red: this.signalDurations[0] + 5 + this.signalDurations[1] + 5, yellow: 5, green: this.signalDurations[2], state: 'red', countdown: 0 },
            { red: this.signalDurations[0] + 5 + this.signalDurations[1] + 5 + this.signalDurations[2] + 5, yellow: 5, green: this.signalDurations[3], state: 'red', countdown: 0 }
        ];
        this.currentGreen = 0;

        // Signal positions
        this.signalPositions = [
            { x: 450, y: 230 }, // Right (East)
            { x: 570, y: 230 }, // Down (South)
            { x: 570, y: 370 }, // Left (West)
            { x: 450, y: 370 }  // Up (North)
        ];

        // Stop lines
        this.stopLines = {
            right: 400,
            down: 300,
            left: 600,
            up: 400
        };

        // Crosswalks
        this.crosswalks = [
            { x: 450, y: 350, width: 100, height: 20, active: false }, // Bottom crosswalk
            { x: 450, y: 230, width: 100, height: 20, active: false }, // Top crosswalk
            { x: 430, y: 250, width: 20, height: 100, active: false }, // Left crosswalk
            { x: 550, y: 250, width: 20, height: 100, active: false }  // Right crosswalk
        ];

        // Bike lanes
        this.bikeLanes = [
            { x: 430, y: 250, width: 20, height: 100, direction: 'vertical' },
            { x: 550, y: 250, width: 20, height: 100, direction: 'vertical' },
            { x: 450, y: 230, width: 100, height: 20, direction: 'horizontal' },
            { x: 450, y: 350, width: 100, height: 20, direction: 'horizontal' }
        ];

        // Vehicle starting positions
        this.startPositions = {
            right: { x: 0, y: [320, 340, 360] },
            down: { x: [520, 540, 560], y: 0 },
            left: { x: this.width, y: [240, 260, 280] },
            up: { x: [440, 460, 480], y: this.height }
        };

        // Pedestrian starting positions
        this.pedestrianStartPositions = [
            { x: 430, y: 420, direction: 'up' },    // Bottom to top
            { x: 570, y: 180, direction: 'down' },  // Top to bottom
            { x: 400, y: 250, direction: 'right' }, // Left to right
            { x: 600, y: 350, direction: 'left' }   // Right to left
        ];

        // Cyclist starting positions
        this.cyclistStartPositions = [
            { x: 420, y: 420, direction: 'up' },    // Bottom to top
            { x: 580, y: 180, direction: 'down' },  // Top to bottom
            { x: 400, y: 240, direction: 'right' }, // Left to right
            { x: 600, y: 360, direction: 'left' }   // Right to left
        ];

        // Vehicle speeds
        this.speeds = {
            car: 2,
            bus: 1.5,
            truck: 1.5,
            bike: 2.5,
            pedestrian: 0.8,
            cyclist: 1.8
        };

        // Vehicle dimensions
        this.dimensions = {
            car: { width: 30, height: 20 },
            bus: { width: 40, height: 20 },
            truck: { width: 40, height: 20 },
            bike: { width: 20, height: 10 },
            pedestrian: { width: 10, height: 10 },
            cyclist: { width: 15, height: 10 }
        };

        // Vehicle colors (fallback if images fail to load)
        this.colors = {
            car: '#3498db',
            bus: '#e74c3c',
            truck: '#f39c12',
            bike: '#2ecc71',
            pedestrian: '#9b59b6',
            cyclist: '#1abc9c'
        };

        // Statistics
        this.stats = {
            vehiclesPassed: 0,
            pedestriansCrossed: 0,
            cyclistsCrossed: 0,
            avgWaitTime: 45,
            flowRate: 850
        };

        // Event log
        this.eventLog = [];

        // Initialize
        this.init();
    }

    loadImages() {
        // Create image objects for vehicles, pedestrians, cyclists, and backgrounds
        this.images = {
            vehicles: {
                car: [],
                bus: [],
                truck: [],
                bike: []
            },
            pedestrians: [],
            cyclists: [],
            backgrounds: {
                morning: null,
                afternoon: null,
                evening: null,
                night: null
            }
        };

        // Load car images
        for (let i = 1; i <= 3; i++) {
            const carImg = new Image();
            carImg.src = `../images/car.png`;
            this.images.vehicles.car.push(carImg);
        }

        // Load bus image
        const busImg = new Image();
        busImg.src = "../images/bus.png";
        this.images.vehicles.bus.push(busImg);

        // Load truck image
        const truckImg = new Image();
        truckImg.src = '../images/truck.png';
        this.images.vehicles.truck.push(truckImg);

        // Load bike/motorcycle image
        const bikeImg = new Image();
        bikeImg.src = '../images/motorcycle.png';
        this.images.vehicles.bike.push(bikeImg);

        // Load pedestrian images
        for (let i = 1; i <= 2; i++) {
            const pedImg = new Image();
            pedImg.src = `../images/pedestrians/pedestrian${i}.png`;
            this.images.pedestrians.push(pedImg);
        }

        // Load cyclist images
        for (let i = 1; i <= 2; i++) {
            const cyclistImg = new Image();
            cyclistImg.src = `../images/cyclist.png`;
            this.images.cyclists.push(cyclistImg);
        }

        // Load background images
        const timeOfDayOptions = ['morning', 'afternoon', 'evening', 'night'];
        timeOfDayOptions.forEach(time => {
            const bgImg = new Image();
            bgImg.src = `../images/backgrounds/${time}.png`;
            this.images.backgrounds[time] = bgImg;
        });
    }

    init() {
        // Start animation loop
        this.draw();

        // Start vehicle generation
        this.startVehicleGeneration();

        // Start signal timer updates
        this.startSignalTimers();

        // Start vehicle movement
        this.startVehicleMovement();

        // Start countdown timers
        this.startCountdownTimers();

        // Start auto time cycle if enabled
        this.startAutoTimeCycle();

        // Update UI elements
        this.updateUIElements();

        // Log initial event
        this.logEvent('System', 'Traffic simulation initialized');
    }

    updateSignalDurations(durations) {
        this.signalDurations = durations;
        this.originalDurations = [...durations];

        // Update signal timers
        this.signals[0].green = durations[0];
        this.signals[1].green = durations[1];
        this.signals[2].green = durations[2];
        this.signals[3].green = durations[3];

        // Log event
        this.logEvent('Admin', 'Updated signal durations');
    }

    setPedestrianRequest(value) {
        this.pedestrianRequest = value;

        if (value) {
            // Generate pedestrians at crosswalks
            this.generatePedestrians();

            // Extend green time for the current signal if pedestrian request
            this.signals[this.currentGreen].green = Math.max(this.signals[this.currentGreen].green, 15);

            // Activate crosswalk for current green signal
            this.activateCrosswalk(this.currentGreen);

            // Log event
            this.logEvent('System', 'Pedestrian crossing request activated');

            // Reset after 30 seconds
            setTimeout(() => {
                this.pedestrianRequest = false;
                this.deactivateAllCrosswalks();
            }, 30000);
        }
    }

    setCyclistRequest(value) {
        this.cyclistRequest = value;

        if (value) {
            // Generate cyclists
            this.generateCyclists();

            // Extend green time for the current signal if cyclist request
            this.signals[this.currentGreen].green = Math.max(this.signals[this.currentGreen].green, 12);

            // Log event
            this.logEvent('System', 'Cyclist crossing request activated');

            // Reset after 20 seconds
            setTimeout(() => {
                this.cyclistRequest = false;
            }, 20000);
        }
    }

    setAccidentMode(value) {
        this.accidentMode = value;

        if (value) {
            // Simulate accident by stopping vehicles in one direction
            this.vehicles.forEach(vehicle => {
                if (vehicle.direction === 'right') {
                    vehicle.speed = 0;
                }
            });

            // Adjust signals for accident
            this.signals[0].green = 5; // Reduce green time for affected direction

            // Log event
            this.logEvent('System', 'Accident mode activated');
        } else {
            // Restore normal speeds when accident cleared
            this.vehicles.forEach(vehicle => {
                if (vehicle.direction === 'right') {
                    vehicle.speed = this.speeds[vehicle.type];
                }
            });

            // Restore original durations
            this.signals[0].green = this.originalDurations[0];

            // Log event
            this.logEvent('System', 'Accident cleared');
        }
    }

    setRushHourMode(value) {
        this.rushHourMode = value;

        if (value) {
            // Adjust signal timing for rush hour
            this.signals[1].green = this.signalDurations[1] * 1.5; // Increase green time for main road
            this.signals[3].green = this.signalDurations[3] * 1.5; // Increase green time for main road

            // Increase vehicle generation rate
            this.vehicleGenerationRate = 0.5; // 50% chance each interval

            // Log event
            this.logEvent('System', 'Rush hour mode activated');
        } else {
            // Restore original durations
            this.signals[1].green = this.originalDurations[1];
            this.signals[3].green = this.originalDurations[3];

            // Restore normal vehicle generation rate
            this.vehicleGenerationRate = 0.3; // 30% chance each interval

            // Log event
            this.logEvent('System', 'Rush hour mode deactivated');
        }
    }

    setEmergencyMode(value) {
        this.emergencyMode = value;

        if (value) {
            // Force all signals to red except the current one
            for (let i = 0; i < 4; i++) {
                if (i !== this.currentGreen) {
                    this.signals[i].state = 'red';
                }
            }

            // Extend green time for current signal
            this.signals[this.currentGreen].green = 30;

            // Log event
            this.logEvent('System', 'Emergency vehicle override activated');

            // Reset after 30 seconds
            setTimeout(() => {
                this.emergencyMode = false;
                this.logEvent('System', 'Emergency vehicle override deactivated');
            }, 30000);
        }
    }

    setTimeOfDay(time) {
        this.timeOfDay = time;

        // Adjust vehicle generation rate based on time of day
        switch (time) {
            case 'morning':
                this.vehicleGenerationRate = 0.4; // 40% chance each interval (morning rush)
                document.body.className = 'day-mode';
                break;
            case 'afternoon':
                this.vehicleGenerationRate = 0.3; // 30% chance each interval (normal)
                document.body.className = 'day-mode';
                break;
            case 'evening':
                this.vehicleGenerationRate = 0.5; // 50% chance each interval (evening rush)
                document.body.className = 'evening-mode';
                break;
            case 'night':
                this.vehicleGenerationRate = 0.2; // 20% chance each interval (low traffic)
                document.body.className = 'night-mode';
                break;
        }

        // Update UI elements
        this.updateTimeDisplay();

        // Log event
        this.logEvent('System', `Time changed to ${time}`);
    }

    setAutoCycleMode(value) {
        this.autoCycleMode = value;

        if (value) {
            this.startAutoTimeCycle();
            this.logEvent('System', 'Auto time cycle activated');
        } else {
            if (this.timeCycleInterval) {
                clearInterval(this.timeCycleInterval);
                this.timeCycleInterval = null;
            }
            this.logEvent('System', 'Auto time cycle deactivated');
        }
    }

    startAutoTimeCycle() {
        if (this.autoCycleMode && !this.timeCycleInterval) {
            // Cycle through times of day every 2 minutes
            this.timeCycleInterval = setInterval(() => {
                const times = ['morning', 'afternoon', 'evening', 'night'];
                const currentIndex = times.indexOf(this.timeOfDay);
                const nextIndex = (currentIndex + 1) % times.length;
                this.setTimeOfDay(times[nextIndex]);

                // Update UI
                const timeSelect = document.getElementById('timeOfDay');
                if (timeSelect) {
                    timeSelect.value = times[nextIndex];
                }
            }, 120000); // 2 minutes
        }
    }

    updateTimeDisplay() {
        const timeDisplay = document.getElementById('currentTime');
        const dateDisplay = document.getElementById('currentDate');

        if (timeDisplay && dateDisplay) {
            let timeString = '';
            let dateObj = new Date();

            switch (this.timeOfDay) {
                case 'morning':
                    timeString = '7:00 AM';
                    break;
                case 'afternoon':
                    timeString = '1:00 PM';
                    break;
                case 'evening':
                    timeString = '5:30 PM';
                    break;
                case 'night':
                    timeString = '9:00 PM';
                    break;
            }

            timeDisplay.textContent = timeString;
            dateDisplay.textContent = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    updateUIElements() {
        // Update statistics
        document.getElementById('avgWaitTime').textContent = `${this.stats.avgWaitTime}s`;
        document.getElementById('flowRate').textContent = `${this.stats.flowRate} veh/h`;
        document.getElementById('pedRequests').textContent = this.stats.pedestriansCrossed;
        document.getElementById('incidentCount').textContent = this.accidentMode ? '1' : '0';

        // Update signal lights in UI
        for (let i = 0; i < 4; i++) {
            const redLight = document.querySelector(`.signal-control-card:nth-child(${i + 1}) .signal-light.red`);
            const yellowLight = document.querySelector(`.signal-control-card:nth-child(${i + 1}) .signal-light.yellow`);
            const greenLight = document.querySelector(`.signal-control-card:nth-child(${i + 1}) .signal-light.green`);

            if (redLight && yellowLight && greenLight) {
                redLight.classList.toggle('active', this.signals[i].state === 'red');
                yellowLight.classList.toggle('active', this.signals[i].state === 'yellow');
                greenLight.classList.toggle('active', this.signals[i].state === 'green');
            }

            // Update countdown
            const countdown = document.getElementById(`countdown${i}`);
            if (countdown) {
                countdown.textContent = `${this.signals[i].countdown}s`;
            }
        }
    }

    startVehicleGeneration() {
        this.vehicleGenerationRate = 0.3; // 30% chance by default

        setInterval(() => {
            // Adjust generation rate based on time of day and rush hour
            let rate = this.vehicleGenerationRate;
            if (this.rushHourMode) {
                rate = 0.5; // 50% chance during rush hour
            }

            if (Math.random() < rate) {
                this.generateVehicle();
            }

            // Update statistics
            this.updateStats();
        }, 1000);
    }

    generateVehicle() {
        // Random direction, lane, and vehicle type
        const directions = ['right', 'down', 'left', 'up'];
        const types = ['car', 'car', 'car', 'bus', 'truck', 'bike']; // More cars than other types

        const direction = directions[Math.floor(Math.random() * directions.length)];
        const lane = Math.floor(Math.random() * 3);
        const type = types[Math.floor(Math.random() * types.length)];

        let x = 0;
        let y = 0;

        // Set starting position based on direction and lane
        if (direction === 'right') {
            x = 0;
            y = this.startPositions.right.y[lane];
        } else if (direction === 'down') {
            x = this.startPositions.down.x[lane];
            y = 0;
        } else if (direction === 'left') {
            x = this.width;
            y = this.startPositions.left.y[lane];
        } else if (direction === 'up') {
            x = this.startPositions.up.x[lane];
            y = this.height;
        }

        // Random image for the vehicle type
        const imageIndex = Math.floor(Math.random() * this.images.vehicles[type].length);

        // Create new vehicle
        const newVehicle = {
            id: this.vehicleIdCounter++,
            x,
            y,
            direction,
            lane,
            type,
            speed: this.speeds[type] * (this.rushHourMode ? 0.8 : 1), // Slower in rush hour
            crossed: false,
            width: this.dimensions[type].width,
            height: this.dimensions[type].height,
            color: this.colors[type],
            image: this.images.vehicles[type][imageIndex],
            waitTime: 0,
            waiting: false
        };

        this.vehicles.push(newVehicle);
    }

    generatePedestrians() {
        // Generate 2-4 pedestrians at random crosswalks
        const count = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < count; i++) {
            const posIndex = Math.floor(Math.random() * this.pedestrianStartPositions.length);
            const pos = this.pedestrianStartPositions[posIndex];
            const imageIndex = Math.floor(Math.random() * this.images.pedestrians.length);

            const newPedestrian = {
                id: this.pedestrianIdCounter++,
                x: pos.x,
                y: pos.y,
                direction: pos.direction,
                speed: this.speeds.pedestrian,
                crossed: false,
                width: this.dimensions.pedestrian.width,
                height: this.dimensions.pedestrian.height,
                color: this.colors.pedestrian,
                image: this.images.pedestrians[imageIndex],
                waitTime: 0,
                waiting: true,
                animationFrame: 0,
                animationCounter: 0
            };

            this.pedestrians.push(newPedestrian);
        }
    }

    generateCyclists() {
        // Generate 1-2 cyclists at random bike lanes
        const count = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < count; i++) {
            const posIndex = Math.floor(Math.random() * this.cyclistStartPositions.length);
            const pos = this.cyclistStartPositions[posIndex];
            const imageIndex = Math.floor(Math.random() * this.images.cyclists.length);

            const newCyclist = {
                id: this.cyclistIdCounter++,
                x: pos.x,
                y: pos.y,
                direction: pos.direction,
                speed: this.speeds.cyclist,
                crossed: false,
                width: this.dimensions.cyclist.width,
                height: this.dimensions.cyclist.height,
                color: this.colors.cyclist,
                image: this.images.cyclists[imageIndex],
                waitTime: 0,
                waiting: true,
                animationFrame: 0,
                animationCounter: 0
            };

            this.cyclists.push(newCyclist);
        }
    }

    activateCrosswalk(signalIndex) {
        // Activate crosswalk based on which signal is green
        if (signalIndex === 0 || signalIndex === 2) {
            // East-West traffic, activate North-South crosswalks
            this.crosswalks[2].active = true;
            this.crosswalks[3].active = true;
        } else {
            // North-South traffic, activate East-West crosswalks
            this.crosswalks[0].active = true;
            this.crosswalks[1].active = true;
        }
    }

    deactivateAllCrosswalks() {
        this.crosswalks.forEach(crosswalk => {
            crosswalk.active = false;
        });
    }

    startSignalTimers() {
        setInterval(() => {
            // Skip if in emergency mode
            if (this.emergencyMode) return;

            // Update current green signal
            if (this.signals[this.currentGreen].state === 'green') {
                if (this.signals[this.currentGreen].green > 0) {
                    this.signals[this.currentGreen].green -= 1;
                    this.signals[this.currentGreen].countdown = this.signals[this.currentGreen].green;
                } else {
                    this.signals[this.currentGreen].state = 'yellow';
                    this.signals[this.currentGreen].countdown = this.signals[this.currentGreen].yellow;
                }
            } else if (this.signals[this.currentGreen].state === 'yellow') {
                if (this.signals[this.currentGreen].yellow > 0) {
                    this.signals[this.currentGreen].yellow -= 1;
                    this.signals[this.currentGreen].countdown = this.signals[this.currentGreen].yellow;
                } else {
                    // Reset current signal
                    this.signals[this.currentGreen].state = 'red';
                    this.signals[this.currentGreen].green = this.originalDurations[this.currentGreen];
                    this.signals[this.currentGreen].yellow = 5;

                    // Deactivate crosswalks when signal turns red
                    this.deactivateAllCrosswalks();

                    // Move to next signal
                    this.currentGreen = (this.currentGreen + 1) % 4;
                    this.signals[this.currentGreen].state = 'green';
                    this.signals[this.currentGreen].countdown = this.signals[this.currentGreen].green;

                    // If pedestrian request is active, activate crosswalk for new green signal
                    if (this.pedestrianRequest) {
                        this.activateCrosswalk(this.currentGreen);
                    }
                }
            }

            // Update other signals
            for (let i = 0; i < 4; i++) {
                if (i !== this.currentGreen) {
                    if (this.signals[i].red > 0) {
                        this.signals[i].red -= 1;
                    }
                }
            }

            // Update UI elements
            this.updateUIElements();
        }, 1000);
    }

    startCountdownTimers() {
        // Update countdown timers in the simulation
        const timerElements = [
            document.getElementById('timer0'),
            document.getElementById('timer1'),
            document.getElementById('timer2'),
            document.getElementById('timer3')
        ];

        setInterval(() => {
            for (let i = 0; i < 4; i++) {
                if (timerElements[i]) {
                    timerElements[i].textContent = `${this.signals[i].countdown}s`;
                    timerElements[i].style.display = this.signals[i].state !== 'red' ? 'block' : 'none';
                }
            }
        }, 500);
    }

    startVehicleMovement() {
        setInterval(() => {
            // Move vehicles
            this.vehicles = this.vehicles.filter(vehicle => {
                // Check if vehicle should stop at signal
                let shouldStop = false;

                if (!vehicle.crossed) {
                    if (vehicle.direction === 'right' && vehicle.x + vehicle.width >= this.stopLines.right) {
                        shouldStop = this.signals[0].state !== 'green';
                        if (vehicle.x + vehicle.width > this.stopLines.right + 10) {
                            vehicle.crossed = true;
                            this.stats.vehiclesPassed++;
                        }
                    } else if (vehicle.direction === 'down' && vehicle.y + vehicle.height >= this.stopLines.down) {
                        shouldStop = this.signals[1].state !== 'green';
                        if (vehicle.y + vehicle.height > this.stopLines.down + 10) {
                            vehicle.crossed = true;
                            this.stats.vehiclesPassed++;
                        }
                    } else if (vehicle.direction === 'left' && vehicle.x <= this.stopLines.left) {
                        shouldStop = this.signals[2].state !== 'green';
                        if (vehicle.x < this.stopLines.left - 10) {
                            vehicle.crossed = true;
                            this.stats.vehiclesPassed++;
                        }
                    } else if (vehicle.direction === 'up' && vehicle.y <= this.stopLines.up) {
                        shouldStop = this.signals[3].state !== 'green';
                        if (vehicle.y < this.stopLines.up - 10) {
                            vehicle.crossed = true;
                            this.stats.vehiclesPassed++;
                        }
                    }
                }

                // Update wait time if stopped
                if (shouldStop) {
                    vehicle.waiting = true;
                    vehicle.waitTime += 0.05; // 50ms interval
                } else {
                    vehicle.waiting = false;
                }

                // Move vehicle if not stopped
                if (!shouldStop) {
                    if (vehicle.direction === 'right') {
                        vehicle.x += vehicle.speed;
                    } else if (vehicle.direction === 'down') {
                        vehicle.y += vehicle.speed;
                    } else if (vehicle.direction === 'left') {
                        vehicle.x -= vehicle.speed;
                    } else if (vehicle.direction === 'up') {
                        vehicle.y -= vehicle.speed;
                    }
                }

                // Keep vehicle if it's still on the canvas
                return !(
                    vehicle.x > this.width + 50 ||
                    vehicle.y > this.height + 50 ||
                    vehicle.x < -50 ||
                    vehicle.y < -50
                );
            });

            // Move pedestrians
            this.pedestrians = this.pedestrians.filter(pedestrian => {
                // Check if pedestrian should wait at crosswalk
                let shouldWait = true;

                // Check if crosswalk is active for this pedestrian's direction
                if (pedestrian.direction === 'up' || pedestrian.direction === 'down') {
                    shouldWait = !this.crosswalks[2].active && !this.crosswalks[3].active;
                } else {
                    shouldWait = !this.crosswalks[0].active && !this.crosswalks[1].active;
                }

                // Update wait time if waiting
                if (shouldWait && !pedestrian.crossed) {
                    pedestrian.waiting = true;
                    pedestrian.waitTime += 0.05;
                } else {
                    pedestrian.waiting = false;

                    // Animate pedestrian
                    pedestrian.animationCounter++;
                    if (pedestrian.animationCounter >= 10) {
                        pedestrian.animationCounter = 0;
                        pedestrian.animationFrame = 1 - pedestrian.animationFrame; // Toggle between 0 and 1
                    }

                    // Move pedestrian
                    if (pedestrian.direction === 'up') {
                        pedestrian.y -= pedestrian.speed;
                        if (pedestrian.y <= 230) {
                            pedestrian.crossed = true;
                            this.stats.pedestriansCrossed++;
                        }
                    } else if (pedestrian.direction === 'down') {
                        pedestrian.y += pedestrian.speed;
                        if (pedestrian.y >= 370) {
                            pedestrian.crossed = true;
                            this.stats.pedestriansCrossed++;
                        }
                    } else if (pedestrian.direction === 'right') {
                        pedestrian.x += pedestrian.speed;
                        if (pedestrian.x >= 550) {
                            pedestrian.crossed = true;
                            this.stats.pedestriansCrossed++;
                        }
                    } else if (pedestrian.direction === 'left') {
                        pedestrian.x -= pedestrian.speed;
                        if (pedestrian.x <= 450) {
                            pedestrian.crossed = true;
                            this.stats.pedestriansCrossed++;
                        }
                    }
                }

                // Keep pedestrian if it's still on the canvas and hasn't crossed
                return !(
                    pedestrian.x > this.width + 20 ||
                    pedestrian.y > this.height + 20 ||
                    pedestrian.x < -20 ||
                    pedestrian.y < -20 ||
                    (pedestrian.crossed && (pedestrian.x < 400 || pedestrian.x > 600 || pedestrian.y < 200 || pedestrian.y > 400))
                );
            });

            // Move cyclists
            this.cyclists = this.cyclists.filter(cyclist => {
                // Check if cyclist should wait at signal
                let shouldWait = true;

                // Check if signal is green for this cyclist's direction
                if (cyclist.direction === 'up' || cyclist.direction === 'down') {
                    shouldWait = this.signals[1].state !== 'green' && this.signals[3].state !== 'green';
                } else {
                    shouldWait = this.signals[0].state !== 'green' && this.signals[2].state !== 'green';
                }

                // Update wait time if waiting
                if (shouldWait && !cyclist.crossed) {
                    cyclist.waiting = true;
                    cyclist.waitTime += 0.05;
                } else {
                    cyclist.waiting = false;

                    // Animate cyclist
                    cyclist.animationCounter++;
                    if (cyclist.animationCounter >= 5) {
                        cyclist.animationCounter = 0;
                        cyclist.animationFrame = 1 - cyclist.animationFrame; // Toggle between 0 and 1
                    }

                    // Move cyclist
                    if (cyclist.direction === 'up') {
                        cyclist.y -= cyclist.speed;
                        if (cyclist.y <= 230) {
                            cyclist.crossed = true;
                            this.stats.cyclistsCrossed++;
                        }
                    } else if (cyclist.direction === 'down') {
                        cyclist.y += cyclist.speed;
                        if (cyclist.y >= 370) {
                            cyclist.crossed = true;
                            this.stats.cyclistsCrossed++;
                        }
                    } else if (cyclist.direction === 'right') {
                        cyclist.x += cyclist.speed;
                        if (cyclist.x >= 550) {
                            cyclist.crossed = true;
                            this.stats.cyclistsCrossed++;
                        }
                    } else if (cyclist.direction === 'left') {
                        cyclist.x -= cyclist.speed;
                        if (cyclist.x <= 450) {
                            cyclist.crossed = true;
                            this.stats.cyclistsCrossed++;
                        }
                    }
                }

                // Keep cyclist if it's still on the canvas and hasn't crossed
                return !(
                    cyclist.x > this.width + 20 ||
                    cyclist.y > this.height + 20 ||
                    cyclist.x < -20 ||
                    cyclist.y < -20 ||
                    (cyclist.crossed && (cyclist.x < 400 || cyclist.x > 600 || cyclist.y < 200 || cyclist.y > 400))
                );
            });
        }, 50);
    }

    updateStats() {
        // Calculate average wait time
        let totalWaitTime = 0;
        let waitingVehicles = 0;

        this.vehicles.forEach(vehicle => {
            if (vehicle.waiting) {
                totalWaitTime += vehicle.waitTime;
                waitingVehicles++;
            }
        });

        if (waitingVehicles > 0) {
            this.stats.avgWaitTime = Math.round(totalWaitTime / waitingVehicles);
        }

        // Calculate flow rate based on vehicles passed and time of day
        let baseFlowRate = 850;

        switch (this.timeOfDay) {
            case 'morning':
                baseFlowRate = 900;
                break;
            case 'afternoon':
                baseFlowRate = 750;
                break;
            case 'evening':
                baseFlowRate = 950;
                break;
            case 'night':
                baseFlowRate = 500;
                break;
        }

        // Adjust for rush hour
        if (this.rushHourMode) {
            baseFlowRate *= 1.2;
        }

        // Adjust for accident
        if (this.accidentMode) {
            baseFlowRate *= 0.7;
        }

        this.stats.flowRate = Math.round(baseFlowRate);

        // Update UI
        this.updateUIElements();
    }

    logEvent(actor, action) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        const event = {
            actor,
            action,
            time: timeString
        };

        this.eventLog.unshift(event);

        // Keep only the last 10 events
        if (this.eventLog.length > 10) {
            this.eventLog.pop();
        }

        // Update events list in UI
        const eventsList = document.getElementById('eventsList');
        if (eventsList) {
            eventsList.innerHTML = '';

            this.eventLog.forEach(event => {
                const li = document.createElement('li');
                li.className = 'activity-item';

                const avatar = document.createElement('div');
                avatar.className = 'activity-avatar';
                avatar.textContent = event.actor === 'Admin' ? 'AD' : 'SY';

                const content = document.createElement('div');
                content.className = 'activity-content';

                const h4 = document.createElement('h4');
                h4.textContent = event.actor;

                const p = document.createElement('p');
                p.textContent = event.action;

                const span = document.createElement('span');
                span.className = 'activity-time';
                span.textContent = event.time;

                content.appendChild(h4);
                content.appendChild(p);
                content.appendChild(span);

                li.appendChild(avatar);
                li.appendChild(content);

                eventsList.appendChild(li);
            });
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw background based on time of day
        if (this.images.backgrounds[this.timeOfDay] && this.images.backgrounds[this.timeOfDay].complete) {
            this.ctx.drawImage(this.images.backgrounds[this.timeOfDay], 0, 0, this.width, this.height);
        } else {
            // Fallback background color
            switch (this.timeOfDay) {
                case 'morning':
                    this.ctx.fillStyle = '#e6f7ff';
                    break;
                case 'afternoon':
                    this.ctx.fillStyle = '#f5f5f5';
                    break;
                case 'evening':
                    this.ctx.fillStyle = '#faf3e0';
                    break;
                case 'night':
                    this.ctx.fillStyle = '#1a1a2e';
                    break;
            }
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Draw road
        this.ctx.fillStyle = '#333';
        // Horizontal road
        this.ctx.fillRect(0, 250, this.width, 100);
        // Vertical road
        this.ctx.fillRect(450, 0, 100, this.height);

        // Draw bike lanes
        this.ctx.fillStyle = '#2c3e50';
        this.bikeLanes.forEach(lane => {
            this.ctx.fillRect(lane.x, lane.y, lane.width, lane.height);
        });

        // Draw road markings
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([20, 20]);
        this.ctx.beginPath();
        // Horizontal road center line
        this.ctx.moveTo(0, 300);
        this.ctx.lineTo(this.width, 300);
        // Vertical road center line
        this.ctx.moveTo(500, 0);
        this.ctx.lineTo(500, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw stop lines
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        // Right
        this.ctx.beginPath();
        this.ctx.moveTo(this.stopLines.right, 250);
        this.ctx.lineTo(this.stopLines.right, 350);
        this.ctx.stroke();
        // Down
        this.ctx.beginPath();
        this.ctx.moveTo(450, this.stopLines.down);
        this.ctx.lineTo(550, this.stopLines.down);
        this.ctx.stroke();
        // Left
        this.ctx.beginPath();
        this.ctx.moveTo(this.stopLines.left, 250);
        this.ctx.lineTo(this.stopLines.left, 350);
        this.ctx.stroke();
        // Up
        this.ctx.beginPath();
        this.ctx.moveTo(450, this.stopLines.up);
        this.ctx.lineTo(550, this.stopLines.up);
        this.ctx.stroke();

        // Draw crosswalks
        this.crosswalks.forEach(crosswalk => {
            this.ctx.fillStyle = crosswalk.active ? '#ffff00' : '#fff';

            if (crosswalk.width > crosswalk.height) {
                // Horizontal crosswalk (zebra stripes)
                for (let i = 0; i < 5; i++) {
                    this.ctx.fillRect(crosswalk.x + i * 20, crosswalk.y, 10, crosswalk.height);
                }
            } else {
                // Vertical crosswalk (zebra stripes)
                for (let i = 0; i < 5; i++) {
                    this.ctx.fillRect(crosswalk.x, crosswalk.y + i * 20, crosswalk.width, 10);
                }
            }
        });

        // Draw signals
        for (let i = 0; i < 4; i++) {
            const { x, y } = this.signalPositions[i];

            // Signal box
            this.ctx.fillStyle = '#222';
            this.ctx.fillRect(x, y, 30, 70);

            // Red light
            this.ctx.fillStyle = this.signals[i].state === 'red' ? '#ff0000' : '#550000';
            this.ctx.beginPath();
            this.ctx.arc(x + 15, y + 15, 10, 0, Math.PI * 2);
            this.ctx.fill();

            // Yellow light
            this.ctx.fillStyle = this.signals[i].state === 'yellow' ? '#ffff00' : '#555500';
            this.ctx.beginPath();
            this.ctx.arc(x + 15, y + 35, 10, 0, Math.PI * 2);
            this.ctx.fill();

            // Green light
            this.ctx.fillStyle = this.signals[i].state === 'green' ? '#00ff00' : '#005500';
            this.ctx.beginPath();
            this.ctx.arc(x + 15, y + 55, 10, 0, Math.PI * 2);
            this.ctx.fill();

            // Add glow effect for active lights in night mode
            if (this.timeOfDay === 'night') {
                let glowColor;
                let glowY;

                if (this.signals[i].state === 'red') {
                    glowColor = 'rgba(255, 0, 0, 0.5)';
                    glowY = y + 15;
                } else if (this.signals[i].state === 'yellow') {
                    glowColor = 'rgba(255, 255, 0, 0.5)';
                    glowY = y + 35;
                } else if (this.signals[i].state === 'green') {
                    glowColor = 'rgba(0, 255, 0, 0.5)';
                    glowY = y + 55;
                }

                const gradient = this.ctx.createRadialGradient(
                    x + 15, glowY, 5,
                    x + 15, glowY, 20
                );
                gradient.addColorStop(0, glowColor);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x + 15, glowY, 20, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // Draw vehicles
        this.vehicles.forEach(vehicle => {
            if (vehicle.image && vehicle.image.complete) {
                // Rotate image based on direction
                this.ctx.save();
                this.ctx.translate(vehicle.x + vehicle.width / 2, vehicle.y + vehicle.height / 2);

                if (vehicle.direction === 'right') {
                    this.ctx.rotate(0);
                } else if (vehicle.direction === 'down') {
                    this.ctx.rotate(Math.PI / 2);
                } else if (vehicle.direction === 'left') {
                    this.ctx.rotate(Math.PI);
                } else if (vehicle.direction === 'up') {
                    this.ctx.rotate(3 * Math.PI / 2);
                }

                this.ctx.drawImage(
                    vehicle.image,
                    -vehicle.width / 2,
                    -vehicle.height / 2,
                    vehicle.width,
                    vehicle.height
                );

                this.ctx.restore();
            } else {
                // Fallback to colored rectangle
                this.ctx.fillStyle = vehicle.color;
                this.ctx.fillRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
            }
        });

        // Draw pedestrians
        this.pedestrians.forEach(pedestrian => {
            if (pedestrian.image && pedestrian.image.complete) {
                // Rotate image based on direction
                this.ctx.save();
                this.ctx.translate(pedestrian.x + pedestrian.width / 2, pedestrian.y + pedestrian.height / 2);

                if (pedestrian.direction === 'right') {
                    this.ctx.rotate(0);
                } else if (pedestrian.direction === 'down') {
                    this.ctx.rotate(Math.PI / 2);
                } else if (pedestrian.direction === 'left') {
                    this.ctx.rotate(Math.PI);
                } else if (pedestrian.direction === 'up') {
                    this.ctx.rotate(3 * Math.PI / 2);
                }

                // Draw with slight animation if moving
                const offsetY = pedestrian.waiting ? 0 : (pedestrian.animationFrame * 2);

                this.ctx.drawImage(
                    pedestrian.image,
                    -pedestrian.width / 2,
                    -pedestrian.height / 2 + offsetY,
                    pedestrian.width,
                    pedestrian.height
                );

                this.ctx.restore();
            } else {
                // Fallback to colored circle
                this.ctx.fillStyle = pedestrian.color;
                this.ctx.beginPath();
                this.ctx.arc(
                    pedestrian.x + pedestrian.width / 2,
                    pedestrian.y + pedestrian.height / 2,
                    pedestrian.width / 2,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        });

        // Draw cyclists
        this.cyclists.forEach(cyclist => {
            if (cyclist.image && cyclist.image.complete) {
                // Rotate image based on direction
                this.ctx.save();
                this.ctx.translate(cyclist.x + cyclist.width / 2, cyclist.y + cyclist.height / 2);

                if (cyclist.direction === 'right') {
                    this.ctx.rotate(0);
                } else if (cyclist.direction === 'down') {
                    this.ctx.rotate(Math.PI / 2);
                } else if (cyclist.direction === 'left') {
                    this.ctx.rotate(Math.PI);
                } else if (cyclist.direction === 'up') {
                    this.ctx.rotate(3 * Math.PI / 2);
                }

                // Draw with slight animation if moving
                const offsetY = cyclist.waiting ? 0 : (cyclist.animationFrame * 2);

                this.ctx.drawImage(
                    cyclist.image,
                    -cyclist.width / 2,
                    -cyclist.height / 2 + offsetY,
                    cyclist.width,
                    cyclist.height
                );

                this.ctx.restore();
            } else {
                // Fallback to colored rectangle
                this.ctx.fillStyle = cyclist.color;
                this.ctx.fillRect(cyclist.x, cyclist.y, cyclist.width, cyclist.height);
            }
        });

        // Draw accident if in accident mode
        if (this.accidentMode) {
            this.ctx.fillStyle = '#e74c3c';
            // Draw accident marker
            this.ctx.beginPath();
            this.ctx.moveTo(350, 320);
            this.ctx.lineTo(370, 280);
            this.ctx.lineTo(390, 320);
            this.ctx.closePath();
            this.ctx.fill();

            // Draw exclamation mark
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.fillText('!', 370, 310);

            // Draw "crashed" vehicles
            this.ctx.fillStyle = '#7f8c8d';
            this.ctx.fillRect(360, 320, 30, 20);
            this.ctx.fillRect(330, 330, 30, 20);
        }

        // Draw emergency vehicle if in emergency mode
        if (this.emergencyMode) {
            // Draw emergency vehicle (ambulance or police car)
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(300, 320, 40, 20);

            // Red and blue lights
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(305, 315, 10, 5);
            this.ctx.fillStyle = '#0000ff';
            this.ctx.fillRect(325, 315, 10, 5);

            // Flashing effect
            if (Math.floor(Date.now() / 200) % 2 === 0) {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            } else {
                this.ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
            }
            this.ctx.beginPath();
            this.ctx.arc(320, 320, 50, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Continue animation
        requestAnimationFrame(() => this.draw());
    }
}