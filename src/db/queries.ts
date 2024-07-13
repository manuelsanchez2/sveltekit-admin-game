import { USERS } from './users';

export const getUserById = (id: number) => {
	return USERS.find((user) => user.id === id);
};
