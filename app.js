const express = require('express');
const config = require('./config/config');
const setup = require('./config/setup');

const app = express();
setup(app, config);

module.exports = app;