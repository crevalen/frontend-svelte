import typography from '@tailwindcss/typography'

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
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            textWrap: 'pretty',

            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              textAlign: 'left',
              overflowWrap: 'anywhere',
            },

            // Heading
            h1: {
              fontSize: '1.75rem',
              fontWeight: '700',
              lineHeight: '1.3',
              textAlign: 'start',
              marginBottom: '0.8em',
              overflowWrap: 'anywhere',
              hyphens: 'auto',
              textWrap: 'balance',
            },
            h2: {
              fontSize: '1.5rem',
              fontWeight: '700',
              lineHeight: '1.35',
              textAlign: 'start',
              marginBottom: '0.6em',
              overflowWrap: 'anywhere',
              hyphens: 'auto',
              textWrap: 'balance',
            },
            h3: {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
              textAlign: 'start',
              marginBottom: '0.5em',
              overflowWrap: 'anywhere',
              hyphens: 'auto',
              textWrap: 'balance',
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

            '--tw-prose-body': theme('colors.slate[800]'),
            '--tw-prose-headings': theme('colors.slate[900]'),
            '--tw-prose-bold': theme('colors.slate[900]'),
            '--tw-prose-links': theme('colors.cyan[600]'),
            '--tw-prose-hr': theme('colors.slate[200]'),
            '--tw-prose-quotes': theme('colors.slate[600]'),
            '--tw-prose-quote-borders': theme('colors.slate[200]'),
            '--tw-prose-invert-body': theme('colors.slate[300]'),
            '--tw-prose-invert-headings': theme('colors.slate[100]'),
            '--tw-prose-invert-bold': theme('colors.slate[100]'),
            '--tw-prose-invert-links': theme('colors.cyan[400]'),
            '--tw-prose-invert-hr': theme('colors.slate[700]'),
            '--tw-prose-invert-quotes': theme('colors.slate[400]'),
            '--tw-prose-invert-quote-borders': theme('colors.slate[700]'),
          },
        },
        lg: {
          css: {
            fontSize: '18px',
            lineHeight: '1.8',
            textAlign: 'left',
            overflowWrap: 'anywhere',

            p: { textAlign: 'left', overflowWrap: 'anywhere' },
            h1: {
              fontSize: '1.9rem',
              fontWeight: '700',
              lineHeight: '1.3',
              textAlign: 'start',
              marginBottom: '0.8em',
              overflowWrap: 'anywhere',
              hyphens: 'auto',
              textWrap: 'balance',
            },
            h2: {
              fontSize: '1.6rem',
              fontWeight: '700',
              lineHeight: '1.35',
              textAlign: 'start',
              marginBottom: '0.6em',
              overflowWrap: 'anywhere',
              hyphens: 'auto',
              textWrap: 'balance',
            },
            h3: {
              fontSize: '1.3rem',
              fontWeight: '600',
              lineHeight: '1.4',
              textAlign: 'start',
              marginBottom: '0.5em',
              overflowWrap: 'anywhere',
              hyphens: 'auto',
              textWrap: 'balance',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
