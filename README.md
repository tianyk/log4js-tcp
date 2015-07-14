# log4js-tcp

log4js tcp appender.

## Demo

    var log4js = require('log4js');
    log4js.loadAppender('log4j-tcp');

    log4js.configure({
        appenders: [{
            type: 'log4j-tcp',
            loggerPort: 33333,
            loggerHost: "127.0.0.1",
            category: 'cheese',
        }]
    });

    var logger = log4js.getLogger('cheese');
    logger.setLevel('ERROR');

    logger.trace('Entering cheese testing');
    logger.debug('Got cheese.');
    logger.info('Cheese is Gouda.');
    logger.warn('Cheese is quite smelly.');
    logger.error('Cheese is too ripe!');
    logger.fatal('Cheese was breeding ground for listeria.');