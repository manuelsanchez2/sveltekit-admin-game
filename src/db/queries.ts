import { USERS } from './users';
import type { GameI } from '../types';

export const getUserById = (id: number) => {
	return USERS.find((user) => user.id === id);
};

export const getGameById = (gameList: GameI[], id: string) => {
	return gameList.find((game) => game.id === id);
};
