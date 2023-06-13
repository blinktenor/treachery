import { NextApiRequest, NextApiResponse } from 'next'

let gameCount = 0;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  gameCount++;
  res.status(200).json({ game: gameCount })
}