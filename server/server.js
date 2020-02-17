'use strict';

const express = require('express');
const morgan = require('morgan');
const logger = require('winston');
const SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-tools/middleware/swagger-ui');
const { name } = require('./../package');
const { combine, timestamp, label, colorize, printf } = logger.format;

logger.add(new logger.transports.Console({
  format: combine(
    label({ label: name }),
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    printf(info => `${info.timestamp} - [${info.label}] ${info.level}: ${info.message}`)
  )
}));

const app = express();

const config = {
  appRoot: `${__dirname}/..`
};

app.use(
  morgan('short', {
    stream: {
      write: str => {
        logger.info(str.slice(0, -1));
      }
    }
  })
);

app.use((req, res, next) => {
  if (req.headers['content-length'] === '0' && req.headers['content-type'] == null) {
    req.headers['content-type'] = 'application/json';
  }
  next();
});

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  app.use(swaggerUi(swaggerExpress.runner.swagger));
  app.get('/', (req, res) => res.redirect('/docs'));
  swaggerExpress.register(app);

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    logger.info(`${name} started on port ${port}`);
    app.emit('appStarted');
  });
});
module.exports = app;
