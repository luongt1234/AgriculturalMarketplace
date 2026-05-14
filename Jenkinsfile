pipeline {
    // Không cần customWorkspace nữa, Jenkins sẽ tự lo việc này!
    agent any 

    environment {
        PROJECT_NAME = "agricultural-marketplace"
    }

    stages {
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Bắt đầu quá trình build và deploy...'
                    // Do Jenkins đã tự động copy file docker-compose.yml vào workspace của nó
                    // Bạn chỉ cần gõ lệnh chạy bình thường
                    sh 'docker-compose down'
                    sh 'docker-compose up -d --build'
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    sh 'docker image prune -f'
                    echo 'Triển khai hoàn tất!'
                }
            }
        }
    }

    post {
        success {
            echo "Hệ thống ${PROJECT_NAME} đã deploy thành công! Cà phê thôi ☕"
        }
        failure {
            echo "Oops! Quá trình deploy thất bại. Vui lòng kiểm tra lại log."
        }
    }
}