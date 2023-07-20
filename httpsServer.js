const https = require('https');
const fs = require('fs');
const { WebSocket, WebSocketServer } = require('ws');

const options = {
  key: fs.readFileSync('./key.pem', 'utf8'),
  cert: fs.readFileSync('./cert.pem', 'utf8')
};

// const server = https.createServer(options, (req, res) => {
//   res.writeHead(301, { 'Location': 'https://treachery.vercel.app/' });
//   res.end();
// });

const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

server.listen(1037);

module.exports = server;

function logToFile(message) {
  const logEntry = `${new Date().toISOString()}: ${message}\n`;
  fs.appendFile('server.log', logEntry, (err) => {
    if (err) {
      console.error('Failed to write log entry:', err);
    }
  });
}
