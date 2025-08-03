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
            maxWidth: '100%', // Ensure typography doesn't add its own max-width

            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },

            h1: {
              fontSize: '1.75rem',
              fontWeight: '700',
              lineHeight: '1.3',
              textAlign: 'left', // Explicitly left-align headings
              marginBottom: '0.8em',
            },
            h2: {
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1.35',
              textAlign: 'left', // Explicitly left-align headings
              marginBottom: '0.6em',
            },
            h3: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
              textAlign: 'left', // Explicitly left-align headings
              marginBottom: '0.5em',
            },
            ul: {
              listStyleType: 'square',
              paddingLeft: '1.5em',
              marginTop: '1em',
              marginBottom: '1em',
            },
            // Penyesuaian warna marker list di sini untuk mode gelap
            'ul > li::marker': {
              color: theme('colors.slate.800'),
              '.dark &': { // Menggunakan nested selector untuk dark mode
                color: theme('colors.slate.200'),
              },
            },
            // Ensure no max-width is applied by typography plugin
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