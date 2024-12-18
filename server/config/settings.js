
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/';

export const mongoConfig = {
  serverUrl: MONGO_URL,
  database: 'npm_init_to_win_it'
};
