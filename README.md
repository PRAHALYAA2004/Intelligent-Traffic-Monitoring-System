# Intelligent-Traffic-Monitoring-System
19CSE314 Software Engineering Project


## Overview
The **Intelligent Traffic Management System (ITMS)** is designed to reduce traffic congestion, minimize delays, and promote eco-friendly traffic solutions. It leverages real-time data processing and smart algorithms to optimize traffic flow and enhance urban mobility.

## Features
- **Real-time Traffic Monitoring**: Uses sensors and cameras to collect live traffic data.
- **Traffic Signal Optimization**: Adjusts traffic light timing dynamically based on congestion levels.
- **Accident Detection and Alerts**: Identifies accidents and notifies emergency services.
- **Route Recommendations**: Suggests optimal routes based on real-time traffic conditions.
- **Data Analytics Dashboard**: Provides insights and trends on traffic patterns.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Testing & CI/CD**: Jest, SonarQube, Jenkins
- **Deployment**: Docker (for SonarQube setup)

## Installation Instructions
### Prerequisites
Ensure the following are installed:
- Node.js
- MongoDB
- Docker (for SonarQube)

### Setup Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/PRAHALYAA2004/Intelligent-Traffic-Monitoring-System.git
   cd Intelligent-Traffic-Monitoring-System
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Start the MongoDB Server** (Ensure MongoDB is running)
   ```sh
   mongod
   ```
4. **Run the Application**
   ```sh
   npm start
   ```
   The server will start at `http://localhost:3000`

## Usage
- Access the web application via a browser at `http://localhost:3000`
- Interact with traffic analytics and visualization modules

## Configuration
- Modify `.env` file to set database credentials and API keys if necessary.
- Adjust traffic rules and parameters in `config.js`

## Testing
- **Run Unit Tests**
  ```sh
  npm run test
  ```
- **Perform Static Code Analysis with SonarQube**
  ```sh
  sonar-scanner
  ```
- **Automated CI/CD with Jenkins** (ensure Jenkins is configured)

## Contributing
1. Fork the repository
2. Create a new feature branch
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes
   ```sh
   git commit -m "Add new feature"
   ```
4. Push and create a pull request

## License
This project is licensed under the **MIT License**.

## Contact
For any issues or inquiries, please visit the [GitHub Issues page](https://github.com/PRAHALYAA2004/Intelligent-Traffic-Monitoring-System/issues).

