"use strict";
var net = require('net');
var END_MSG = '__LOG4JS__';

function workerAppender(config) {
    var canWrite = false,
        buffer = [],
        socket;

    createSocket();

    function createSocket() {
        socket = net.createConnection(config.loggerPort || 5000, config.loggerHost || 'localhost');
        socket.on('connect', function() {
            emptyBuffer();
            canWrite = true;
        });
        socket.on('timeout', socket.end.bind(socket));
        //don't bother listening for 'error', 'close' gets called after that anyway
        socket.on('close', createSocket);
        socket.on('error', function(e) {
            if (e.code == 'ECONNRESET') {} else {}
        });
    }

    function emptyBuffer() {
        var evt;
        while ((evt = buffer.shift())) {
            write(evt);
        }
    }

    function write(loggingEvent) {
        // JSON.stringify(new Error('test')) returns {}, which is not really useful for us.
        // The following allows us to serialize errors correctly.
        if (loggingEvent && loggingEvent.stack && JSON.stringify(loggingEvent) === '{}') { // Validate that we really are in this case
            loggingEvent = {
                stack: loggingEvent.stack
            };
        }
        socket.write(JSON.stringify(loggingEvent), 'utf8');
        socket.write(END_MSG, 'utf8');
    }

    return function log(loggingEvent) {
        if (canWrite) {
            write(loggingEvent);
        } else {
            buffer.push(loggingEvent);
        }
    };
}

function tcpAppender(config) {
    return workerAppender(config);
}

function configure(config, options) {
    return tcpAppender(config);
}

exports.appender = tcpAppender;
exports.configure = configure;
