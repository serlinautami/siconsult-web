const activeConfig = {
  environment: 'development',
  version: '1.0.1',
  developmentStatus: ''
};

const appEnvironment = {
  development: {
    firebase: {
      config: {
        apiKey: "AIzaSyCeLTe2h1P5SI7vAA2w-R-2rOv3ENsR5Ds",
        authDomain: "si-consult-stmik-pembangunan.firebaseapp.com",
        databaseURL: "https://si-consult-stmik-pembangunan.firebaseio.com",
        projectId: "si-consult-stmik-pembangunan",
        storageBucket: "si-consult-stmik-pembangunan.appspot.com",
        messagingSenderId: "428698717024",
        appId: "1:428698717024:web:dfa3919e2549fdad0bec05"
      }
    }
  },
  production: {
    firebase: {
      config: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      }
    }
  }
};

const currentEnvironment = appEnvironment[activeConfig.environment];
const currentConfig = activeConfig;

export { currentEnvironment, currentConfig };
