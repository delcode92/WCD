// I have node js code like below that must listen from `your_channel_name` from my postgre
// how to setup my postgre so it will match for this node code ??
const WebSocket = require('ws');
const { Client } = require('pg');

const dbConfig = {
  user: 'Admin',
  // password: 'your_password',
  database: 'sample_ws',
  host: 'localhost',
  port: 5432, // Default PostgreSQL port
};

// Connect to the PostgreSQL database
const client = new Client(dbConfig);


// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8084 });

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const handleDatabaseChanges = () => {
  client.query('LISTEN your_channel_name');

  client.on('notification', (msg) => {
    // Send the database change notification to all connected WebSocket clients
    broadcast(msg.payload);
  });

  client.connect((err) => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err);
      process.exit(1);
    } else {
      console.log('Connected to PostgreSQL database');
    }
  });
};

handleDatabaseChanges();

// Event listener for connection
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Event listener for message received from client
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
    
    // Echo the message back to the client
    ws.send("balasan dari server");
  });

  // Event listener for closing the connection
  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});