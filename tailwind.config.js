module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'red-500': '#ff3737',
                'orange-500': '#ffc107'
            }
        },
    },
    variants: {},
    plugins: [],
};

