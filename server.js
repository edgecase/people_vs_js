
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , _ = require('underscore')
  , ql = require('./lib/question_loader')
  , md = require('github-flavored-markdown')
  , assets = require('connect-assets');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

GLOBAL.app = app;
GLOBAL.io = io;
GLOBAL._ = _;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
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

app.get('/', routes.introduction);
app.get('/presenter',
        express.basicAuth("presenter", "esacegde"),
        routes.presenter);

var questionLoader = new ql.QuestionLoader();
var questions = questionLoader.loadAll();
console.log(questions);

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

function userAnsweredAtIndex(index){
  questions[currentQuestion].timesAnswered++;
  questions[currentQuestion].possibleAnswers[index].timesChosen++;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function namedClients(){
  console.log("_namedClients: " + JSON.stringify(_namedClients));
  var namedClients = _.chain(_namedClients)
                      .map(function(val, key){
                          return val;
                      })
                      .sortBy(function(user){
                        return user.name;
                      })
                      .value();

  return namedClients;
}

function isMessageForMe(userName, message){
  var userRegex = new RegExp("(?:^|\\s|\\W)(@" + userName + ")(?:$|\\s|\\W)", "gi");
  return userRegex.test(message);
}

// use polling since heroku does not yet support websockets
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {

  socket.emit('user-welcome', { users: namedClients() });

  socket.on("question-reset", function(){
    resetQuiz();
    io.sockets.emit("question-changed", getQuestion(currentQuestion));
    io.sockets.emit("user-answerstatus", { users: namedClients() });
  });

  socket.on("question-next", function() {
    if (currentQuestion + 1 == questions.length){
      io.sockets.emit("quiz-complete");
    }
    else {
      currentQuestion++;
      resetCurrentAnswers();
      io.sockets.emit("question-changed", getQuestion(currentQuestion));
      io.sockets.emit("user-answerstatus", { users: namedClients() });
    }
  });

  socket.on("question-prev", function() {
    resetCurrentAnswers();

    if (currentQuestion - 1 < 0) {
      io.sockets.emit("user-answerstatus", { users: namedClients() });
    }
    else {
      currentQuestion--;
      resetCurrentAnswers();
      io.sockets.emit("question-changed", getQuestion(currentQuestion));
      io.sockets.emit("user-answerstatus", { users: namedClients() });
    }
  });

  socket.on("answer-submitted", function(data, isCorrectCallback){
    userAnsweredAtIndex(data.answerIndex);

    var q = getQuestion(currentQuestion);
    var isCorrect = q.correctIndex == data.answerIndex;

    isCorrectCallback( {correctIndex: q.correctIndex} );
    _namedClients[socket.id].answerStatus = isCorrect ? "correct" : "incorrect";

    io.sockets.emit("answer-percentages", { possibleAnswers: q.possibleAnswers });
    io.sockets.emit("user-answerstatus", { users: namedClients() });
  });

  socket.on("message-send", function(message){
    var markedup = md.parse(message.text);

    io.sockets.emit("message-new", { user: socket.store.data.name || 'Anonymous',
                                     text: markedup,
                                     isForMe: isMessageForMe(socket.store.data.name, message.text)});
  });

  socket.on("user-join", function(data, callback){
    var existingNamedSocket = _(_namedClients).any(function(val, key){
      return val.name.toLowerCase() === data.name.toLowerCase();
    });

    if (existingNamedSocket){
      socket.emit("msg", {type: 'error', msg: 'A team with that name already exists, please choose another!'});
      return;
    }

    _namedClients[socket.id] = _namedClients[socket.id] || {name: data.name, answerStatus: 'unanswered'};
    io.sockets.emit("user-new", {users: namedClients()} );

    if( currentQuestion >= 0 ){
      socket.emit("question-changed", getQuestion(currentQuestion));
    };

  });

  socket.on("disconnect", function(){
    if(_namedClients[socket.id]){
      var name = _namedClients[socket.id].name;
      delete _namedClients[socket.id];
      socket.broadcast.emit("user-disconnected", {users: namedClients()});
    }
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
