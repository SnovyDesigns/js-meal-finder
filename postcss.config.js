module.exports = {
  plugins: [
    require('postcss-sort-media-queries'),
    require('postcss-combine-duplicated-selectors')({
      removeDuplicatedProperties: true
    }),
    require('autoprefixer')
  ]
};
