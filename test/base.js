var Spawner = require('../index');
var assert = require('assert');

describe('base', function() {
    it('stdout', function() {
        var spawner = Spawner();
        return spawner.spawn('echo', ['hello'], {}, {
            stdout: function(data) {
                assert.equal((data + '').trim(), 'hello');
            }
        });
    });

    it('catch', function(done) {
        var spawner = Spawner();
        var p = spawner.spawn('fakeoneeeeeeeeee');

        p.catch(function(err) {
            assert.equal(err.message, 'spawn fakeoneeeeeeeeee ENOENT');
            done();
        });
    });

    it('error', function() {
        var spawner = Spawner();
        return spawner.spawn('node', ['/Users/ddchen/Coding/opensource/cl-spawner/test/cmd1.js'], {
            cwd: __dirname
        }, {
            stderr: function(data) {
                data = data + '';
                assert.equal(data.indexOf('This is an error.') !== -1, true);
            }
        });
    });

    it('proc', function() {
        var spawner = Spawner();
        return spawner.spawn('ls', [], {}, {
            proc: function(p) {
                assert.equal(typeof p.pid, 'number');
            }
        });
    });

    it('getChilds', function(done) {
        var spawner = Spawner();
        var p1 = spawner.spawn('node', ['cmd2.js'], {
            cwd: __dirname
        });

        var p2 = spawner.spawn('node', ['cmd2.js'], {
            cwd: __dirname
        });

        assert.equal(spawner.getChilds().length , 2);

        var p3 = Promise.all([p1, p2]);
        p3.then(function () {
            assert.equal(spawner.getChilds().length , 0);
            done();
        });
    });

    it('killAll', function(done) {
        var spawner = Spawner();
        var p1 = spawner.spawn('node', ['cmd2.js'], {
            cwd: __dirname
        });

        var p2 = spawner.spawn('node', ['cmd2.js'], {
            cwd: __dirname
        });

        var childs = spawner.getChilds();

        assert.equal(childs.length , 2);

        spawner.killAll().then(function () {
            assert.equal(spawner.getChilds() , 0);
            done();
        });
    });
});