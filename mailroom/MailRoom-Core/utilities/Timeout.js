// Timeout wrapper to prevent requests from stalling indefinitely
export const timeout = (promise, ms) => {
  // Our timeout promise
  const timer = new Promise((resolve, reject) => {
    // Set timeout to 3 minutes
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('Request timed out'));
    }, ms || 180000);
  });

  // If our promise takes longer than 3 minutes, we will timeout
  return Promise.race([timer, promise]);
};
