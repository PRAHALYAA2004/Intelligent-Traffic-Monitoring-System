// Array of vehicle numbers
const vehicleNumbers = Array.from({ length: 30 }, (_, i) => `TN${1000 + i}`);

// Predefined points with their coordinates (latitude, longitude) in Tamil Nadu
const points = {
  "Chennai": [13.0827, 80.2707],
  "Coimbatore": [11.0168, 76.9558],
  "Madurai": [9.9252, 78.1198],
  "Tiruchirappalli": [10.7905, 78.7047],
  "Salem": [11.6643, 78.1460],
  "Vellore": [12.9165, 79.1325],
  "Erode": [11.3410, 77.7172],
  "Thanjavur": [10.7869, 79.1378],
  "Kanyakumari": [8.0883, 77.5385],
  "Ooty": [11.4102, 76.6950],
  "Pondicherry": [11.9139, 79.8145],
  "Hosur": [12.7406, 77.8253],
  "Tirunelveli": [8.7139, 77.7567],
  "Nagercoil": [8.1773, 77.4344],
  "Dindigul": [10.3670, 77.9803],
  "Karur": [10.9574, 78.0809],
  "Namakkal": [11.2212, 78.1652]
};

// Predefined logical routes between major cities
const routes = {
  "Chennai-Coimbatore": ["Chennai", "Vellore", "Salem", "Erode", "Coimbatore"],
  "Chennai-Madurai": ["Chennai", "Tiruchirappalli", "Madurai"],
  "Chennai-Tiruchirappalli": ["Chennai", "Vellore", "Salem", "Tiruchirappalli"],
  "Coimbatore-Madurai": ["Coimbatore", "Erode", "Dindigul", "Madurai"],
  "Coimbatore-Tiruchirappalli": ["Coimbatore", "Erode", "Tiruchirappalli"],
  "Madurai-Tiruchirappalli": ["Madurai", "Dindigul", "Tiruchirappalli"],
  "Madurai-Kanyakumari": ["Madurai", "Tirunelveli", "Nagercoil", "Kanyakumari"],
  "Chennai-Pondicherry": ["Chennai", "Vellore", "Pondicherry"],
  "Coimbatore-Ooty": ["Coimbatore", "Erode", "Ooty"],
  "Salem-Kanyakumari": ["Salem", "Tiruchirappalli", "Madurai", "Tirunelveli", "Kanyakumari"]
};

// Function to get logical intermediate points based on start and destination
function getLogicalIntermediatePoints(start, destination) {
  const routeKey = `${start}-${destination}`;
  const reverseRouteKey = `${destination}-${start}`;

  if (routes[routeKey]) {
    return routes[routeKey].slice(1, -1); // Exclude start and end points
  } else if (routes[reverseRouteKey]) {
    return routes[reverseRouteKey].slice(1, -1).reverse(); // Reverse the route
  } else {
    return []; // No predefined route found
  }
}

// DOM Elements
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const transportContainer = document.getElementById('transport-container');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginName = document.getElementById('loginName');
const loginPassword = document.getElementById('loginPassword');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const transportDropdown = document.getElementById('transport-dropdown');
const animationContainer = document.getElementById('animation-container');
const infoBox = document.getElementById('info-box');
const confirmationOptions = document.getElementById('confirmation-options');
const errorBox = document.getElementById('error-box');
const routeInfo = document.getElementById('route-info');
const submitBtn = document.getElementById('submit-btn');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');
const seeRouteBtn = document.getElementById('see-route-btn');
const routeSuggestion = document.getElementById('route-suggestion');
const viewInMapBtn = document.getElementById('view-in-map-btn');
const page1 = document.getElementById('page-1');
const navbar = document.getElementById('navbar');
const homeLink = document.getElementById('home-link');
const profileLink = document.getElementById('profile-link');
const profileBox = document.getElementById('profile-box');
const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const closeProfileBox = document.getElementById('close-profile-box');

// Set the minimum date for the date input to today
const dateInput = document.getElementById('date');
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const yyyy = today.getFullYear();

const minDate = `${yyyy}-${mm}-${dd}`;
dateInput.setAttribute('min', minDate);

