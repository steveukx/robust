
console.log('RUNNING');

var HTTP = require('http');

var server = HTTP.createServer(function(req, res) {
   res.writeHead(200, {});
   res.end('Responding to requests on ' + process.env.port);
});

//server.listen(process.env.port);

console.log(process.env.port);

setTimeout(function() {
   process.exit();
}, Math.random() * 1000);