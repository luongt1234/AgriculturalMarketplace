pipeline {
    // Chạy trên bất kỳ agent (server) nào có sẵn của Jenkins
    agent any 

    environment {
        // Định nghĩa các biến môi trường nếu cần
        PROJECT_NAME = "agricultural-marketplace"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Jenkins tự động pull code mới nhất từ Git dựa trên cấu hình Job
                checkout scm 
                echo 'Pull code thành công!'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    echo 'Bắt đầu quá trình build và deploy...'
                    // 1. Tắt các container cũ đang chạy
                    sh 'docker-compose down'
                    
                    // 2. Build lại image mới từ source code và chạy ngầm (-d)
                    sh 'docker-compose up -d --build'
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    // Xóa các image cũ lơ lửng (dangling) để tránh đầy ổ cứng server
                    sh 'docker image prune -f'
                    echo 'Triển khai hoàn tất!'
                }
            }
        }
    }

    // Xử lý thông báo sau khi chạy xong Pipeline
    post {
        success {
            echo "Hệ thống ${PROJECT_NAME} đã deploy thành công! Cà phê thôi ☕"
            // Ở doanh nghiệp, chỗ này thường gọi API gửi tin nhắn qua Telegram/Slack
        }
        failure {
            echo "Oops! Quá trình deploy thất bại. Vui lòng kiểm tra lại log."
        }
    }
}