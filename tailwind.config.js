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
            lineHeight: '1.6',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              textAlign: 'left',
            },
            h1: {
              fontSize: '26px',
              textAlign: 'left', 
              wordBreak: 'break-word', 
            },
            h2: {
              fontSize: '22px',
              textAlign: 'left', 
              wordBreak: 'break-word', 
            },
            h3: {
              fontSize: '20px',
              textAlign: 'left', 
              wordBreak: 'break-word', 
            },
            h4: { 
              textAlign: 'left',
              wordBreak: 'break-word',
            },
            h5: { 
              textAlign: 'left',
              wordBreak: 'break-word',
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

            // Warna tema
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
            lineHeight: '1.6',
            p: {
              textAlign: 'left',
            },
            h1: {
              fontSize: '36px',
              textAlign: 'left', 
              wordBreak: 'break-word', 
            },
            h2: {
              fontSize: '28px',
              textAlign: 'left', 
              wordBreak: 'break-word', 
            },
            h3: {
              fontSize: '24px',
              textAlign: 'left', 
              wordBreak: 'break-word', 
            },
             h4: { 
              textAlign: 'left',
              wordBreak: 'break-word',
            },
            h5: { 
              textAlign: 'left',
              wordBreak: 'break-word',
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
      }),
    },
  },

  plugins: [typography],
};
