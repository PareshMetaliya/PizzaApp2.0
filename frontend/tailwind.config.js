/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
	extend: {
		screens: {
			xs: '450px'
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		colors: {
			customYellow: '#F1C93B',
			customBrown: '#342B2B',
			customDark: '#171A1F',
			customGray: '#514343',
			customGreen: '#1A5D1A',
			customGrayDark: '#9e9d9d',
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			primary: {
				DEFAULT: 'hsl(var(--primary))',
				foreground: 'hsl(var(--primary-foreground))'
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			}
		},
		fontFamily: {
			poppins: ['Poppins', 'sans-serif']
		},
		backgroundImage: {
			hero: 'linear-gradient(to bottom right, #ffffff 30%, rgba(241, 201, 59, 0.6) 80%)',
			// login: 'url('/image/login page background.jpg')',
			// heromd: '/image/heroPizzaImage.png',
			heromd: "url('/image/heroPizzaImage.png')",
			navbar: 'linear-gradient(to right, #ffffff 70%, rgba(241, 201, 59, 0.6) 140%)'
		},
		backgroundColor: {
			'light-yellow': 'rgba(241, 201, 59, 0.1)'
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		}
	}
},
  plugins: [require("tailwindcss-animate")],
}

