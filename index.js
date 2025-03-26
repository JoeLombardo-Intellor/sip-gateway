// index.js
const sipGateway = require('sip-gateway');

sipGateway.start({
  port: 3000,
  portSIP: 5060,
  onListen: () => {
    console.log('Gateway listening on SIP port 5060 and WebSocket port 3000');
  },
  onReceive: (data, stream) => {
    console.log('Received data:', data);
  },
  onSend: (data, stream) => {
    console.log('Sending data:', data);
  },
  onConnect: (socket) => {
    console.log('New connection', socket);
  },
});
