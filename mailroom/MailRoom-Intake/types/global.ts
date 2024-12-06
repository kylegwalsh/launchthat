// This file holds global types that are reused frequently

/**
 * The response type
 */
export interface IResponse {
  /**
   * the status code of the response
   */
  statusCode?: number;
  /**
   * the body of the response
   */
  body?: string;
}