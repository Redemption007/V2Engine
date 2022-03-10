pipeline {
  agent any
    
  tools {nodejs "node@17.7.0"}
    
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
