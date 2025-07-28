import typography from '@tailwindcss/typography';
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  
  theme: {
		extend: {
			// Menggunakan fontFamily yang sudah kita impor di app.css
			fontFamily: {
				sans: ['Roboto', 'sans-serif'],
				serif: ['Lora', 'serif'],
			},
      typography: ({ theme }) => ({
        // Gaya DEFAULT untuk kelas `.prose` (Mobile-First)
        DEFAULT: {
          css: {
            maxWidth: '50ch', // Lebar maksimum teks: 45 karakter
            fontSize: '16px', // Ukuran font paragraf
            lineHeight: '1.6', // Line height

            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              textAlign: 'left', // TAMBAHAN: Teks rata kiri khusus mobile
            },

            // Ukuran heading spesifik untuk mobile
            h1: { fontSize: '24px' },
            h2: { fontSize: '20px' },
            h3: { fontSize: '18px' },
            
            // Menggunakan warna dari tema utama
            '--tw-prose-body': theme('colors.slate[800]'),
            '--tw-prose-headings': theme('colors.slate[900]'),
            '--tw-prose-bold': theme('colors.slate[900]'),
            '--tw-prose-links': theme('colors.cyan[600]'),
            '--tw-prose-hr': theme('colors.slate[200]'),
            '--tw-prose-quotes': theme('colors.slate[600]'),
            '--tw-prose-quote-borders': theme('colors.slate[200]'),
            
            // Pengaturan warna untuk mode gelap (dark:prose-invert)
            '--tw-prose-invert-body': theme('colors.slate[300]'),
            '--tw-prose-invert-headings': theme('colors.slate[100]'),
            '--tw-prose-invert-bold': theme('colors.slate[100]'),
            '--tw-prose-invert-links': theme('colors.cyan[400]'),
            '--tw-prose-invert-hr': theme('colors.slate[700]'),
            '--tw-prose-invert-quotes': theme('colors.slate[400]'),
            '--tw-prose-invert-quote-borders': theme('colors.slate[700]'),
          },
        },
        
        // Gaya tambahan untuk kelas `.prose-lg` (Desktop)
        lg: {
          css: {
            maxWidth: '70ch', 
            fontSize: '18px',
            lineHeight: '1.6',

            p: {
              textAlign: 'left', // Teks rata kiri-kanan khusus desktop
            },

            h1: { fontSize: '36px' },
            h2: { fontSize: '28px' },
            h3: { fontSize: '24px' },
          },
        },
      }),
    },
  },
  
  plugins: [typography],
};