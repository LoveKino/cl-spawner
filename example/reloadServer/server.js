var http = require('http');

var server = http.createServer(function (req, res) {
    res.writeHeaders(200, {});

    res.end();
});

server.listen(7000, function() {
    console.log('server listen at ' + server.address().port);
});