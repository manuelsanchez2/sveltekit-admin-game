import { writable } from 'svelte/store';
import type { AuthState, UserI } from '../types';

// Initial state
const initialAuthState: AuthState = {
	isAuthenticated: false,
	user: null,
	token: null
};

export const auth = writable<AuthState>(initialAuthState);

export const login = (user: UserI, token: string) => {
	auth.set({
		isAuthenticated: true,
		user: user,
		token: 'Bearer ' + token
	});
};

// Function to log out
export const logout = () => {
	auth.set(initialAuthState);
};

export const isUserAuthenticated = () => {
	let result = false;
	auth.subscribe((value) => {
		result = value.isAuthenticated;
	});
	return result;
};

export const isUserAdmin = () => {
	let result = false;
	auth.subscribe((value) => {
		if (value.user) {
			result = value.user.role === 'admin';
		}
	});
	return result;
};
