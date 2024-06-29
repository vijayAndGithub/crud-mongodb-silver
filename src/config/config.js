const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,
  client_url: process.env.CLIENT_URL,
  mongoose: {
    db_url: process.env.MONGODB_URL,
  },
};
