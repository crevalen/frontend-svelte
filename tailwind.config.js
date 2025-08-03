import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class', // Add or ensure this is present for dark mode to work via class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            fontSize: '16px',
            lineHeight: '1.75',
            maxWidth: '100%', 

            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },

            h1: {
              fontSize: '1.75rem',
              fontWeight: '700',
              lineHeight: '1.3',
              textAlign: 'left', 
              marginBottom: '0.8em',
            },
            h2: {
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1.35',
              textAlign: 'left', 
              marginBottom: '0.6em',
            },
            h3: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
              textAlign: 'left', 
              marginBottom: '0.5em',
            },
            ul: {
              listStyleType: 'square',
              paddingLeft: '1.5em',
              marginTop: '1em',
              marginBottom: '1em',
            },
            'ul > li::marker': {
              color: theme('colors.slate.800'), 
              '@apply dark:!text-slate-200': {}, 
            },
            
            '*': {
              maxWidth: 'none',
            },
          },
        },
        lg: {
          css: {
            fontSize: '18px',
            lineHeight: '1.8',
            maxWidth: '100%',
          },
        },
      }),
    },
  },
  plugins: [typography],
};