var child_process = require('child_process');
var EventEmitter = require('events');

var cloneList = function (list) {
    return list.map(function (cur) {
        return cur;
    });
}

module.exports = function() {
    var childs = [];

    var eventCenter = new EventEmitter();

    var spawn = function(cmd, params, cmdOpts, options) {
        cmdOpts = cmdOpts || {};
        params = params || [];
        options = options || {};
        var p = child_process.spawn(cmd, params, cmdOpts);

        childs.push(p.pid);

        p.stdout && p.stdout.on('data', function(data) {
            options.stdout && options.stdout(data);
        });

        p.stderr && p.stderr.on('data', function(data) {
            options.stderr && options.stderr(data);
        });

        options.proc && options.proc(p);

        var remove = function() {
            childs = childs.reduce(function(prev, child) {
                if (child !== p.pid) {
                    prev.push(child);
                }
                return prev;
            }, []);
            if (childs.length === 0) {
                eventCenter.emit('allClosed');
            }
        };

        return new Promise(function(resolve, reject) {
            p.on('error', function(err) {
                remove();
                reject(err);
            });
            p.on('close', function() {
                remove();
                resolve();
            });
        });
    };

    var killAll = function() {
        if (childs.length === 0) {
            return Promise.resolve();
        }

        childs.forEach(function(pid) {
            process.kill(pid);
        });

        return new Promise(function(resolve) {
            eventCenter.once('allClosed', function() {
                resolve();
            });
        });
    };

    var getChilds = function () {
        return cloneList(childs);
    }

    return {
        spawn: spawn,
        killAll: killAll,
        getChilds: getChilds
    };
};