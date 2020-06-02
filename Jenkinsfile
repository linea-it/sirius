pipeline {
  environment {
    registry = 'linea/sirius'
    registryCredential = 'Dockerhub'
    deployment = 'sirius'
    namespace = 'sirius'
    namespace_prod = 'sirius'
    dockerImage = ''
    GIT_COMMIT_SHORT = sh(
      script: "printf \$(git rev-parse --short ${GIT_COMMIT})",
      returnStdout: true
    )
  }
  agent any
  stages {
    stage('Creating version.json') {
      steps {
        sh './version.sh && cat ./src/assets/json/version.json'
      }
    }
    stage('Build Images') {
      steps {
        script {
          dockerImage = docker.build registry + ":$GIT_COMMIT_SHORT"
        }
      }
    }
    stage('Push Images') {
      steps {
        script {
          docker.withRegistry('', registryCredential) {
            dockerImage.push()
          }
        }
      }
    }
  }
  post {
    always {
      sh "docker rmi $registry:$GIT_COMMIT_SHORT --force"
      sh "docker rmi $registry:$GIT_COMMIT_SHORT --force"
      sh """
        curl -D - -X \"POST\" \
        -H \"content-type: application/json\" \
        -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
        -d '{\"argString\": \"-namespace $namespace -commit $GIT_COMMIT_SHORT -image $registry:$GIT_COMMIT_SHORT -deployment $deployment\"}' \
        https://fox.linea.gov.br/api/1/job/82aef3c2-9fe3-4450-9400-83087e03d69b/executions
      """
    }
  }
}
