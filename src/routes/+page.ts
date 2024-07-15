import type { GameI } from '../types/index.js';

export async function load({ fetch }) {
	const allGames = await fetch('/api/games');
	const games = await allGames.json();

	return {
		games: games
	} as {
		games: GameI[];
	};
}
