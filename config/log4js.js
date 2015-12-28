var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/cangbaojie.log'), 'cangbaojie');
module.exports.log4js = {
    getLogger: log4js.getLogger
};
