/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Playfair Display', 'serif'],
				accent: ['Cinzel', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#7c3aed',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#fbbf24',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#fbbf24',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				/* Custom gold scale (maps to amber) */
				gold: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in-up': {
					'0%': { opacity: 0, transform: 'translateY(24px)' },
					'100%': { opacity: 1, transform: 'translateY(0)' },
				},
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				'scale-in': {
					'0%': { opacity: 0, transform: 'scale(0.95)' },
					'100%': { opacity: 1, transform: 'scale(1)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '-200% 0' },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3), 0 0 40px rgba(147, 51, 234, 0.15)' },
					'50%': { boxShadow: '0 0 30px rgba(124, 58, 237, 0.5), 0 0 60px rgba(147, 51, 234, 0.25)' },
				},
				'sparkle': {
					'0%, 100%': { opacity: 0, transform: 'scale(0) rotate(0deg)' },
					'50%': { opacity: 1, transform: 'scale(1) rotate(180deg)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'badge-bounce': {
					'0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
					'50%': { transform: 'translateX(-50%) translateY(-3px)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'scale-in': 'scale-in 0.5s ease-out forwards',
				'shimmer': 'shimmer 3s linear infinite',
				'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
				'sparkle': 'sparkle 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'badge-bounce': 'badge-bounce 2s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
