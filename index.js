const http = require('http');
const WebSocket = require('ws');
const startGateway = require('./src/index.js');

// Step 1: Create a dummy HTTP server for Render
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("SIP Gateway is running");
}).listen(8080, '0.0.0.0');

console.log("Health check server listening on port 8080");

// Step 2: Connect to ElevenLabs WebSocket (outside the SIP handler for now)
const ELEVEN_AGENT_ID = 'wYvXpQ0VMfeIM82vOlvt';
const elevenLabsSocket = new WebSocket(`wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVEN_AGENT_ID}`);

elevenLabsSocket.on('open', () => {
  console.log('🧠 Connected to ElevenLabs agent!');
});

elevenLabsSocket.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('📨 ElevenLabs message:', message);

  if (message.type === 'agent_response') {
    console.log(`🗣 Agent said: ${message.agent_response_event.agent_response}`);
  }

  if (message.type === 'audio') {
    console.log(`🎧 Received audio response (length: ${message.audio.length})`);
    // TODO: decode and send back to SIP stream
  }
});

// Step 3: Start the SIP/WebSocket gateway
startGateway({
  port: 3000,
  host: '0.0.0.0',
  portSIP: 5060,

  onListen: () => {
    console.log('📞 SIP Gateway listening on ports 5060 (SIP) and 3000 (WS)');
  },

  onConnect: (socket) => {
    console.log('🔌 New WebSocket connection from SIP caller');
  },

  onReceive: (data, stream) => {
    console.log(`🎙 Received ${data.length} bytes from SIP stream`);

    if (elevenLabsSocket.readyState === WebSocket.OPEN) {
      elevenLabsSocket.send(JSON.stringify({
        user_audio_chunk: data.toString('base64') // convert SIP data to base64
      }));
    }

    return true;
  },

  onSend: (data, stream) => {
    console.log(`📤 Sending ${data.length} bytes to SIP stream`);
    return true;
  }
});
