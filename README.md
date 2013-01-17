robust
======

Persist and pool processes for Node.js

Installation and Usage
======================

First, install robust as a global npm module:

    sudo npm install robust -g

Once installed you can now run `robust` directly from the command line to automatically start and monitor any node script.

Using robust is as simple as using the robust binary that npm has made available:

    cd /path/to/project
    robust

Configuration
=============

By default robust will attempt to read a configuration file named `robust.json` in the current working directory. To use
a configuration file with another name or path, use the command line option `-config PATH`. Robust will work equally well
without a configuration file though, so one doesn't need to be present in order to use robust.

By default, robust will run the script called `server.js`, but this can be changed by using the command line option
`-script PATH` or by adding a `script` attribute to the configuration file. The path specified should be either an
absolute path or relative to the current working directory.

Process Arguments
-----------------

The script that robust runs will be passed the command line arguments that were given to robust, to change the arguments
add an `args` attribute to the configuration JSON, or supply as many arguments as required using the `-args` command
line option. For example:

    robust -args first -args "second option"

Each instance of your script will receive the same arguments which will be available as usual as `process.argv`.

Environment Variables
---------------------

To customise the environment variables the child scripts receive, you will need to use the configuration JSON file. To
send the same environment variables to each process, create an object attribute named `defaults`. To send different
environment variables to each instance, create an array called `instances`, each item in which is a map of environment
variables to supply to child processes of that index.

For example:

    {
       "defaults": {
          "SeenByAll": 1,
          "SeenBySome": 2
       },
       "instances": [
          {
             "SeenBySome": 3
          }
       ]
    }

Using the extract above will result in all processes having an environment variable `SeenByAll` set to `1`, in the first
child instance the value of `SeenBySome` will be `3`, in all others it will be `2`.

Process Count
-------------

Robust will create at least two child processes and in an environment with multiple cores, will create as many child
processes as cores available. To explicitly set the number of processes to create, set the command line option
`-processes NUMBER` or add a `processes` attribute to the configuration file.


Working Directory
-----------------

The `robust` command can be called from anywhere, if you want to reset the current working directory, add the `-cwd` command
line option:

    cd /
    robust -cwd /path/to/project

This will affect the path that is checked for the `robust.json` and will also set where the pid file for the service is
stored.

Custom PID File
---------------

To make it easy to stop or restart existing processes, the process id of the robust managed service is stored in a dot
prefixed file in the current working directory. To set the name of the pid file, add the `-pid` option to the command line:

    robust -pid .custom-pid

Using a custom pid file name allows the same working directory to be used for multiple services all managed through robust.
*Note, the custom pid file name must be in the command line string rather than the configuration file as it is used before
the configuration file is read.*

Stopping Robust
===============

Stopping a service that is being managed by robust is just a case of adding either `--stop` to the command line string
to stop the service, or `--restart` to both stop and start the service:

    robust --restart

If the robust service was started with a custom working directory, reuse that working directory with the addtional action
in the command line, for example:

    cd /
    robust -cwd /path/to/project --stop


