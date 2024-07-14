export function load({ cookies, request }) {
	const isLoggedIn = cookies.get('loggedIn');

	return {
		isLoggedIn
	};
}
