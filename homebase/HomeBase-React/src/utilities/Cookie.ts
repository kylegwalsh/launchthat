/**
 * Provides functions relating to cookies
 */
export const Cookie = {
  /**
   * Get the cookie from the browser
   * @param name - name of the cookie
   * @return {string} value - the value associated with the cookie (if it hasn't expired)
   */
  getCookie: (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));

    // Return value if the cookie is found
    if (match) {
      return match[2];
    }
    // Return null if cookie does not exist or expired
    return null;
  },

  /**
   * Set the cookie in the browser
   * @param name - name of the cookie
   * @param value - value to attach to the cookie
   * @param days - number of days the cookie is valid for
   */
  setCookie: (name: string, value: string, days?: number) => {
    // Calculate expiration time
    let time, exp;

    // If expiration days is provided, get the date
    if (days) {
      time = (new Date()).getTime() + (days * 24 * 60 * 60 * 1000);
      exp = new Date(time);
    }

    // Store the cookie
    document.cookie = `${name}=${value}${exp ? `; expires=${exp.toUTCString()};` : ''}`;
  },

  /**
   * Remove cookie from browser by setting expiration date to the past
   */
  removeCookie: (name: string) => {
    document.cookie = `${name}=-1; ;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  },
};