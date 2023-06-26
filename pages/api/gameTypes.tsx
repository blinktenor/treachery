type Player = {
  playerId: string;
  roleType?: string;
  roleName?: string;
}

type Game = {
  gameId: string;
  players: Player[];
}

export { type Game, type Player };