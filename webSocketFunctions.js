const fs = require('fs');
const roleData = require('./roleData.js');

const connections = new Set();
const games = {};

const isPlayerAssigned = (gameId, userId) => {
  const player = isPlayerInGame(gameId, userId);
  return player?.role !== undefined;
};

const isPlayerInGame = (gameId, userId) => {
  return games[gameId]?.players.filter((player) => player.playerId === userId)[0];
};

const playersInGame = (game) => new Set([...game?.players].map((player) => player.playerId)).size;

const isHost = (gameId, userId) => games[gameId].host === userId;

const assignRoles = (game) => {
  const roleSetups = {
    4: ["LEADER", "ASSASSIN", "ASSASSIN", "TRAITOR"],
    5: ["LEADER", "ASSASSIN", "ASSASSIN", "GUARDIAN", "TRAITOR"],
    6: ["LEADER", "ASSASSIN", "ASSASSIN", "ASSASSIN", "GUARDIAN", "TRAITOR"],
    7: ["LEADER", "ASSASSIN", "ASSASSIN", "ASSASSIN", "GUARDIAN", "GUARDIAN", "TRAITOR"],
    8: ["LEADER", "ASSASSIN", "ASSASSIN", "ASSASSIN", "GUARDIAN", "GUARDIAN", "TRAITOR", "TRAITOR"]
  }
  const roles = roleSetups[game.players.length];

  // Shuffle the roles array to randomize the order
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  // Assign roles to each player in the game and add title and ability
  game.players.forEach((player, index) => {
    const role = roles[index];
    const randomRoleIndex = Math.floor(Math.random() * roleData[role].length);
    const roleInfo = roleData[role][randomRoleIndex];

    player.role = role;
    player.title = roleInfo.title;
    player.ability = roleInfo.ability;
    player.url=roleInfo.url;
  });

  game.started = true;
}

const createGame = (userId, gameId, player) => games[gameId] = { host: userId, gameId: gameId, players: [player] };

const broadcastQueuePage = (connections, gameId, userId) => {
  connections.forEach((connection) => {
    if (connection.gameId === gameId) {
      const messageToBroadcast = JSON.stringify({ playerCount: playersInGame(games[gameId]), host: isHost(gameId, connection.userId) });
      connection.socket.send(messageToBroadcast);
    }
  });
}

const broadcastRoles = (connections, gameId) => {
  connections.forEach((connection) => {
    if (connection.gameId === gameId) {
      const player = isPlayerInGame(connection.gameId, connection.userId);
      connection.socket.send(JSON.stringify(player));
    }
  });
}

const socketMethods = (ws) => {
  logToFile('WebSocket server connected.');
  let socketConnection;

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { userId, gameId, startGame } = data;

    if (userId && gameId && !startGame) {
      if (!socketConnection) {
        const newConnection = { socket: ws, gameId: gameId, userId: userId };
        socketConnection = newConnection;
        connections.add(newConnection);
      }
      
      const player = { playerId: userId };

      // Lets make sure the game object is up to date
      if (!games[gameId]) {
        createGame(userId, gameId, player);
      } else {
        // if there is no host, assign this player
        if (games[gameId].host === '') {
          games[gameId].host = userId;
        }
        // if this player isn't in th game, add them
        if (!isPlayerInGame(gameId, userId)) {
          games[gameId].players.push(player);
        }
      }

      const game = games[gameId];

      if (!game.started) {
        broadcastQueuePage(connections, gameId, userId);
      } else {
        broadcastRoles(connections, gameId);
      }
      
    } else if (userId && gameId && startGame) {
      // if (playersInGame(games[gameId]) > 4 && isHost(gameId, userId)) {
        const game = games[gameId];
        if (!game.started) {
          assignRoles(game);
        }
        broadcastRoles(connections, gameId);
      // }
    }
  });

  ws.on('close', () => {
    connections.delete(socketConnection);
    if (socketConnection) {
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
    }
  });
}

function logToFile(message) {
  const logEntry = `${new Date().toISOString()}: ${message}\n`;
  fs.appendFile('server.log', logEntry, (err) => {
    if (err) {
      console.error('Failed to write log entry:', err);
    }
  });
}

module.exports = socketMethods;