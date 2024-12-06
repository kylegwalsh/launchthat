import * as connect from 'knex';

/**
 * The options required to create a db connection
 */
interface IDBOptions {
  /**
   * the client you would like to use to connect to the database (external node module)
   */
  client: 'mysql2' | 'pg' | 'sqlite3' | 'mysql' | 'oracle' | 'mssql';
  /**
   * the database version (optional)
   */
  version?: string;
  /**
   * the host URL of the database
   */
  host: string;
  /**
   * the user for authentication
   */
  user: string;
  /**
   * the password for authentication
   */
  password: string;
  /**
   * the name of the database to connect to
   */
  database: string;
}

/**
 * Function to return a knex connection to the given database
 * @param options - the options to provide (should retrieve these from AWS SSM in your config)
 */
const getDB = (options: IDBOptions) => {
  return connect({
    client: options.client,
    version: options.version,
    connection: {
      host : options.host,
      user : options.user,
      password : options.password,
      database : options.database
    }
  });
};

// Export our DB object
export { getDB };