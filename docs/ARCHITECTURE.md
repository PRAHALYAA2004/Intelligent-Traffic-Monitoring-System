
# ARCHITECTURE

## System Overview
The Intelligent Traffic Management System is built using a **client-server architecture** with a backend handling requests and a frontend displaying traffic insights.

### Components
1. **Frontend** - Built with HTML, CSS, JavaScript.
2. **Backend** - Uses Node.js and Express to manage traffic data and API requests.
3. **Database** - MongoDB stores traffic data and analytics.
4. **Testing & CI/CD** - SonarQube, Jest, Jenkins ensure reliability and automation.

### Data Flow
1. Sensors and user inputs provide traffic data.
2. The backend processes the data and updates MongoDB.
3. The frontend fetches and displays real-time analytics.

---

