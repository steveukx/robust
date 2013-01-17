
var Commands = require('commands'),
    RobustCluster = require('./robust/robustcluster'),
    ConfigurationFactory = require('./robust/configurationfactory'),
    Logger = require('./robust/logger'),

    configurationFactory = new ConfigurationFactory(Commands.get('config')),
    logger = new Logger(configurationFactory.getOption('log', configurationFactory.getOption('verbose', false))),

    robustCluster = new RobustCluster(configurationFactory, logger).start();

