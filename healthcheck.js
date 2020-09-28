// This file is healthcheck handler for Docker Swarm, which cannot do http healthchecks
// On kubernetes, this file isn't needed

var http = require('http');

const port = process.env.PORT || 80;

var request = http.get(`http://localhost:${port}/healthcheck`, res => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode == 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', function(err) {
  console.log('ERROR');
  process.exit(1);
});

request.end();
