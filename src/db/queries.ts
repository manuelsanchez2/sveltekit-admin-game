import { USERS } from './data';

export const getUserById = (id: number) => {
	return USERS.find((user) => user.id === id);
};
