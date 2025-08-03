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
            color: theme('colors.slate.800'),
            fontSize: '16px',
            lineHeight: '1.75',
            maxWidth: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',

            p: {
              marginTop: '1.2em',
              marginBottom: '1.2em',
              textAlign: 'left',
            },
            h1: {
              fontSize: '1.8rem',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '0.8em',
              textAlign: 'left',
            },
            h2: {
              fontSize: '1.5rem',
              fontWeight: '700',
              marginTop: '1.5em',
              marginBottom: '0.6em',
              textAlign: 'left',
            },
            h3: {
              fontSize: '1.25rem',
              fontWeight: '600',
              marginTop: '1.2em',
              marginBottom: '0.5em',
              textAlign: 'left',
            },
            h4: {
              fontSize: '1.1rem',
              fontWeight: '600',
              marginTop: '1em',
              marginBottom: '0.4em',
              textAlign: 'left',
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5em',
              marginTop: '1em',
              marginBottom: '1em',
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.5em',
              marginTop: '1em',
              marginBottom: '1em',
            },
            'ul > li::marker': {
              color: theme('colors.cyan.600'),
            },
            blockquote: {
              fontStyle: 'italic',
              color: theme('colors.slate.600'),
              borderLeft: `4px solid ${theme('colors.cyan.400')}`,
              paddingLeft: '1rem',
              marginTop: '1em',
              marginBottom: '1em',
            },
            a: {
              color: theme('colors.cyan.600'),
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.cyan.800'),
              },
            },
            hr: {
              borderColor: theme('colors.slate.300'),
              marginTop: '2em',
              marginBottom: '2em',
            },
          },
        },
        lg: {
          css: {
            fontSize: '18px',
            lineHeight: '1.8',
             maxWidth: '100%',
            p: { textAlign: 'left' },
            h1: {
              fontSize: '2.25rem',
              lineHeight: '1.3',
              marginBottom: '1em',
            },
            h2: {
              fontSize: '1.875rem',
              marginTop: '1.5em',
              marginBottom: '0.8em',
            },
            h3: {
              fontSize: '1.5rem',
              marginTop: '1.2em',
              marginBottom: '0.6em',
            },
            h4: {
              fontSize: '1.25rem',
              marginTop: '1em',
              marginBottom: '0.5em',
            },
          },
        },
      }),
    },
  },

  plugins: [typography],
};
