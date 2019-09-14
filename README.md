# Conversational Web Widget
##### A homegrown web widget with parsers to Dialogflow v2 API

## Inspiration
This project is greatly inspired from the facebook messenger UI templates and built to extend possibilities of integrating chatbots to websites with customization options.

## Workflow
The widget calls the backend server fulfillment endpoint where the NLP and ML models kick in.

### Technology

Oversight uses a number of open source projects to work properly:

* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [Gulp] - the streaming build system
* [jQuery] - duh

### Installation

This dashboard requires a minimum of nodejsv8.11+ to run.

Install the dependencies and devDependencies and start the server.

Update webhook endpoint in `/config.js`

### For Local on Windows/MacOS/Linux:
```sh
$ git clone https://github.com/pourabkarchaudhuri/conversational-widget.git
$ cd supervised-data-tagger-dashboard
$ npm install
$ node webhook.js
```

### For EC2 on AWS:
For EC2 Configuration, Use AMI : Amazon Linux II :

```sh
$ sudo yum update
$ sudo yum install git
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
$ . ~/.nvm/nvm.sh
$ nvm install 8.11.0

```
For Dashboard Application Startup, clone this repo and follow the steps below :

```sh

$ npm install
$ cd dist/
$ forever start -a -o ./out.log -e ./err.log --uid 'widget' webhook.js
```
To Kill Application Startup or if PORT 3000 in USE, follow the steps below :

```sh
$ forever stop widget
```

### Todos

 - Optimize Further to increase speed
 - Implement Docker and Jenkins based deployment

License
----

Public


   [Node.JS]: <https://nodejs.org/en/>
   [Python]: <https://www.python.org/>
[node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
   [Gulp]: <http://gulpjs.com>

  
