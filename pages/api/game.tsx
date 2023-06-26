import { NextApiRequest, NextApiResponse } from 'next'
import { Game, Player } from './gameTypes';

const games: Game[] = [];

const getGameById = (gameId: string) => games.filter((game) => game.gameId == gameId);
const isPlayerInGame = (userId: string, game: Game) => game.players.filter((player) => player.playerId === userId).length > 0;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let { gameId, userId } = req.query;
  if (userId && gameId) {
    if (Array.isArray(gameId)) gameId = gameId.join('');
    if (Array.isArray(userId)) userId = userId.join('');
    const newPlayer: Player = { playerId: userId };
    const game = getGameById(gameId)[0] || {gameId: gameId, players: [newPlayer]} as Game;
    if (!isPlayerInGame(userId, game)) {
      game.players.push(newPlayer);
    }
    res.status(200).json({ game: gameId, playerCount: game.players.length });
  } else {
    res.status(401).json({ error: 'User or Game ID is missing' });
  }
}