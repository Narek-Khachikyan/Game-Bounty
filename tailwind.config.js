/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
          colors: {
             arcade: {
                paper: '#fff4d6',
                paperWarm: '#ffe7a7',
                ink: '#15110f',
                muted: '#6f5944',
                line: '#15110f',
                red: '#f04438',
                redDeep: '#b42318',
                blue: '#1769ff',
                cyan: '#00a9c8',
                yellow: '#ffd23f',
                green: '#13a56b',
                violet: '#8b3dff',
                panel: '#fffaf0',
                shadow: '#2b1b0f',
             },
             bounty: {
               canvas: '#080d1a',
               ink: '#f8fafc',
               muted: '#a8b3cf',
               panel: '#111a2f',
               panelRaised: '#17223b',
               line: '#273653',
               amber: '#f8b84e',
               amberDeep: '#b96d13',
               violet: '#8b5cf6',
               cyan: '#36d4ff',
               danger: '#ef4444',
               success: '#4ade80',
            },
            contract: {
               paper: '#fff7e8',
               ink: '#2b1b0f',
               muted: '#766044',
               stamp: '#9f3a2f',
            },
         },
          boxShadow: {
             dossier: '0 24px 80px rgba(0, 0, 0, 0.38)',
             contract: '0 18px 50px rgba(8, 13, 26, 0.28)',
             signal: '0 0 0 1px rgba(248, 184, 78, 0.2), 0 0 32px rgba(248, 184, 78, 0.18)',
             arcade: '8px 8px 0 rgba(21, 17, 15, 0.95)',
             arcadeSoft: '0 18px 45px rgba(43, 27, 15, 0.18)',
             poster: '0 20px 50px rgba(21, 17, 15, 0.25)',
          },
          borderRadius: {
             dossier: '1.75rem',
             poster: '1.25rem',
             arcade: '1rem',
          },
          fontFamily: {
             sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
             display: ['Archivo Black', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          },
      },
   },
   plugins: [],
}
