const {
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
  DB_USER,
  DB_PORT
} = process.env

/**
  * @type {import('sequelize').Options}
  */
export default {
  username: DB_USER || 'postgres',
  password: DB_PASSWORD || 'postgres',
  database: DB_NAME || 'postgres',
  host: DB_HOST || '127.0.0.1',
  port: parseInt(DB_PORT ?? '', 10) || 5432,
  dialect: 'postgres',
  logging: false
}
