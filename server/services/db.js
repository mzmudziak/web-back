const Cloudant = require('@cloudant/cloudant');
const cfenv = require('cfenv');

const {
  services: {
    cloudantNoSQLDB
  }
} = cfenv.getAppEnv();

const logger = require('winston');

const url = cloudantNoSQLDB[0].credentials.url;

logger.info(`db initialized for account ${url}`);

const cloudant = Cloudant(url).use('posts');

module.exports = cloudant;
