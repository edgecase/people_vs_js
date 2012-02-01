
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , _ = require('underscore')
  , md = require('github-flavored-markdown')
  , everyauth = require("everyauth")
  , mongo = require("mongoskin")
  , assets = require('connect-assets');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

io.set("log level", 1);

GLOBAL.app = app;
GLOBAL.io = io;
GLOBAL._ = _;

// Database Configuration
var db = GLOBAL.db = mongo.db('localhost:27017/guideme_'+app.settings.env);

// Auth Configuration

everyauth.twitter
  .consumerKey('cEPHLnljFSM5AM5233DxLg')
  .consumerSecret('7gEXZFpOq5gdhT9m8P8XpYO3W2fMLLSy7pUYkWCs')
  .findOrCreateUser( function(session, accessToken, accessTokenSecret, twitterUserMetadata) {
    var userPromise = new everyauth.Promise();
    db.collection("users").findOne({ screen_name: twitterUserMetadata.screen_name }, function(err, doc){
      if(err) return userPromise.fail(err);
      if(doc) { return userPromise.fulfill(doc); }

      db.collection("users").insert(_.extend(twitterUserMetadata, { "lessonPlans": [] }),
                                    {},
                                    function(err, userDoc){
        if(err) console.log(err);
        return userPromise.fulfill(userDoc);
      });
    });
    return userPromise;
  })
  .redirectPath('/authorized');

  everyauth.everymodule.findUserById( function(userId, callback) {
    db.collection("users").findOne({ id: userId }, function(err, doc){
      if(callback) callback(err, doc);
    });
  });

// Express Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "UseThFor$eLuke" }));
  app.use( everyauth.middleware() );
  app.use(app.router);
  app.use(assets());
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var authorizeUser = function(req, res, next){
  if(req.loggedIn){ next(); }
  else res.redirect("/auth/twitter");
};

// auth routes
app.get('/users/:name', authorizeUser , routes.dashboard);
app.get('/users/:name/plans/:slug', authorizeUser , routes.showPlan);
app.post('/users/:name/plans/:slug?', authorizeUser , routes.createPlan);
app.put('/users/:name/plans/:slug?', authorizeUser , routes.updatePlan);
app.del('/users/:name/plans/:slug?', authorizeUser , routes.deletePlan);

app.post('/users/:name/plans/:slug/questions', authorizeUser , routes.createQuestion);
app.put('/users/:name/plans/:slug/questions', authorizeUser , routes.updateQuestion);
app.del('/users/:name/plans/:slug/questions', authorizeUser , routes.deleteQuestion);

app.get('/authorized', authorizeUser, function(req, res){
  res.redirect("/users/"+req.user.screen_name);
});

// open routes
app.get('/:slug/presenter', authorizeUser, routes.presentPlan);
app.get('/:slug', routes.presentPlan);

/* app.get('/', routes.introduction); */
app.get('/', function(req, res) { res.redirect('/users/rubybuddha'); } );

everyauth.helpExpress(app);



// App Stuff
// **********************************
//

var currentQuestion = -1;

var _namedClients = {};

var getQuestion = function(questionNumber){
  var question = questions[questionNumber];
  question.questionsCount = questions.length;

  question.possibleAnswers =  _(question.possibleAnswers).map(function(answer, idx){

    if(answer.timesChosen > 0){
      answer.percentageChosen = Math.floor(100 * (answer.timesChosen / question.timesAnswered));
    } else {
      answer.percentageChosen = 0;
    }

    return answer;
  });

  return question;
};

function resetCurrentAnswers(){
  questions[currentQuestion].timesAnswered = 0;
  _.map(questions[currentQuestion].possibleAnswers, function(answer, idx) {
    answer.timesChosen = 0;
  });
}

function resetQuiz(){
  currentQuestion = 0;
  resetCurrentAnswers();
}

function participantAnsweredAtIndex(index){
  questions[currentQuestion].timesAnswered++;
  questions[currentQuestion].possibleAnswers[index].timesChosen++;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function namedClients(){
  var namedClients = _.chain(_namedClients)
                      .map(function(val, key){
                          return val;
                      })
                      .sortBy(function(participant){
                        return participant.name;
                      })
                      .value();

  return namedClients;
}

function isMessageForMe(participantName, message){
  var participantRegex = new RegExp("(?:^|\\s|\\W)(@" + participantName + ")(?:$|\\s|\\W)", "gi");
  return participantRegex.test(message);
}

// use polling since heroku does not yet support websockets
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {

  socket.emit('participant-welcome', { participants: namedClients() });

  socket.on("question-reset", function(){
    resetQuiz();
    io.sockets.emit("question-changed", getQuestion(currentQuestion));
    io.sockets.emit("participant-answerstatus", { participants: namedClients() });
  });

  socket.on("question-next", function() {
    if (currentQuestion + 1 == questions.length){
      io.sockets.emit("quiz-complete");
    }
    else {
      currentQuestion++;
      resetCurrentAnswers();
      io.sockets.emit("question-changed", getQuestion(currentQuestion));
      io.sockets.emit("participant-answerstatus", { participants: namedClients() });
    }
  });

  socket.on("question-prev", function() {
    resetCurrentAnswers();

    if (currentQuestion - 1 < 0) {
      io.sockets.emit("participant-answerstatus", { participants: namedClients() });
    }
    else {
      currentQuestion--;
      resetCurrentAnswers();
      io.sockets.emit("question-changed", getQuestion(currentQuestion));
      io.sockets.emit("participant-answerstatus", { participants: namedClients() });
    }
  });

  socket.on("answer-submitted", function(data, isCorrectCallback){
    participantAnsweredAtIndex(data.answerIndex);

    var q = getQuestion(currentQuestion);
    var isCorrect = q.correctIndex == data.answerIndex;
    _namedClients[socket.id].answerStatus = isCorrect ? "correct" : "incorrect";

    isCorrectCallback( {correctIndex: q.correctIndex} );

    io.sockets.emit("answer-percentages", { possibleAnswers: q.possibleAnswers });
    io.sockets.emit("participant-answerstatus", { participants: namedClients() });
  });

  socket.on("message-send", function(message){
    var markedup = md.parse(message.text);
    var name = _namedClients[socket.id].name;

    io.sockets.emit("message-new", { participant: name || 'Anonymous',
                                     text: markedup,
                                     isForMe: isMessageForMe(name, message.text)});
  });

  socket.on("participant-join", function(data, callback){
    var existingNamedSocket = _(_namedClients).any(function(val, key){
      return val.name.toLowerCase() === data.name.toLowerCase();
    });

    if (existingNamedSocket){
      socket.emit("flash-new", {type: 'error', msg: 'A team with that name already exists, please choose another!'});
      callback({success:false});
      return;
    }

    if(/[^\w]/.test(data.name)){
      socket.emit("flash-new", { type: "error", msg: "Names can only contain alphanumerics and underscores!" } );
      callback({success:false});
      return;
    }

    _namedClients[socket.id] = _namedClients[socket.id] || {name: data.name, answerStatus: 'unanswered'};
    io.sockets.emit("participant-new", {participants: namedClients()} );

    if( currentQuestion >= 0 ){
      socket.emit("question-changed", getQuestion(currentQuestion));
    };

    callback({success:true});
  });

  socket.on("disconnect", function(){
    if(_namedClients[socket.id]){
      var name = _namedClients[socket.id].name;
      delete _namedClients[socket.id];
      socket.broadcast.emit("participant-disconnected", {participants: namedClients()});
    }
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
