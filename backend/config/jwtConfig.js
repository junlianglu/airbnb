require('dotenv').config();

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default_secret_key',
  options: {
    expiresIn: '1h',  // Token expiration time
    algorithm: 'HS256'  // Algorithm used for signing the token
  }
};

module.exports = jwtConfig;
