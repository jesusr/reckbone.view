var path = require('path');

module.exports = function (config) {
  config.set({
    files: [
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'node_modules/sinon/pkg/sinon.js',
      'spec/context.js'
    ],
    frameworks: ['mocha'],
    preprocessors: {
      'spec/context.js': ['webpack', 'sourcemap']
    },
    client: {
      chai: {
        includeStack: true
      }
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'build/coverage/',
      reporters: [
        {
          type: 'text'
        },
        {
          type: 'text-summary'
        }
      ]
    },
    webpack: {
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'source-map-loader',
          enforce: 'pre'
        }, {
          test: /\.js$/,
          exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: [
              ['transform-es2015-classes', {
                'loose': true
              }]
            ]
          }
        }, {
          test: /\.hbs$/,
          exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
          loader: 'handlebars-template-loader'
        }, {
          test: /\.json$/,
          include: /(src\/data)/,
          exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
          loader: 'json-loader'
        }, {
          test: /\.js/,
          exclude: /(test|node_modules|bower_components)/,
          loader: 'istanbul-instrumenter-loader',
          enforce: 'post'
        }]
      },
      resolve: {
        extensions: ['.webpack.js', '.web.js', '.js'],
        modules: [
          'node_modules',
          'src',
          'example'
        ],
        alias: {
          modules: path.join(__dirname, 'node_modules')
        }
      },
      target: 'node',
      devtool: 'inline-source-map'
    },
    plugins: [
      require('karma-webpack'),
      require('istanbul-instrumenter-loader'),
      require('karma-mocha'),
      require('karma-coverage'),
      require('karma-phantomjs-launcher'),
      require('karma-spec-reporter'),
      require('karma-sourcemap-loader')
    ],
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: '50000'
  });
};
