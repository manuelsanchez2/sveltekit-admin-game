import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, request }) => {
	cookies.set('loggedIn', 'true', { path: '/' });
	const isLoggedIn = cookies.get('loggedIn');

	// To get the userId
	const url = new URL(request.url);
	const params = url.searchParams;
	const userId = params.get('userId');

	if (userId) {
		cookies.set('userId', userId, { path: '/' });

		return {
			isLoggedIn,
			userId
		};
	} else {
		const userId = cookies.get('userId');
		return {
			isLoggedIn,
			userId
		};
	}
};
