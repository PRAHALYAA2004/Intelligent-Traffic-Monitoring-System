pipeline {
    agent any

    tools {
        nodejs 'nodejs'  // Ensure Jenkins uses the correct Node.js installation
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/PRAHALYAA2004/Intelligent-Traffic-Monitoring-System'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'  // Install all project dependencies
            }
        }

        stage('Run Jest Tests') {
            steps {
                script {
                    try {
                        sh 'npm test'  // Run Jest tests
                    } catch (Exception e) {
                        echo 'Jest tests failed! Check logs for errors.'
                        error('Tests failed!')
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube Server') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
