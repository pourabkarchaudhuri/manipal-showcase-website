
var express = require("express"),
    router = express.Router();
var path = require('path');
const requestAPI = require('request');
console.log('Getting Routes Ready!');
var config = require("../config");

const googleAuth = require('google-oauth-jwt');
var accessToken = "";
 
generateAccessToken()
.then(res => console.log(res))
 

router.get('/', function(req, res) {
    console.log("Root page hit!")
    res.sendFile(path.join(__dirname + '/../index.html'));
});

router.get('/chat', function(req, res) {
    console.log("Test page hit!")
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

// router.post("/webhook",async (req,res)=>{

//     var options = { method: 'POST',
//       url: 'https://api.dialogflow.com/v1/query',
//       qs: { v: '20150910' },
//       headers:
//        { 'cache-control': 'no-cache',
//          charset: 'utf-8',
//          'Content-Type': 'application/json',
//          Authorization: 'Bearer 080646f1ae5a47cd8fe02d62c43fc3c7'
//         },
//       body:
//        { lang: 'en',
//          query: req.body.query,
//          sessionId: 'session',
//          timezone: 'America/New_York' },
//       json: true };

//     await requestAPI(options, function (error, response, body) {
//       if(!error){
//         console.log(JSON.stringify(body))
//         res.send(body)
//       }
//     });

//   });


 
  router.post("/webhook", async (req, res) => {
  console.log("API called")
  dialogflowApi(accessToken, req)
  .then(body => {
    console.log(JSON.stringify(body));

    var result = body.queryResult.fulfillmentMessages;
    var payload;
    console.log("Result obtained : ", JSON.stringify(result));
    result.forEach(element => {
      if(element.platform == "FACEBOOK"){
        console.log("FACEBOOK EXISTS")
        if(element.hasOwnProperty('text')){
          console.log("Basic Text");
          var text = element.text.text[0];
          payload = {"result" : {
            "fulfillment":{
                "messages": [{
                    "type": 0,
                    "platform": "facebook",
                    "speech": text
                    }
                ]
              }
            }        
          }
          console.log("Output Payload : ", JSON.stringify(payload));
          res.send(payload);
        }
        else if(element.hasOwnProperty('quickReplies')){
          var quickReplyPayload = [];
          console.log("Quick Replies");
          var quickReplyMessage = element.quickReplies.title;
          for (var i = 0; i < element.quickReplies.quickReplies.length; i++){
            quickReplyPayload.push({
              content_type: "text",
              title: element.quickReplies.quickReplies[i],
              payload: element.quickReplies.quickReplies[i]
            })
          }
          var payload = { "result" : {

                  "fulfillment":{
                      "speech": "",
                      "displayText": "",
                      "messages": [{
                          "type": 4,
                          "platform": "facebook",
                          "payload": {
                              "facebook": {
                                  "text": quickReplyMessage,
                                  "quick_replies": quickReplyPayload
                              }
                          }
                      }]
                  }
              }
          }
          
          res.send(payload);
        }
        else if(element.hasOwnProperty('card')){
          console.log("Basic Card");

          var buttons = [];
          
          for(var i = 0; i < element.card.buttons.length; i++){
            buttons.push({
              text: element.card.buttons[i].text,
              postback: element.card.buttons[i].postback
            })
          }

          var payload = {
              "result" : {
                "fulfillment":{ 
                  "speech":"",
                  "messages":[ 
                     { 
                        "platform":"facebook",
                        "imageUrl":element.card.imageUri,
                        "subtitle":element.card.subtitle,
                        "title":element.card.title,
                        "buttons":buttons,
                        "lang":"en",
                        "type":1
                     }
                  ]
               }
              }
            }
            
          res.send(payload)
            
          

        }
        else{
          console.log("Unknown Payload");
          // var payload = {
          //   "result" : {
          //     "fulfillment":{ 
          //       "speech":"",
          //       "messages":[ 
          //          { 
          //             "platform":"facebook",
          //             "imageUrl":"http://golem13.fr/wp-content/uploads/2019/01/imma-virtuelle-mannequin.jpg",
          //             "subtitle":"This is where the card subtitle will come as a small description over the use case",
          //             "title":"Card Title Goes Here",
          //             "buttons":[ 
          //                { 
          //                   "postback":"hi",
          //                   "text":"Button One"
          //                },
          //                { 
          //                   "postback":"thanks",
          //                   "text":"Button Two"
          //                },
          //                { 
          //                   "postback":"quick replies",
          //                   "text":"Button Three"
          //                }
          //             ],
          //             "lang":"en",
          //             "type":1
          //          }
          //       ]
          //    }
          //   }
          // }
          

          res.send(body);
        }
      }
      else if(result.length == 1){
        console.log("FACEBOOK Absent, small talk : ", result);
        var text = result[0].text.text[0];
        console.log("Small talk text : ", text)
        payload = {"result" : {
          "fulfillment":{
              "messages": [{
                  "type": 0,
                  "platform": "facebook",
                  "speech": text
                  }
              ]
            }
          }        
        }
        console.log("Output Smalltall Payload : ", JSON.stringify(payload));
        res.send(payload);
        
      }
    });
  
    });
    
  });
   
  var dialogflowApi = (accessToken, req) => {
  var options = {
      method: 'POST',
      url: 'https://dialogflow.googleapis.com/v2/projects/manipal-usnxhe/agent/sessions/fb2e77d.47a0479900504cb3ab4a1f626d:detectIntent',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
      },
      body: { queryInput: { text: { text: req.body.query, languageCode: 'en-US' } } },
      json: true
  };
   
  return new Promise (async (resolve) => {
      await requestAPI(options, function (error, response, body) {
          if (!error) {
              if (body.hasOwnProperty("error")) {
                  // Generate token
                  generateAccessToken()
                  .then(token => {
                      dialogflowApi(token, req)
                  })
              }
              
              resolve(body);
          }
      });
  })
  }
   
  function generateAccessToken() {
   return new Promise((resolve) => {
    googleAuth.authenticate(
     {
      email: "dialogflow-rogwrf@manipal-usnxhe.iam.gserviceaccount.com",
      key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDsW2AU+CzV2mGK\ntimpBj38A9hfZ08+Qr7NMVDZBEi6rhVc4M5/aYqHp+FZygXldqkw5IA1ssw/QYjy\nSQwn6PsXCc6c+lasKE8uKSmkpX2fHYBQv0L4+rvZlVtSYDnO5crNMzx9jiLeVEp9\n5J4DSA1VC8zxZW+01jxdqi4p7DkPaGK6sVtNlPjX26OZ4H6jZ2ZZn2RKH8hDA+o6\ngdHhRZD3PDTe/KDTDe67h72KOHBpuJqcs+9NTdiuzoZtPcxtb9K30y+XzHARDWcY\nP/cCaqclnrXsVNi28DrQPGNTc5GBYIs3uSc01/KXOHxK9eDUEqORZWx4xTytlkRT\nKl2G1/E1AgMBAAECggEAGP13TPhJe0n19r3YbUne62K3sayhZQaXGGhusSdiDjTi\nRtnxE2kkD8BJFB6HXZHchTIfuS3AqS6DbYSaL60TQUYU7aWNXPH9HzcUc1dZDyYG\nH2N9kAgorPJ8/5pzekPzG5ufeXH6D1JPtvxhVZz8ZeHTxzEvrKnbI5ce/uk+RjnR\n89oYyTFdAjWXfYGK0vnUWDabkYXvKm8+WZFbpcM5LA60LWb8Cic1wSImdojsLQn4\nym45S/gIIBNTfOFIiTa+3lQDpkES+K6GNYRpv0fJ/nkNxf70cY1FYlDlQJ1AemNA\nCrd3jt0h1RaSCmJvtJL9IK5ph7PM9cUceJxCbp4GYQKBgQD4DWYZVxz5de/qJlOj\nzIycDuuM75aLvQ4daEdTHqKCnXxT3iGYdiPVPqnt1GJGK9YWStOT2/SKISfmYuRe\nzshfEqITU49l/blzGdY6k8gcj3TuhE/MbZVJIdjLjsJOFRGhtj7fbL+YmzptMPs6\nPxWIPHos5NaGiddeGRD00a0mVQKBgQDz7gwWDWftqi5iTdslsFfdRUhZW5IIE2EM\ntwxCjeJtl94cDkUTYsnn0jsjwx9aqymFm3XymsxNrAMYgooRtdhWAOlmvMf7BS/9\nyFu0qqaFcQqGE6gwe6XQrVEI5vx/hJdO4jVI9fuZ5mbZJ4npBISajeCN4y915jFm\no5Yypxe/YQKBgD2p9wutoEJTk0S+KmS54OqauuvaU66BXRTqa3C6WOPnipS+z9M6\n60WDwnKhLZ0MILiB+X70WyJLg8O+Kc930E/yLeBoEWnlXUjDz4HYYxLWhtcUhVHo\nnAgGJgLUhnEqw6tTxuV7/1VMoYWre4jLTesEPcsTSFFBywxVZuW1ijnRAoGALeR5\nbaS0CujbtS8ErgCRZ1XjmLw7qz1KIwRFUDg1g3zxEsI0iMMrTWwmKEJLodlWBIcN\nF8m76lkUdAYLR+24d+XQA748uaNuNgb+Ce2ZSr3LxxHnsMdymOIivtQGaU9e0D6K\n2+E7pubMLsrbjXWGJTXQK6G0ii/212KrnXgGZcECgYEAjNulRTByXb6Fq1NNfl3+\niECqgeqGcKvDMStzkuWsr+5FPV/gdaTsjx6+n1TeYWRR0RjGw2KgUlbFZS3nxhST\nhHp4dJZ4FuEeCrUnyl0pe/fzsacoxAJOpzHVZqzN+3EZIeSwmqWiqNQvjrnueTdL\nR8e3442MQT0E6pm9rJTJj6Q=\n-----END PRIVATE KEY-----\n",
  
      scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/dialogflow'],
     },
     (err, token) => {
      accessToken = token;
      resolve(token);
     },
    );
   });
  }
  


module.exports = router;