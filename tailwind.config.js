import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
            textAlign: 'left',
            wordBreak: 'normal',
            overflowWrap: 'anywhere',
            maxWidth: '100%',

            p: {
              textAlign: 'left',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },

            h1: {
              fontSize: '1.75rem',
              fontWeight: '700',
              lineHeight: '1.3',
              textAlign: 'start',
              marginBottom: '0.8em',
              wordBreak: 'normal',
              overflowWrap: 'anywhere',
            },
            h2: {
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1.35',
              textAlign: 'start',
              marginBottom: '0.6em',
              wordBreak: 'normal',
              overflowWrap: 'anywhere',
            },
            h3: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
              textAlign: 'start',
              marginBottom: '0.5em',
              wordBreak: 'normal',
              overflowWrap: 'anywhere',
            },
            ul: {
              listStyleType: 'square',
              paddingLeft: '1.5em',
              marginTop: '1em',
              marginBottom: '1em',
            },
            'ul > li::marker': {
              color: theme('colors.black'),
            },
          },
        },
        lg: {
          css: {
            fontSize: '18px',
            lineHeight: '1.8',
            textAlign: 'left',
            maxWidth: '100%',
            wordBreak: 'normal',
            overflowWrap: 'anywhere',
          },
        },
      }),
    },
  },
  plugins: [typography],
};
