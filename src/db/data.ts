import type { UserI } from '../types';

export const USERS: UserI[] = [
	{
		id: 1123123123123,
		role: 'admin',
		name: 'Manuel',
		email: 'manusansan22@gmail.com'
	},
	{
		id: 2,
		role: 'user',
		name: 'Normal User',
		email: 'manusansan22@gmail.com'
	}
] as const;
