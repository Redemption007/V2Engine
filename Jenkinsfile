pipeline {
  agent any
    
  tools {
    node {
      env.NODEJS_HOME = "${tool 'Node 6.x'}"
      // on linux / mac
      env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
      sh 'npm --version'
}
  }
    
  stages {
        
    stage('Git') {
      steps {
        git 'https://github.com/Redemption007/V2Engine.git'
      }
    }
     
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }  
    
            
    stage('Start') {
      steps {
        sh 'npm start'
      }
    }
  }
}
