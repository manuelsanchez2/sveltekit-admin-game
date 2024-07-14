export function load({ cookies, request }) {
	cookies.set('loggedIn', 'true', { path: '/' });
	const isLoggedIn = cookies.get('loggedIn');

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
}
