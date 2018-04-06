'use strict';
require('dotenv').config()

var superstatic = require('./node_modules/superstatic/lib/server');

var spec = {
  port: process.env.PORT || 8080,
  config: './superstatic.json',
  cwd: __dirname,
  // errorPage: __dirname + '/error.html',
  gzip: true,
  debug: true,
  env: {
    apiUrl: process.env.API_BASE_URL,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  }
};

var app = superstatic(spec);
app.listen(function(err) {
  if (err) { console.log(err); }
  console.log('Superstatic now serving on port 8080 ...');
});
