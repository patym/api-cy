pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/patym/api-cy'
            }
        }
        
         stage('Instalar dependências') {
            steps {
                sh 'npm install'
            }
        }
        
         stage('Executar testes') {
            steps {
                sh 'npm run cy:run'
            }
        }
    }
}