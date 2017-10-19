require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  botAdminAPI: 'http://localhost:8079/v1',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Botframework Dashboard',
    description: 'Bot Admin API UI',
    head: {
      titleTemplate: 'Bot Admin: %s',
      meta: [
        {name: 'description', content: 'Bot Admin API in UI'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Bot Admin'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Bot Admin'},
        {property: 'og:description', content: 'Bot Admin API in UI'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@erikras'},
        {property: 'og:creator', content: '@erikras'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },
  creds: {
    // Required
    identityMetadata: 'https://login.microsoftonline.com/OFFICERAKUTEN.onmicrosoft.com/.well-known/openid-configuration',
    // or equivalently: 'https://login.microsoftonline.com/<tenant_guid>/.well-known/openid-configuration'
    //
    // or you can use the common endpoint
    // 'https://login.microsoftonline.com/common/.well-known/openid-configuration'
    // To use the common endpoint, you have to either set `validateIssuer` to false, or provide the `issuer` value.

    // Required, the client ID of your app in AAD
    clientID: '5324c6cb-55e0-4988-ba90-bd31af30f339',

    // Required, must be 'code', 'code id_token', 'id_token code' or 'id_token'
    responseType: 'code id_token',

    // Required
    responseMode: 'form_post',

    // Required, the reply URL registered in AAD for your app
    redirectUrl: 'http://localhost:3000/auth/openid/return',

    // Required if we use http for redirectUrl
    allowHttpForRedirectUrl: true,

    // Required if `responseType` is 'code', 'id_token code' or 'code id_token'.
    // If app key contains '\', replace it with '\\'.
    clientSecret: 'fr1O2gtUlUY6jYJ6RyE014dhkm/T56HZySeSVq99YFg=',

    // Required to set to false if you don't want to validate issuer
    validateIssuer: true,

    // Required if you want to provide the issuer(s) you want to validate instead of using the issuer from metadata
    issuer: null,

    // Required to set to true if the `verify` function has 'req' as the first parameter
    passReqToCallback: false,

    // Recommended to set to true. By default we save state in express session, if this option is set to true, then
    // we encrypt state and save it in cookie instead. This option together with { session: false } allows your app
    // to be completely express session free.
    useCookieInsteadOfSession: false,

    // Required if `useCookieInsteadOfSession` is set to true. You can provide multiple set of key/iv pairs for key
    // rollover purpose. We always use the first set of key/iv pair to encrypt cookie, but we will try every set of
    // key/iv pair to decrypt cookie. Key can be any string of length 32, and iv can be any string of length 12.
    cookieEncryptionKeys: [
      { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
      { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
    ],

    // Optional. The additional scope you want besides 'openid', for example: ['email', 'profile'].
    scope: null,

    // Optional, 'error', 'warn' or 'info'
    loggingLevel: 'info',

    // Optional. The lifetime of nonce in session or cookie, the default value is 3600 (seconds).
    nonceLifetime: null,

    // Optional. The max amount of nonce saved in session or cookie, the default value is 10.
    nonceMaxAmount: 5,

    // Optional. The clock skew allowed in token validation, the default value is 300 seconds.
    clockSkew: null,
  },
  // Optional.
  // If you want to get access_token for a specific resource, you can provide the resource here; otherwise,
  // set the value to null.
  // Note that in order to get access_token, the responseType must be 'code', 'code id_token' or 'id_token code'.
  resourceURL: 'https://graph.windows.net',

  // The url you need to go to destroy the session with AAD
  destroySessionUrl: 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:3000',

  // If you want to use the mongoDB session store for session middleware; otherwise we will use the default
  // session store provided by express-session.
  // Note that the default session store is designed for development purpose only.
  useMongoDBSessionStore: false,

  // If you want to use mongoDB, provide the uri here for the database.
  databaseUri: 'mongodb://localhost/OIDCStrategy',

  // How long you want to keep session in mongoDB.
  mongoDBSessionMaxAge: 24 * 60 * 60 // 1 day (unit is second)
}, environment);
