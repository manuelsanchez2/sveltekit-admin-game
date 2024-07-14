import { USERS } from './users';
import GAMES from './games.json';

export const getUserById = (id: number) => {
	return USERS.find((user) => user.id === id);
};

export const getGameById = (id: string) => {
	return GAMES.find((game) => game.id === id);
};
