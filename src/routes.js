
var express = require("express"),
    router = express.Router();
var path = require('path');
const requestAPI = require('request');
console.log('Getting Routes Ready!');
var config = require("../config");

router.get('/', function(req, res) {
    console.log("Root page hit!")
    res.sendFile(path.join(__dirname + '/../index.html'));
});

router.get('/chat', function(req, res) {
    console.log("Test page hit!")
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

router.post("/webhook",async (req,res)=>{

    var options = { method: 'POST',
      url: config.configuration.chatserver,
      qs: { v: '20150910' },
      headers:
       { 'cache-control': 'no-cache',
         charset: 'utf-8',
         'Content-Type': 'application/json',
         Authorization: 'Bearer ' + config.configuration.clientAccessToken
        },
      body:
       { lang: 'en',
         query: req.body.query,
         sessionId: 'session',
         timezone: 'America/New_York' },
      json: true };

    await requestAPI(options, function (error, response, body) {
      if(!error){
        console.log(JSON.stringify(body))
        res.send(body)
      }
    });

  });



module.exports = router;