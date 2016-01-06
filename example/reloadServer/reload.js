var Spawner = require('../../lib/spawner');

var spawner = Spawner();

var startServer = function () {
    return spawner.spawn('node', ['./server.js'], {
        cwd: __dirname,
        stdio: 'inherit'
    });
}

var reload = function () {
    spawner.killAll().then(function() {
        return startServer();
    });
}

setTimeout(reload, 0);

setTimeout(reload, 100);

setTimeout(reload, 200);