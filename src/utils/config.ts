const {
  NODE_ENV,
  SESSION_SECRET = 'default_secret',
  DB_HOST = 'localhost',
  DB_PORT = '27017',
  DB_USER = 'warbike',
  DB_PASSWORD = 'password',
  DB_NAME = 'warbike',
  MONGODB_URI = 'mongodb://localhost:27017/warbike'
} = process.env

export const config = {
  env: NODE_ENV || 'development',
  sessionSecret: SESSION_SECRET,
  db: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    name: DB_NAME
  },
  mongodbUri: MONGODB_URI
}
