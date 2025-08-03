import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      typography: ({ theme }) => ({
        // Konfigurasi untuk kelas .prose dasar
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.slate[800]'),
            '--tw-prose-headings': theme('colors.slate[900]'),
            '--tw-prose-lead': theme('colors.slate[700]'),
            '--tw-prose-links': theme('colors.cyan[600]'),
            '--tw-prose-bold': theme('colors.slate[900]'),
            '--tw-prose-counters': theme('colors.slate[600]'),
            '--tw-prose-bullets': theme('colors.slate[400]'),
            '--tw-prose-hr': theme('colors.slate[300]'),
            '--tw-prose-quotes': theme('colors.slate[900]'),
            '--tw-prose-quote-borders': theme('colors.slate[300]'),
            '--tw-prose-captions': theme('colors.slate[700]'),
            '--tw-prose-code': theme('colors.slate[900]'),
            '--tw-prose-pre-code': theme('colors.slate[100]'),
            '--tw-prose-pre-bg': theme('colors.slate[900]'),
            '--tw-prose-th-borders': theme('colors.slate[300]'),
            '--tw-prose-td-borders': theme('colors.slate[200]'),
            '--tw-prose-invert-body': theme('colors.slate[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.slate[300]'),
            '--tw-prose-invert-links': theme('colors.cyan[400]'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.slate[400]'),
            '--tw-prose-invert-bullets': theme('colors.slate[600]'),
            '--tw-prose-invert-hr': theme('colors.slate[700]'),
            '--tw-prose-invert-quotes': theme('colors.slate[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.slate[700]'),
            '--tw-prose-invert-captions': theme('colors.slate[400]'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.slate[300]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.slate[600]'),
            '--tw-prose-invert-td-borders': theme('colors.slate[700]'),

            // --- PENGATURAN UTAMA UNTUK KERAPIAN ---

            // 1. Hapus batas lebar default dari plugin typography
            maxWidth: 'none',

            // 2. Pengaturan Paragraf (p)
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              // Default (mobile): rata kiri untuk keterbacaan maksimal
              textAlign: 'left',
              // Layar besar (lg ke atas): rata kiri-kanan (justify)
              '@screen lg': {
                textAlign: 'left',
                // Aktifkan pemenggalan kata otomatis untuk menghindari spasi aneh
                hyphens: 'auto',
              },
            },

            // 3. Pengaturan Heading (h1, h2, h3)
            // Menggunakan !important untuk menimpa inline style dari CMS
            h1: {
              fontWeight: '900',
              textAlign: 'left !important',
            },
            h2: {
              fontWeight: '700',
              textAlign: 'left !important',
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              fontWeight: '600',
              textAlign: 'left !important',
              marginTop: '1.6em',
              marginBottom: '0.6em',
            },

            // 4. Perbaikan List untuk Dark Mode
            'ul > li::marker': {
              color: 'var(--tw-prose-bullets)',
            },
            'ol > li::marker': {
              color: 'var(--tw-prose-counters)',
            },
          },
        },
        // Konfigurasi untuk kelas .prose-lg
        lg: {
          css: {
            fontSize: '1.125rem', // 18px
            lineHeight: '1.8',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            h1: { fontSize: '2.5rem' },
            h2: { fontSize: '2rem' },
            h3: { fontSize: '1.5rem' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
