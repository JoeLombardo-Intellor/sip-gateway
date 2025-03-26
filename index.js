const startGateway = require('./src/index.js');

startGateway({
  port: 3000,
  host: '0.0.0.0',      
  portSIP: 5060,
  onListen: () => {
    console.log('Gateway listening on ports 5060 (SIP) and 3000 (WS)');
  },
  onReceive: (data, stream) => {
    console.log('Received data:', data.length);
  },
  onSend: (data, stream) => {
    console.log('Sending data:', data.length);
  }
});

