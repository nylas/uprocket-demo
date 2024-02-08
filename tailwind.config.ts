import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          '50': '#ecffe5',
          '100': '#d3ffc7',
          '200': '#a9ff95',
          '300': '#73fe58',
          '400': '#46f526',
          '500': '#23dc06',
          '600': '#14a800',
          '700': '#138506',
          '800': '#14690b',
          '900': '#14580f',
          '950': '#033201',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),

    function ({ addBase, theme }: { addBase: any; theme: any }) {
      function extractColorVars(colorObj: { [x: string]: any }, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey]

          const newVars: { [x: string]: any } =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`)

          return { ...vars, ...newVars }
        }, {})
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      })
    },
  ],
}
export default config
