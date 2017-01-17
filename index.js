var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var serverKey = 'AAAAIy60C98:APA91bHusQNNlYQ6vzkm4IOFbVqkoWgvu-QsWVadhxAq9NnbmUSR_JPKua7ew2Vnls_Ayt7VCHIyX7uK6gm3CWVrexqb64ahVBBBz0Qvk0z7zngO1vq-D69A83kgBRUi2WZTODhWMBCIbcdbChUZq3w7x6rn9gcPWg'
var legacyKey = 'AIzaSyB3FBl0GRhQBo5Jtd04gbXyRRBjRdRmBIw';
var bodyParser = require('body-parser');
var gcm = require('node-gcm');
var sender = new gcm.Sender(legacyKey);
var RegToken;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended : true
}))
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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
//THis is a testing place for node js and android push notification
app.post('/push',function(request,response){
  var title = request.body.title;
  var body = request.body.body;
  var message = new gcm.Message();
  var errorMessage = { "Message" : "An Error Occured while sending"};
  var successMessage = {"Message" : "Message passing success"};
  console.log("Inside Push notification");
  message.addNotification('title',title);
  message.addNotification('body',body);
  sender.send(message,{topic : "/topics/ilisten"},function(err,response){
    if (err){
      console.error(err + "There was an error");
      response.send(JSON.stringify(errorMessage));
  }
    else{
      console.log(response + "This is the response from server");
      response.send(JSON.stringify(successMessage));
    }
  })
})
app.post('/hello', function(request, response){
  var outputJson = request.body.test;

  console.log(request.body);
  var SendToAndroid = { "NameSentFromYouIs" : outputJson}
  response.send(JSON.stringify(SendToAndroid));
  console.log(SendToAndroid);

})
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
