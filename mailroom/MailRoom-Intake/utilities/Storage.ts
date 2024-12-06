import { getConfig } from './../config';
import * as fetch from 'node-fetch';

/**
 * A utility used for storage
 */
export const Storage = {

  /**
   * Stores JSON data in an s3 file
   * @param options - the options required to store the data
   */
  storeJSON: async(options: {
    /**
     * the json you would like to store
     */
    content: object;
    /**
     * the bucket where the json should be stored
     */
    bucket: string; 
    /**
     * the name of the file the json should be stored in
     */
    fileName: string;
    /**
     * the folder path where the file can be found (if not defined, the file be stored at the root)
     */
    path?: string; 
  }) => {
    // Get the config
    const config = await getConfig();

    // POST the data to our storage endpoint (stores in s3)
    const result = await fetch(config.storage.s3.endpoint, {
      method: 'POST',
      body: JSON.stringify({ 
        ...options, 
        content: JSON.stringify(options.content) 
      })
    });

    console.log('Storing JSON - Data', options);
    console.log('Storing JSON - Result', result);

    return result;
  },

  /**
   * Retrieves JSON data from an s3 file
   * @param options - the options required to store the data
   */
  getJSON: async(options: {
    /**
     * the bucket where the json should be stored
     */
    bucket: string; 
    /**
     * the name of the file the json should be stored in
     */
    fileName: string;
    /**
     * the folder path where the file can be found (if not defined, the file be stored at the root)
     */
    path?: string; 
  }) => {
    // Get the config
    const config = await getConfig();

    // POST the data to our storage endpoint (stores in s3)
    const result = await fetch(config.storage.s3.endpoint +
      `?bucket=${options.bucket}&fileName=${options.fileName}${options.path ? `&path=${options.path}` : ''}`, 
      {
        method: 'GET'
      }
    );

    console.log('Getting JSON - Result', result);

    return result;
  },

};