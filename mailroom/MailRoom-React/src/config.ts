/**
 * General project level configuration options
 */
export const config: any = {
  auth: {
    clientId: '1041818283387-clpq47t4brpqrggq9devsu0eivq3tvdd.apps.googleusercontent.com',
  },
  // Contains a dev endpoint for localhost, and production endpoint
  api: {
    default: 'mailroom',
    mailroom: location.hostname === 'localhost' ? 'http://3.85.6.150/api' : 'https://mailroom-api.launchthat.com/api',
    homebase: location.hostname === 'localhost' ? 'http://34.239.143.199/api' : 'https://homebase-api.launchthat.com/api',
    // Special api endpoint to handle auth
    auth: location.hostname === 'localhost' ? 'http://3.85.6.150/auth/' : 'https://mailroom-api.launchthat.com/auth/',
  },
};