const WebSocketServer = require('ws');

type Message = {
  gameId: string;
  startGame?: boolean;
  userId: string;
}

type Player = {
  playerId: string;
  roleType?: string;
  roleName?: string;
}

type Game = {
  gameId: string;
  host: string;
  players: Player[];
}

type Games = {
  [gameId: string]: Game;
};

type Connection = {
  socket: WebSocket;
  gameId: string;
  userId: string;
}

const games: Games = {};

//@ts-ignore
const wss = new WebSocketServer.Server({ port: 1037 });
const connections = new Set<Connection>();

const isPlayerAssigned = (gameId: string, userId: string) => {
  const player = isPlayerInGame(gameId, userId);
  return player?.roleType !== undefined;
}

const isPlayerInGame = (gameId: string, userId: string) => {
  return games[gameId]?.players.filter((player) => player.playerId === userId)[0];
}

const playersInGame = (game: Game) => new Set([...game?.players].map((player) => player.playerId)).size;

wss.on('connection', (ws: any) => {
  let socketConnection: Connection;

  ws.on('message', (message: any) => {
    const data: Message = JSON.parse(message);
    const { userId, gameId } = data;
    const connection: Connection = { socket: ws, gameId: gameId, userId: userId };
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
        }

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
      // need to add host info into here
      const messageToBroadcast = JSON.stringify({ playerCount: playersInGame(games[gameId]) });
      connections.forEach((connection) => {
        connection.socket.send(messageToBroadcast);
      });
    }
  });
});