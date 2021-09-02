const path = require('path');

module.exports = {
  outputDir: 'dist',
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
  },
  configureWebpack: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.svg$/i,
          loader: 'svg-sprite-loader',
          include: [path.resolve('src/components/Icon/svg-icons')],
          options: {
            symbolId: 'icon-[name]',
            limit: 10000
          }
        },
        {
          test: /\.svg$/i,
          loader: 'file-loader',
          exclude: [path.resolve('src/components/Icon/svg-icons')],
          options: {
            name: 'img/[name].[hash:8].[ext]',
            limit: 10000
          }
        },
        {
          test: /\.xls.?$/i,
          loader: 'file-loader',
        }
      ]
    }
  },
  devServer: {
    port: 8088,
    proxy: {
      '/api': {
        'target': 'http://localhost:5008'
      },
      '/icons': {
        'target': 'http://localhost:5008'
      }
    }
  }
};
