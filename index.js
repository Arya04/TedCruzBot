var http, router, director, server, port, body, bot, botID, Filter;

Filter      = require('bad-words');
request     = require('request');
http        = require('http');
director    = require('director');
body        = [];
bot         = require('./bot.js');
botName     = "ted";

router = new director.http.Router({
  '/' : {
    post: parseBody
  }
});

server = http.createServer(function (req, res) {
  req.on('data', function (chunk) {
    body.push(chunk.toString());
    parseBody();
  });
});

function parseBody() {
  var message = JSON.parse(body[body.length - 1]).text.toString();
  var sender = JSON.parse(body[body.length - 1]).name.toString();
  var messageId = JSON.parse(body[body.length - 1]).id;
  var customFilter = new Filter({ placeHolder: '*'});
  var cleanMessage = customFilter.clean(message);
  if (bot.includes(cleanMessage,"*") && sender.toLowerCase() != "ted cruz"){
      bot.sendMessage(cleanMessage,"");
  }
  if (message.toLowerCase().indexOf(botName) !== -1){
    console.log(botName + " was mentioned");
    if (sender.toLowerCase() != "ted cruz"){
      if (bot.includes(sender.toLowerCase(),"bryan")){
        sender = "Uncle B";
      }
      bot.determineResponse(message,sender,messageId);
    }
    else{
      console.log("Sender is Ted Cruz");
    }
  }
  else{

    console.log(botName + " was not mentioned");
  }
}

port = Number(process.env.PORT || 5000);
server.listen(port);
