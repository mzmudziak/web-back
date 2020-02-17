/* eslint-disable object-curly-newline */

'use strict';

const HttpStatus = require('http-status');
const db = require('../../server/services/db');
const logger = require('winston');

async function findAll(req, res) {
  db
    .list({ include_docs: true })
    .then(async ({ rows }) => {
      return res
        .status(HttpStatus.OK)
        .json(rows.map(({ doc }) => doc));
    })
    .catch(e => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e });
    });
}

async function add(req, res) {
  const post = req.swagger.params.post.value;
  db
    .insert(post)
    .then(async response => {
      logger.info(`inserted document ${JSON.stringify(post)}`);
      return res
        .status(HttpStatus.OK)
        .json(response);
    })
    .catch(e => {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e });
    });
}

module.exports = {
  findAll,
  add
};
