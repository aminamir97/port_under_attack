module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'army': {
                    olive: '#4a5f3a',
                    tan: '#c9b787',
                    brown: '#5c4742',
                    dark: '#1a1d1a',
                },
                'war': {
                    red: '#8b0000',
                    orange: '#d97706',
                    yellow: '#fbbf24',
                },
                'red-500': '#ff3737',
                'orange-500': '#ffc107'
            }
        },
    },
    variants: {},
    plugins: [],
};

