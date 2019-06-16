const path = require('path');

module.exports = {
  output_folder: path.resolve(__dirname, '../server/public/'),
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, "./src/styles/global.scss")]
    }
  },
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8081'
      }
    }
  }
}
