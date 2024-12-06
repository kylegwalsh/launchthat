// Determine the stage
const stage = location.hostname === 'localhost' ? 'dev' : 'prod';

/**
 * General project level configuration options
 */
export const config: any = {
  /**
   * The stage of the application
   */
  stage,
  /**
   * Google authentication details
   */
  auth: {
    /**
     * Client id for google
     */
    clientId: '1041818283387-clpq47t4brpqrggq9devsu0eivq3tvdd.apps.googleusercontent.com',
  },
  /**
   * Different APIs
   */
  api: {
    /**
     * The default API to use
     */
    default: 'paidpal',
    /**
     * Homebase api
     */
    homebase: stage === 'dev' ? 'http://34.239.143.199/api' : 'https://homebase-api.launchthat.com/api',
    /**
     * Paidpal api
     */
    paidpal: stage === 'dev' ? 'http://54.173.28.11/api' : 'https://paidpal-api.launchthat.com/api',
    /**
     * Special api endpoint to handle auth
     */
    auth: stage === 'dev' ? 'http://54.173.28.11/auth/' : 'https://paidpal-api.launchthat.com/auth/',
  },
};