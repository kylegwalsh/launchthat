import mysql from 'mysql2/promise';

// Functions relating to DB
const db = {
  connect: (options) => {
    return mysql.createConnection({
      host: options.host,
      user: options.user,
      password: options.password,
      database: options.database,
    });
  },
};

// Export our DB object
export { db };
