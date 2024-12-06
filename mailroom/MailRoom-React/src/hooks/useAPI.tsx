import { useState, useEffect } from 'react';
import { config } from '../config';
import { NotificationStore, UserStore } from '../stores';

/**
 * Possible options for the api hook
 */
interface IOptions {
  /**
   * the name of the api to use (defined in config)
   */
  apiName?: string;
  /**
   * the id to look up from the given route
   */
  id?: string;
  /**
   * an empty version of the object in case you are adding an item
   */
  emptyObj?: object;
  /**
   * query params appended to URL ('?' included automatically)
   */
  queryParams?: string;
  /**
   * content type to use for request
   */
  contentType?: string;
}

/**
 * Hook that queries data from a given api and manages loading state
 * @param route - should be the relative path from the base API ('verticals')
 * @param options - list of options to supply to the api hook
 */
export const useAPI = (route: string, options?: IOptions) => {
  // Track loading
  const [loading, setLoading] = useState(true);
  // Track which fields have errors
  const [errors, setErrors] = useState<any>({});
  // Track data
  const [data, setData] = (options && options.emptyObj) ? useState<any>(options.emptyObj) : useState<any>({});

  /**
   * Asynchronously fetches data from API and sets loading to false when finished
   */
  const refreshData = async() => {
    try {
      // Start loading
      setLoading(true);

      console.log('Refreshing');

      // If we're not creating a new item, fetch and set the data
      if (!options || (options && !options.id) || (options && options.id !== 'add')) {
        let apiURL = config.api[config.api.default];

        // Reset apiURL if we are given a specific api as an option
        if (options && options.apiName) apiURL = config.api[options.apiName];

        // Fetch endpoint with user token
        const response = await fetch(`${apiURL}/${route}` + 
        `${(options && options.id) ? `/${options.id}` : ''}` +
        `${(options && options.queryParams) ? `?${options.queryParams}` : ''}`, {
          headers: {
            'accept': `${options && options.contentType ? options.contentType : 'application/json'}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-AUTH-TOKEN': (UserStore && UserStore.user) ? UserStore.user.token : '',
          },
        });

        console.log(response);

        // Verify the response was successful
        if (response.status >= 200 && response.status < 300) {
          // Check whether JSON was returned
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.indexOf(`${options && options.contentType ? options.contentType : 'application/json'}`) !== -1) {
            const result = await response.json();
            console.log(result);
            setData(result);
          }
          // If not, throw an error
          else NotificationStore.addNotification('error', 'No data returned from API', 'Error Fetching Data');
        }
        // If not, throw an error
        else NotificationStore.addNotification(
          'error',
          `${response.status}${response.statusText ? `: ${response.statusText}` : ''}`,
          'Error Fetching Data',
        );
      }

      console.log('Done');
    }
    // Catch any fetch errors and show a notification
    catch (err) {
      console.log(err);
      NotificationStore.addNotification('error', err.message, 'Error Fetching Data');
    }

    // Finish loading
    setLoading(false);
  };

  /**
   * Function that runs when hook is loaded (calls async function to fetch data)
   */
  useEffect(() => {
    refreshData();
  }, []);

  /**
   * Possible options for the query function
   */
  interface IQueryOptions {
    /**
     * the name of the api to use (defined in config)
     */
    apiName?: string;
    /**
     * the route to query
     */
    route?: string;
    /**
     * the id to look up from the given route
     */
    id?: string;
    /**
     * the data to use in the query
     */
    data?: object;
    /**
     * query params appended to URL ('?' included automatically)
     */
    queryParams?: string;
    /**
     * content type to use for request
     */
    contentType?: string;
  }

  /**
   * Function that queries api to create, update, or delete data
   * @param method - which method to use on the api
   * @param options - options required to perform operations on specific endpoints
   */
  const queryAPI = async(method: 'GET' | 'POST' | 'PUT' | 'DELETE', options?: IQueryOptions) => {
    // Start loading
    setLoading(true);

    // Declare variable to store data to be returned to caller
    let returnData: any;

    try {
      let apiURL = config.api[config.api.default];

      // Reset apiURL if we are given a specific api as an option
      if (options && options.apiName) apiURL = config.api[options.apiName];

      // Query endpoint with user token
      const response = await fetch(`${apiURL}/${options && options.route ? options.route : route}` + 
      `${(options && options.id) ? `/${options.id}` : ''}` +
      `${(options && options.queryParams) ? `?${options.queryParams}` : ''}`, {
        method,
        headers: {
          'accept': `${options && options.contentType ? options.contentType : 'application/json'}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-AUTH-TOKEN': (UserStore && UserStore.user) ? UserStore.user.token : '',
        },
        body: (options && options.data) ? JSON.stringify(options.data) : undefined,
      });
      console.log(response);

      // Check for any server errors
      if (response.status < 200 || response.status > 299) {
        NotificationStore.addNotification('error', response.statusText, 'Error Querying API');
        returnData = { error: true };
      }
      // If there was no error...
      else {
        // Check whether JSON was returned
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf(`${options && options.contentType ? options.contentType : 'application/json'}`) !== -1) {
          const result = await response.json();
          console.log(result);
          returnData = result;
        }
      }
    }
    // Catch any fetch errors and show a notification
    catch (err) {
      console.log(err);
      NotificationStore.addNotification('error', err.message, 'Error Querying API');
      returnData = { error: true };
    }

    // Finish loading and return data
    setLoading(false);
    return returnData;
  };

  return [loading, data, setData, errors, setErrors, queryAPI, refreshData];
};