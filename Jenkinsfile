pipeline {
  agent any
  
  stages {
        
    stage('Git') {
      steps {
        git 'https://github.com/Redemption007/V2Engine.git'
      }
    }
     
    stage('Build') {
      steps {
        nodejs(nodeJSInstallationName: 'Node 17.7.0', configId: '<config-file-provider-id>') {
          sh 'npm config ls'
        }
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
