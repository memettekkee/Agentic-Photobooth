/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                pink: {
                    primary: '#FF6B9D',
                    200: '#FFBAD5',
                    100: '#FFE0ED',
                },
                yellow: {
                    primary: '#FFD93D',
                },
                purple: {
                    primary: '#C77DFF',
                },
                teal: {
                    primary: '#4ECDC4',
                },
                booth: {
                    bg: '#FFF9FB',
                    text: '#2D2D2D',
                }
            },
            fontFamily: {
                heading: ['Fredoka One', 'cursive'],
                body: ['Nunito', 'sans-serif'],
            },
            keyframes: {
                flash: {
                    '0%': { opacity: '0' },
                    '30%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                pop: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '70%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                countPop: {
                    '0%': { transform: 'scale(0.5)', opacity: '0' },
                    '50%': { transform: 'scale(1.3)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            animation: {
                'bounce-soft': 'bounce 1s infinite',
                'pulse-fast': 'pulse 0.5s ease-in-out',
                'flash': 'flash 0.4s ease-out forwards',
                'pop': 'pop 0.3s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'count-pop': 'countPop 0.5s ease-out forwards',
            },
            boxShadow: {
                'pink': '0 4px 20px rgba(255, 107, 157, 0.35)',
                'yellow': '0 4px 20px rgba(255, 217, 61, 0.35)',
                'purple': '0 4px 20px rgba(199, 125, 255, 0.35)',
                'teal': '0 4px 20px rgba(78, 205, 196, 0.35)',
                'card': '0 8px 32px rgba(255, 107, 157, 0.15)',
            }
        },
    },
    plugins: [],
};
