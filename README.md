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


