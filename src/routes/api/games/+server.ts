import fs from 'fs';
import path from 'path';
import type { GameI } from '$types';

const filePath = path.join(process.cwd(), 'src', 'db', 'games.json');

// Helper function to read the JSON file
const readGames = () => {
	const data = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(data);
};

// Helper function to write to the JSON file
const writeGames = (games: GameI) => {
	fs.writeFileSync(filePath, JSON.stringify(games, null, 2));
};

export async function GET() {
	const games = readGames();

	return new Response(JSON.stringify(games), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
