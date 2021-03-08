const { sessionMiddleware, simpleRolesIsAuthorized } = require("@blitzjs/server")

module.exports = {
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {


    console.log('config', config)

    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return {
      ...config,
      resolve: {
        ...config.resolve,
      },
    }
  },
  webpackDevMiddleware(config) {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        ignored: [],
      },
    }
  },
}
