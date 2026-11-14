/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
          colors: {
             arcade: {
                paper: '#101722',
                paperWarm: '#202e41',
                ink: '#f1f5fb',
                muted: '#afbdd0',
                line: '#304056',
                red: '#a93644',
                redDeep: '#812b37',
                blue: '#a7ceff',
                cyan: '#9bdce8',
                yellow: '#263b57',
                green: '#8dd3b5',
                violet: '#c1b7ef',
                panel: '#182332',
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
             arcade: 'none',
             arcadeSoft: '0 18px 45px rgba(43, 27, 15, 0.18)',
             poster: '0 20px 50px rgba(21, 17, 15, 0.25)',
          },
          borderRadius: {
             dossier: '1.75rem',
             poster: '1.25rem',
             arcade: '1rem',
          },
          fontFamily: {
             sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
             display: ['Barlow Condensed', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          },
      },
   },
   plugins: [],
}
