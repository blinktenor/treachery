const WebSocketServer = require('ws');
const httpsServer = require('./httpsServer');
const fs = require('fs');

let games = {};

const isPlayerAssigned = (gameId, userId) => {
  const player = isPlayerInGame(gameId, userId);
  return player?.roleType !== undefined;
};

const isPlayerInGame = (gameId, userId) => {
  return games[gameId]?.players.filter((player) => player.playerId === userId)[0];
};

const playersInGame = (game) => new Set([...game?.players].map((player) => player.playerId)).size;

const wss = new WebSocketServer.Server({ server: httpsServer });

const connections = new Set();

wss.on('connection', (ws) => {
  logToFile('WebSocket server connected.');
  let socketConnection;

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { userId, gameId } = data;
    const connection = { socket: ws, gameId: gameId, userId: userId };
    if (!socketConnection) {
      socketConnection = connection;
      connections.add(connection);
    }

    if (userId && gameId) {
      const player = { playerId: userId };

      if (!games[gameId]) {
        const game = {
          host: userId,
          gameId: gameId,
          players: [player]
        };

        games[gameId] = game;
      } else {
        if (games[gameId].host === '') {
          games[gameId].host = userId;
        }
        if (!isPlayerInGame(gameId, userId)) {
          games[gameId].players.push(player);
        }
      }

      const messageToBroadcast = JSON.stringify({ playerCount: playersInGame(games[gameId]) });
      connections.forEach((connection) => {
        connection.socket.send(messageToBroadcast);
      });
    }
  });

  ws.on('close', () => {
    connections.delete(socketConnection);
    const { gameId, userId } = socketConnection;

    // Player dropped before we assigned roles
    if (!isPlayerAssigned(gameId, userId)) {
      const player = games[gameId]?.players.filter((player) => player.playerId === userId)[0];
      games[gameId]?.players.splice(games[gameId].players.indexOf(player), 1);

      if (games[gameId]?.players.length === 0) {
        games[gameId].host = '';
      } else if (games[gameId].host === userId) {
        games[gameId].host = games[gameId].players[0].playerId;
      }
    }

    if (gameId) {
      const messageToBroadcast = JSON.stringify({ playerCount: playersInGame(games[gameId]) });
      connections.forEach((connection) => {
        connection.socket.send(messageToBroadcast);
      });
    }
  });
});

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