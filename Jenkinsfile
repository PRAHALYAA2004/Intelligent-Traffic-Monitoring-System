pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'nodejs'  // Ensure this matches the name in Global Tool Configuration
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/PRAHALYAA2004/Intelligent-Traffic-Monitoring-System' // Replace with your repo
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    withEnv(["PATH+NODE=$NODEJS_HOME/bin"]) {
                        sh 'npm install' // Install project dependencies
                    }
                }
            }
        }

        stage('Run Jest Tests') {
            steps {
                script {
                    withEnv(["PATH+NODE=$NODEJS_HOME/bin"]) {
                        sh 'npm test -- --ci --json --outputFile=jest-results.json'  // Run Jest tests and output results
                    }
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                script {
                    archiveArtifacts artifacts: 'jest-results.json', onlyIfSuccessful: false
                }
            }
        }
    }

    post {
        always {
            echo "Jest testing completed."
        }
        failure {
            echo "Jest tests failed! Check logs for errors."
        }
    }
}
