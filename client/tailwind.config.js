const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				body: ['"IBM Plex Sans"', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				blue: {
					100: '#d8e6fd',
					200: '#b1cdfb',
					300: '#89b4fa',
					400: '#629bf8',
					500: '#3b82f6',
					600: '#2f68c5',
					700: '#234e94',
					800: '#183462',
					900: '#0c1a31',
				},
			},
			spacing: {
				160: '40rem',
			},
			container: false,
		},
	},
	variants: {
		extend: {
			backgroundColor: ['disabled'],
			borderColor: ['disabled'],
		},
	},
	plugins: [
		function ({ addComponents }) {
			addComponents({
				'.container': {
					width: '100%',
					marginLeft: 'auto',
					marginRight: 'auto',
					'@screen sm': { maxWidth: '640px' },
					'@screen md': { maxWidth: '768px' },
					'@screen lg': { maxWidth: '975px' },
				},
			});
		},
	],
};
