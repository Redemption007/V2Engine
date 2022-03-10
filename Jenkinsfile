pipeline {
  agent any
    
  tools {
    nodejs {
      env.NODEJS_HOME = "${tool 'Node 17.7.0'}"
      // on linux / mac
      env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
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
