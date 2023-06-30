import { Server } from 'ws';
import { NextApiRequest, NextApiResponse } from 'next';
import { Game, Player } from './gameTypes';

const games: Game[] = [];
const wss = new Server({ noServer: true });

const getGameById = (gameId: string) => games.find((game) => game.gameId === gameId);
const isPlayerInGame = (userId: string, game: Game) => game.players.some((player) => player.playerId === userId);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gameId, userId } = req.query;

  if (userId && gameId) {
    if (Array.isArray(gameId)) gameId = gameId.join('');
    if (Array.isArray(userId)) userId = userId.join('');
    const newPlayer: Player = { playerId: userId };
    const game = getGameById(gameId) || { gameId: gameId, players: [newPlayer] } as Game;

    if (!isPlayerInGame(userId, game)) {
      game.players.push(newPlayer);
    }
    if (!getGameById(gameId)) {
      games.push(game);
    }

    res.status(200).json({ game: gameId, playerCount: game.players.length });
  } else {
    res.status(401).json({ error: 'User or Game ID is missing' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export const websocketHandler = (req: NextApiRequest, socket: any, head: any) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    const { gameId, userId } = req.query;

    if (gameId && userId) {
      if (Array.isArray(gameId)) gameId = gameId.join('');
      if (Array.isArray(userId)) userId = userId.join('');

      const game = getGameById(gameId);

      if (game) {
        ws.on('message', (message: string) => {
          // Handle incoming WebSocket messages
          console.log(`Received message: ${message}`);
        });

        ws.on('close', () => {
          // Handle WebSocket connection close
          console.log('Connection closed');
        });

        // Send initial data to the connected client
        ws.send(JSON.stringify({ game: gameId, playerCount: game.players.length }));
      } else {
        ws.close();
      }
    } else {
      ws.close();
    }
  });
};