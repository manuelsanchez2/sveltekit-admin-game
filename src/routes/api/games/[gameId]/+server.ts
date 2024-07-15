import { getGameById } from '$db/queries.js';
import type { GameI } from '$types';
import fs from 'fs';
import path from 'path';

// TODO: this is a hack, we should use a database
const filePath = path.join(process.cwd(), 'src', 'db', 'games.json');

const readGames = (): GameI[] => {
	const data = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(data);
};

const writeGames = (games: GameI[]) => {
	fs.writeFileSync(filePath, JSON.stringify(games, null, 2));
};

export async function GET({ params, fetch }) {
	const gameId = params.gameId;
	const response = await fetch('/api/games');
	const games = await response.json();
	const game = games.find((game: GameI) => game.id === gameId);

	if (!game) {
		return new Response(JSON.stringify({ error: 'Game not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return new Response(JSON.stringify(game), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function DELETE({ params }) {
	let games = readGames();
	games = games.filter((game) => game.id !== params.gameId);

	writeGames(games);

	return new Response(null, {
		status: 204
	});
}

export async function PUT({ params, request }) {
	// Get all the games
	let games = readGames();

	// Get the game
	const game = getGameById(games, params.gameId);

	// Create the future game with the new data
	const bodyData = await request.json();
	const futureGame = { ...game, ...bodyData };

	// Remove the old game
	games = games.filter((game) => game.id !== params.gameId);

	// Add the future game
	games.push(futureGame);

	writeGames(games);

	return new Response(null, {
		status: 204
	});
}
