import { NextApiRequest, NextApiResponse } from 'next'

const games = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.headers;
  const { id } = req.query;
  if (userId) {
    if (games[id]) {
      if (games[id].indexOf(userId) == -1) {
        games[id].push(userId);
      }
    } else {
      games[id] = [userId];
    }
    res.status(200).json({ game: req.query.id, playerCount: games[id] });
  } else {
    res.status(401).json({ error: 'User ID is missing' });
  }
}