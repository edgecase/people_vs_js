
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , _ = require('underscore')
  , ql = require('./lib/question_loader');

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
var questions = [];
questionLoader.loadAll(function(question){ questions.push(question); });

var getQuestion = function(questionNumber){
  var question = questions[questionNumber];
  question.answerPercentages = calculateAnswerPercentages();
  question.number = questionNumber;
  question.questionsCount = questions.length;
  return questions[questionNumber];
};

var currentQuestion = 0;
var currentAnswers = null;

function resetQuiz(){
  currentQuestion = 0;
  resetCurrentAnswers();
}

function resetCurrentAnswers(){
  if(currentQuestion >= 0 && currentQuestion < questions.length){
    var q = getQuestion(currentQuestion);
    currentAnswers = [];
    for(var i=0;i<q.possibleAnswers.length;i++){
      currentAnswers.push(0);
    }
  } else {
    currentAnswers = null;
  }
}

function userAnsweredAtIndex(index){
  currentAnswers[index]++;
}

function calculateAnswerPercentages(){
  var totalAnswers = _.reduce(currentAnswers, function(memo, num){ return memo + num; }, 0);
  return _.map(currentAnswers, function(answerCount){
    return Math.floor((answerCount / totalAnswers) * 100);
  });
}

// use polling since heroku does not yet support websockets
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
  var namedClients = _.map(io.sockets.sockets, function(val, key){
    return val.store.data.name;
  });

  namedClients = _.compact(namedClients).sort();
  var payload = { users: namedClients };

  socket.emit('welcome', { users: namedClients });

  socket.on("resetQuiz", function(){
    var questionToPresent = getQuestion(1);
    io.sockets.emit("presentQuestion", { question: questionToPresent });
  });

  socket.on("nextQuestion", function() {
    resetCurrentAnswers();

    if (currentQuestion + 1 == questions.length){
      io.sockets.emit("quizComplete");
    }
    else {
      currentQuestion++;
      var questionToPresent = getQuestion(currentQuestion);
      io.sockets.emit("presentQuestion", { question: questionToPresent });
    }
  });

  socket.on("prevQuestion", function() {
    resetCurrentAnswers();

    if (currentQuestion - 1 < 0) {
      return;
    }
    else {
      currentQuestion--;
      var questionToPresent = getQuestion(currentQuestion);
      io.sockets.emit("presentQuestion", { question: questionToPresent });
    }
  });

  socket.on("provideAnswer", function(data, isCorrectCallback){
    var q = getQuestion(currentQuestion);
    var isCorrect = q.correctIndex == data.myAnswer;

    userAnsweredAtIndex(data.myAnswer);
    isCorrectCallback( isCorrect );
    socket.get("name", function(err, name){
      io.sockets.emit("remoteAnswer", {
        user: name,
        answerPercentages: calculateAnswerPercentages(),
        answer: data.myAnswer,
        isCorrect: isCorrect
      });
    });
  });

  socket.on("scratchStream", function(text){
    io.sockets.emit("scratchUpdate", text);
  });

  socket.on("setName", function(data, callback){
    var existingNamedSocket = _(io.sockets.sockets).find(function(item){
      return item.store.data.name && item.store.data.name.toLowerCase() === data.name.toLowerCase();
    });

    if (existingNamedSocket){
      socket.emit("msg", {type: 'error', msg: 'A team with that name already exists, please choose another!'});
      return;
    }

    socket.set("name", data.name, function(){
      socket.broadcast.emit("otherJoined", data);
      socket.emit("selfJoined", data);

      if( currentQuestion > 0 ){
        var questionToPresent = getQuestion(currentQuestion);
        socket.emit("presentQuestion", { question: questionToPresent });
      }
    });
  });

  socket.on("disconnect", function(){
    socket.broadcast.emit("otherQuit", {name: socket.store.data.name});
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
