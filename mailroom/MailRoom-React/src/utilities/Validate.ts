/**
 * Provides functions relating to validation
 */
export const Validate = {
  /**
   * Validate email
   * @param email - email string to validate
   * @param multi - whether multiple comma separated emails are allowed
   * 
   * @returns
   * @param {boolean} valid - whether the email was valid
   */
  email: (email: string, multi?: boolean) => {
    // Valid email
    const re = multi ? /^([\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})((,|, )[\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})*$/
      : /^([\w+-.%]+@[\w.-]+\.[A-Za-z]{2,4})$/;

    return re.test(String(email).toLowerCase());
  },

  /**
   * Validate slack
   * @param slack - slack string to validate
   * 
   * @returns
   * @param {boolean} valid - whether the slack channel was valid
   */
  slack: (slack: string) => {
    // No spaces
    const re1 = /^\S*$/;
    // No # (included automatically in back end)
    const re2 = /^((?!#).)*$/;

    return re1.test(String(slack).toLowerCase()) && re2.test(String(slack).toLowerCase());
  },

  /**
   * Validate url
   * @param url - url to validate
   * 
   * @returns
   * @param {boolean} valid - whether the url was valid
   */
  url: (url: string) => {
    // Valid url
    const re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    return re.test(String(url).toLowerCase());
  },
  /**
   * Checks whether an object is empty
   * @param obj - the object to check
   * 
   * @returns
   * @param {boolean} empty - whether an object is empty
   */
  empty: (obj: object) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  },

  /**
   * Validate UA-ID
   * @param id - the UA-ID string
   * 
   * @returns
   * @param {boolean} valid - whether the UA-ID is valid
   */
  uaId: (id: string) => {
    const re = /^ua-\d{4,9}-\d{1,4}$/i;
    return re.test(String(id).toLowerCase());
  },

  /**
   * Validate AW-ID
   * @param id - the AW-ID string
   * 
   * @returns
   * @param {boolean} valid - whether the AW-ID is valid
   */
  awId: (id: string) => {
    const re = /^aw-\d{4,11}$/i;
    return re.test(String(id).toLowerCase());
  },

  /**
   * Validate domain
   * @param domain - the domain string
   * 
   * @returns
   * @param {boolean} valid - whether the domain is valid
   */
  domain: (domain: string) => {
    const re = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/igm;
    return re.test(domain);
  },
};