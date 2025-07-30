import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				/* I Ching Oracle semantic colors */
				oracle: {
					glow: 'hsl(var(--oracle-glow))',
					deep: 'hsl(var(--cosmic-deep))',
					purple: 'hsl(var(--ethereal-purple))',
					teal: 'hsl(var(--mystic-teal))',
					gold: 'hsl(var(--wisdom-gold))'
				}
			},
			backgroundImage: {
				'gradient-cosmic': 'var(--gradient-cosmic)',
				'gradient-sacred': 'var(--gradient-sacred)',
				'gradient-ethereal': 'var(--gradient-ethereal)'
			},
			boxShadow: {
				'oracle': 'var(--shadow-oracle)',
				'cosmic': 'var(--shadow-cosmic)',
				'ethereal': 'var(--shadow-ethereal)'
			},
			transitionTimingFunction: {
				'sacred': 'cubic-bezier(0.23, 1, 0.32, 1)',
				'mystical': 'cubic-bezier(0.165, 0.84, 0.44, 1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'oracle-glow': {
					'0%, 100%': {
						opacity: '0.8',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.05)'
					}
				},
				'coin-flip': {
					'0%': {
						transform: 'rotateY(0deg) rotateX(0deg)'
					},
					'25%': {
						transform: 'rotateY(90deg) rotateX(45deg)'
					},
					'50%': {
						transform: 'rotateY(180deg) rotateX(90deg)'
					},
					'75%': {
						transform: 'rotateY(270deg) rotateX(135deg)'
					},
					'100%': {
						transform: 'rotateY(360deg) rotateX(180deg)'
					}
				},
				'hexagram-reveal': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'mystical-float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'33%': {
						transform: 'translateY(-10px) rotate(1deg)'
					},
					'66%': {
						transform: 'translateY(5px) rotate(-1deg)'
					}
				},
				'sacred-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--oracle-glow) / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(var(--oracle-glow) / 0.6)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'oracle-glow': 'oracle-glow 3s ease-in-out infinite',
				'coin-flip': 'coin-flip 1s cubic-bezier(0.23, 1, 0.32, 1)',
				'hexagram-reveal': 'hexagram-reveal 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
				'mystical-float': 'mystical-float 6s ease-in-out infinite',
				'sacred-pulse': 'sacred-pulse 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
