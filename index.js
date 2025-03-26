const http = require('http');
const startGateway = require('./src/index.js');

// Create a dummy HTTP server to respond to health checks
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("SIP Gateway is running");
}).listen(8080, '0.0.0.0');

console.log("Health check server listening on port 8080");

// Start the SIP/WebSocket gateway
startGateway({
  port: 3000,
  host: '0.0.0.0',
  portSIP: 5060,
  onListen: () => {
    console.log('Gateway listening on ports 5060 (SIP) and 3000 (WS)');
  },
  onConnect: (socket) => {
    console.log('New WebSocket connection');
  },
  onReceive: (data, stream) => {
    console.log('Received data:', data.length);
  },
  onSend: (data, stream) => {
    console.log('Sending data:', data.length);
  }
});
