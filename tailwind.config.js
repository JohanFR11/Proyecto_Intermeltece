import defaultTheme from 'tailwindcss/defaultTheme'
import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],

  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Figtree',
                    ...defaultTheme.fontFamily.sans
                ]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },

  plugins: [nextui(), require("tailwindcss-animate")]
}
