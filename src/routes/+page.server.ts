import { redirect } from '@sveltejs/kit';

export function load({ cookies, request }) {
	const url = new URL(request.url);
	const pathname = url.pathname;

	if (pathname === '/') {
		const params = url.searchParams;
		const logged_out = params.get('logged_out');

		if (logged_out) {
			cookies.set('loggedIn', 'false', { path: '/' });
		} else {
			cookies.set('loggedIn', 'true', { path: '/' });
		}

		const isLoggedIn = cookies.get('loggedIn');

		if (isLoggedIn === 'true') {
			redirect(302, '/dashboard');
		}
	}

	return;
}
