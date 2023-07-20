const WebSocketServer = require('ws');
const httpsServer = require('./httpsServer');
const fs = require('fs');
const socketMethods = require('./webSocketFunctions');

const wss = new WebSocketServer.Server({ server: httpsServer });

wss.on('connection', socketMethods);

wss.on('error', (error) => {
  logToFile(error);
});

function logToFile(message) {
  const logEntry = `${new Date().toISOString()}: ${message}\n`;
  fs.appendFile('server.log', logEntry, (err) => {
    if (err) {
      console.error('Failed to write log entry:', err);
    }
  });
}