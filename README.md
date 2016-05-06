# Setup
After downloading the code for this repository, and installing NodeJS 5.

`npm install`

This will download the `nodus` framework libraries and allow you to get started building your miroservice.

# Running commands using the Terminal
Sometimes it can be nice to run your nodejs functions from the command line.  This can be useful for
testing, scripts, but I find it mostly valuable during the development process as I build the microservice.

The `run./sh` script file contains a simple wrapper around the `nodus-run` library that makes it
easy to call your functions and display their results from a script.

## Run the sayhello command
`./run.sh helloworld/sayhello name='Brad'`

## Async say hello after a specified delay in milliseconds
`./run.sh helloworld/sayhello_delay name='Brad' delay=1000`

# Running the Server
The `nodus-server` package is used to host your application after you have worked out all the commands that
will make up your microservice.

The only step you need to take, is to create a `server.json` definition file to instruct the server to the various
*commands* supported by your service, and the *interfaces* you would like to expose those services over.

```
{
  "services": {
    "helloworld": {
      "description": "Say hello to the user.",
      "commands": {
        "sayhello": {
          "provider": "sayhello.js",
          "description": "Issue the standard greeting for a programmer to the user.",
          "parameters": {
            "name": {
              "description": "The name of the user to greet.",
              "required": false
            }
          }
        }
      }
    }
  },
  "interfaces": {
    "rest": {
      "type": "interfaces/rest",
      "config": {
        "host": "localhost",
        "port": 3001
      }
    }
  }
```

## Starting the server
The `./server.sh` script is a wrapper around the `nodus-server` command and will start the hello world service.

Running this will start the helloworld service and you can test this by navigating to:
`http://localhost:3001/helloworld/sayhello_delay?name=Brad%20Serbu&delay=1000`


The format to call a command on a service is:
`http://<host>:<port>/<service>/<command>?arg=`
