/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#FFFFFF', // White
					100: '#F7F7F7', // Very Light Gray
					200: '#E1E1E1', // Light Gray
					300: '#CFCFCF', // Gray
					400: '#B1B1B1', // Darker Gray
					500: '#9E9E9E', // Even Darker Gray
					600: '#7E7E7E', // Dark Gray
					700: '#101010',
					800: '#292929',
					900: '#000000' // Black
				}
			}
		}
	},
	plugins: [require('flowbite/plugin')]
};
