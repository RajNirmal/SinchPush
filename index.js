var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var FCM = require('fcm-node');
var serverKey = 'AAAAIy60C98:APA91bHusQNNlYQ6vzkm4IOFbVqkoWgvu-QsWVadhxAq9NnbmUSR_JPKua7ew2Vnls_Ayt7VCHIyX7uK6gm3CWVrexqb64ahVBBBz0Qvk0z7zngO1vq-D69A83kgBRUi2WZTODhWMBCIbcdbChUZq3w7x6rn9gcPWg'
var fcm = new FCM('serverKey');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.get('/push',function(req,res){
  var title = req.params.title;
  var body = req.params.body;
//  var confName = req.params.name;
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //  to: 'registration_token',
    //  collapse_key: 'your_collapse_key',

      notification: {
          title: title,
          body: body
      },

      data: {  //you can send only notification or only data(or include both)
          my_key: title
      }
  };
  fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
})
app.get('/', function(request, response) {
  response.render('pages/index');
});
app.get('/cool',function(request , response){
  response.send(cool());
})
app.get('/times',function(request, response){
  var result = '';
  var times = process.env.TIMES || 5;
  for(i=0; i < times; i++ )
    result += i + ' ';
  response.send(result);
})
app.get('/hello', function(request, response){
  var outputJson = request.params.test;
  //var myJson = {'Value':outputJson};
  //var StringedJson = "{name : "+ outputJson +"}";
  //response.send(JSON.stringify(StringedJson));
  //response.JSON(StringedJson)
//  var myJson = "{'Sent from' : "+ outputJson +"}" ;
  response.send(JSON.stringify(outputJson));
  console.log(outputJson);
  //console.log(outputJson);
})
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
