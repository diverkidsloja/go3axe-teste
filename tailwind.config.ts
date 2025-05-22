
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
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['TT Norms', 'system-ui', 'sans-serif'],
        oceanshore: ['Oceanshore', 'serif']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        go3: {
          primary: '#07183F',     // Azul escuro
          accent: '#00FF4D',      // Verde neon
          light: '#F5F7FA',       // Cinza muito claro para fundo
          dark: '#1A1A1A',        // Quase preto para texto
          muted: '#6B7280',       // Cinza para texto secundário
          success: '#10B981',     // Verde para sucesso
          warning: '#F59E0B',     // Amarelo para avisos
          error: '#EF4444',       // Vermelho para erros
          info: '#3B82F6',        // Azul para informações
        },
        primary: {
          DEFAULT: '#07183F',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#00FF4D',
          foreground: '#07183F'
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
          DEFAULT: '#00FF4D',
          foreground: '#07183F'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 255, 77, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 255, 77, 0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-green': 'pulse-green 2s infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