// Initialize the map
let routeStops = []; // Store the route stops globally
profileLink.addEventListener('click', (e) => {
  e.preventDefault();
  // Get user details from session storage
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');

  // Update profile box content
  profileUsername.textContent = userName;
  profileEmail.textContent = userEmail;

  // Show profile box
  profileBox.classList.remove('hidden');
});

// Event Listener for Close Button
closeProfileBox.addEventListener('click', () => {
  // Hide profile box
  profileBox.classList.add('hidden');
});

// Event Listener for Login Form
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = loginName.value;
  const password = loginPassword.value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password: password })
    });

    const result = await response.json();
    if (result.success) {
      // Store user details in session storage
      sessionStorage.setItem('userName', name);
      sessionStorage.setItem('userEmail', result.email);

      // Hide login form and show navbar + transportation selection
      loginContainer.classList.add('hidden');
      navbar.classList.remove('hidden');
      transportContainer.classList.remove('hidden');
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Error during login. Please try again.');
  }
});

// Event Listener for Signup Form
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = signupName.value;
  const email = signupEmail.value;
  const password = signupPassword.value;

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, email: email, password: password })
    });

    const result = await response.json();
    alert(result.message);
    if (result.success) {
      // Redirect to login page after successful signup
      signupContainer.classList.add('hidden');
      loginContainer.classList.remove('hidden');
      signupForm.reset(); // Reset the signup form
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('Error during signup. Please try again.');
  }
});

// Event Listener for Login Link
loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  signupContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
});

// Event Listener for Signup Link
signupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginContainer.classList.add('hidden');
  signupContainer.classList.remove('hidden');
});

// Event Listener for Home Link
homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  // Redirect to the transportation selection page
  transportContainer.classList.remove('hidden');
  infoBox.classList.add('hidden');
  confirmationOptions.classList.add('hidden');
  routeInfo.classList.add('hidden');
  page1.classList.remove('hidden');
});

// Event Listener for Profile Link
profileLink.addEventListener('click', (e) => {
  e.preventDefault();
  // Show user profile details (you can customize this part)
  const userName = sessionStorage.getItem('userName');
  const userEmail = sessionStorage.getItem('userEmail');
  alert(`Profile Details:\nName: ${userName}\nEmail: ${userEmail}`);
});

// Event Listeners for Transportation Selection
transportDropdown.addEventListener('change', () => {
  if (transportDropdown.value) {
    page1.classList.add('hidden');
    animationContainer.classList.remove('hidden');

    setTimeout(() => {
      animationContainer.classList.add('hidden');
      infoBox.classList.remove('hidden');
    }, 2000);
  }
});

submitBtn.addEventListener('click', () => {
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const start = document.getElementById('start').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const vehicleNum = document.getElementById('vehicle-num').value.trim().toUpperCase();

  if (vehicleNumbers.includes(vehicleNum)) {
    errorBox.classList.add('hidden');
    infoBox.classList.add('hidden');
    confirmationOptions.classList.remove('hidden');

    document.getElementById('route-date').textContent = date;
    document.getElementById('route-time').textContent = time;
    document.getElementById('route-start').textContent = start;
    document.getElementById('route-destination').textContent = destination;
    document.getElementById('route-vehicle-num').textContent = vehicleNum;

    const intermediatePoints = getLogicalIntermediatePoints(start, destination);
    routeStops = [start, ...intermediatePoints, destination];
    routeSuggestion.textContent = routeStops.join(" → ");
  } else {
    errorBox.classList.remove('hidden');
  }
});

confirmBookingBtn.addEventListener('click', async () => {
  const bookingData = {
    name: sessionStorage.getItem('userName'),
    emailid: sessionStorage.getItem('userEmail'),
    pickup: document.getElementById('start').value.trim(),
    dropoff: document.getElementById('destination').value.trim(),
    transportType: transportDropdown.value
  };

  try {
    const response = await fetch('http://localhost:3000/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    alert(result.message);

    window.location.href = "confirmation.html";
  } catch (error) {
    console.error('Error during booking:', error);
    alert('Error during booking. Please try again.');
  }
});

seeRouteBtn.addEventListener('click', () => {
  confirmationOptions.classList.add('hidden');
  routeInfo.classList.remove('hidden');
});

viewInMapBtn.addEventListener('click', () => {
  const url = `map.html?route=${encodeURIComponent(routeStops.join(","))}`;
  window.open(url, '_blank');
});

initMap();