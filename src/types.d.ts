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
