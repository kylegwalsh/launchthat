/**
 * Timeout wrapper to prevent requests from stalling indefinitely
 * @param promise - the promise to watch for timeouts
 * @param ms - how many milliseconds to wait before timing out (defaults to 180000  ~ 3 minutes) 
 */
export const timeout = (promise: Promise<any>, ms?: number) => {

  // Our timeout promise
  const timer = new Promise(((resolve, reject) => {
    // Set timeout to 3 minutes
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('Request timed out'));
    }, ms || 180000);
  }));

  // If our promise takes longer than 3 minutes, we will timeout
  return Promise.race([timer, promise]);
};