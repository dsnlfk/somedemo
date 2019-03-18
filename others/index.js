easywebpack
w.config.js

ztgw

egg: true,
framework: 'react',
devtool: NO_HOT ? '' : 'cheap-module-eval-source-map',
entry: {
  include: ['app/web/page'],
  exclude: ['app/web/page/[a-z]+/component', 'app/web/page/test'],
  loader: {
    client: 'app/web/framework/entry/client-loader.js',
    server: 'app/web/framework/entry/server-loader.js'
  }
},
dll: ['react', 'react-dom', 'axios'],
loaders: {},
plugins: {},
done() {
  console.log('---webpack compile finish---');
}


gw

egg: true,
framework: 'react',
devtool: NO_HOT ? '' : 'cheap-module-eval-source-map',
entry: {
  include: ['app/web/page',
    { layout: 'app/web/framework/layout/layout.jsx?loader=false' }
  ],
  loader: {
    client: `app/web/framework/loader/client${NO_HOT ? '' : '-local'}.js`,
    server: 'app/web/framework/loader/server.js'
  }
},
alias: {
  web: 'app/web',
  component: 'app/web/component',
  framework: 'app/web/framework'
},
dll: [ 'react', 'react-dom', 'axios' ],
loaders: {
  sass: true,
  urlimage: {
    options: { limit: 1024 * 3 }
  }
},
plugins: {
  // serviceworker: true,
  // uglifyJs: false,
  // hot: false
},
buildPath: 'app/public',
cdn: UAE_CI ? { url: '//img.xxx_web.com/s/uae/g/3k/xxx_wap/public/' } : {},
done() {
  console.log('---> webpack compile finish <---');
}
