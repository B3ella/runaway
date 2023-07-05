/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			backgroundImage: {
				"woman-runnig": "url('/woman-running.jpg')",
			},
			animation: {
				blink: "blink 1s step-start infinite",
			},
			keyframes: {
				blink: {
					"0%, 100%": { opacity: 1 },
					"50%": { opacity: 0 },
				},
			},
		},
	},
	plugins: [],
};
