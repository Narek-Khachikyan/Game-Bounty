/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
         colors: {
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
         },
         borderRadius: {
            dossier: '1.75rem',
            poster: '1.25rem',
         },
         fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
         },
      },
   },
   plugins: [],
}
