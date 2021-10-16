module.exports = ({ env }) => {
  return {
    plugins: {
      'autoprefixer': {},
      'cssnano': env === 'development' ? false : { preset: 'default' },
      'tailwindcss': {},
    }
  }
}
