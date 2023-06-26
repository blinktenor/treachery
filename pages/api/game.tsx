import { NextApiRequest, NextApiResponse } from 'next'

const games = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gameId, userId } = req.query;
  if (userId) {
    if (games[gameId]) {
      if (games[gameId].indexOf(userId) == -1) {
        games[gameId].push(userId);
      }
    } else {
      games[gameId] = [userId];
    }
    res.status(200).json({ game: gameId, playerCount: games[gameId].length });
  } else {
    res.status(401).json({ error: 'User ID is missing' });
  }
}