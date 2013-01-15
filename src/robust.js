
var Commands = require('commands'),
    RobustCluster = require('./robust/robustcluster');
    ConfigurationFactory = require('./robust/configurationfactory');

new RobustCluster(new ConfigurationFactory(Commands.get('config'))).start();

