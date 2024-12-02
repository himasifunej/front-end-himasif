/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '4.5': '18px',
      },
      fontSize: {
        'title-3-sm': ['36px', { lineHeight: '48px', fontWeight: '600' }],
        'title-4-sm': ['28px', { lineHeight: '42px', fontWeight: '600' }],
        'title-5-sm': ['30px', { lineHeight: '45px', fontWeight: '600' }],
        'deskripsi-sm': ['18px', { lineHeight: '30px', fontWeight: '500' }],
        'title-blog-sm': ['20px', { lineHeight: '30px', fontWeight: '500' }],
        button: ['14px', { lineHeight: '21px', fontWeight: '500' }],
        'title-1': ['30px', { lineHeight: '36px', fontWeight: '700' }],
        'title-2': ['24px', { lineHeight: '36px', fontWeight: '600' }],
        'title-3': ['20px', { lineHeight: '30px', fontWeight: '600' }],
        'title-4': ['16px', { lineHeight: 'normal', fontWeight: '600' }],
        'title-5': ['14px', { lineHeight: '21px', fontWeight: '600' }],
        'title-blog': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        deskripsi: ['10px', { lineHeight: '15px', fontWeight: '400' }],
      },
      colors: {
        text: {
          primary: {
            DEFAULT: '#000000',
            dark: '#ffffff',
          },
          secondary: {
            DEFAULT: '#494949',
            dark: '#868686',
          },
          placeholder: {
            DEFAULT: '#868686',
            dark: '#494949',
          },
          invert: {
            DEFAULT: '#FFFFFF',
            dark: '#000000',
          },
        },
        div: {
          psdm: {
            DEFAULT: '#64b5f6',
            dark: '#64b5f6',
          },
          kader: {
            DEFAULT: '#9D78BC',
            dark: '#9D78BC',
          },
          litbang: {
            DEFAULT: '#FDD734',
            dark: '#FDD734',
          },
          humas: {
            DEFAULT: '#A5A5A5',
            dark: '#A5A5A5',
          },
          mediatek: {
            DEFAULT: '#FF6D00',
            dark: '#FF6D00',
          },
        },
        bg: {
          primary: {
            DEFAULT: '#FAF9F6',
            dark: '#151515',
          },
          secondary: {
            DEFAULT: '#EFEBDF',
            dark: '#0A0A0A',
          },
          brand: {
            DEFAULT: '#ff6d00',
            dark: '#ff6d00',
          },
        },
        card: {
          primary: {
            DEFAULT: '#FFFFFF',
            dark: '#1a1a1a',
          },
          hover: {
            DEFAULT: '#F8F8F8',
            dark: '#242424',
          },
          pressed: {
            DEFAULT: '#E9E9E9',
            dark: '#333333',
          },
        },
        border: {
          primary: {
            DEFAULT: '#CECECE',
            dark: '#494949',
          },
        },
        color: {
          blur: {
            15: {
              DEFAULT: 'rgba(0, 0, 0, 0.04)',
              dark: 'rgba(255, 255, 255, 0.15)',
            },
            20: {
              DEFAULT: 'rgba(0, 0, 0, 0.08)',
              dark: 'rgba(255, 255, 255, 0.2)',
            },
            30: {
              DEFAULT: 'rgba(0, 0, 0, 0.12)',
              dark: 'rgba(255, 255, 255, 0.3)',
            },
            40: {
              DEFAULT: 'rgba(0, 0, 0, 0.16)',
              dark: 'rgba(255, 255, 255, 0.4)',
            },
            60: {
              DEFAULT: 'rgba(0, 0, 0, 0.3)',
              dark: 'rgba(255, 255, 255, 0.6)',
            },
          }
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/line-clamp'),

  ],
};