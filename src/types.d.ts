export interface UserI {
	id: number;
	role: 'admin' | 'user';
	name: string;
	email: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: UserI | null;
	token: string | null;
}

export interface GameI {
	id: string;
	name: string;
	publishedAt: string;
	isActive: boolean;
	words: string[];
	lettersCoordinates: CoordinateI[];
}

export interface CharacterI {
	char: string;
	word: string;
}

export interface CoordinateI {
	id: number;
	letter: string;
	coordinateX: number;
	coordinateY: number;
	word: string;
}
