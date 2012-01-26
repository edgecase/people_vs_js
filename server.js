
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

var getQuestion = function(questionNumber){
  var question = questions[questionNumber];
  question.questionsCount = questions.length;
  question = JSON.stringify(question);
  question = JSON.parse(question);

  question.possibleAnswers =  _(question.possibleAnswers).map(function(answer, idx){
    if (currentAnswers){
      return {value: answer, percentageChosen: currentAnswers[idx]};
    }
    else
      return answer;
  });

  return question;
};

var currentQuestion = -1;
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

function namedClients(){
  var namedClients = _.chain(io.sockets.sockets)
                      .map(function(val, key){
                          return {name: val.store.data.name, answerStatus: 'unanswered'};
                      })
                      .filter(function(user){
                        return user.name;
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
    var questionToPresent = getQuestion(0);
    io.sockets.emit("question-changed", questionToPresent );
  });

  socket.on("question-next", function() {
    if (currentQuestion + 1 == questions.length){
      io.sockets.emit("quiz-complete");
    }
    else {
      currentQuestion++;
      resetCurrentAnswers();
      var questionToPresent = getQuestion(currentQuestion);
      io.sockets.emit("question-changed", questionToPresent );
    }
  });

  socket.on("question-prev", function() {
    resetCurrentAnswers();

    if (currentQuestion - 1 < 0) {
      return;
    }
    else {
      currentQuestion--;
      resetCurrentAnswers();
      var questionToPresent = getQuestion(currentQuestion);
      io.sockets.emit("question-changed", questionToPresent );
    }
  });

  socket.on("answer-submitted", function(data, isCorrectCallback){
    var q = getQuestion(currentQuestion);
    var isCorrect = q.correctIndex == data.answerIndex;

    userAnsweredAtIndex(data.answerIndex);
    isCorrectCallback( {correctIndex: q.correctIndex} );

    socket.get("name", function(err, name){
      io.sockets.emit("user-answered", {
        possibleAnswers: q.possibleAnswers,
        users: namedClients()
      });
    });
  });

  socket.on("message-send", function(message){
    var markedup = md.parse(message.text);

    io.sockets.emit("message-new", { user: socket.store.data.name || 'Anonymous',
                                     text: markedup,
                                     isForMe: isMessageForMe(socket.store.data.name, message.text)});
  });

  socket.on("user-join", function(data, callback){
    var existingNamedSocket = _(namedClients).any(function(name){
      return name.toLowerCase() === data.name.toLowerCase();
    });

    if (existingNamedSocket){
      socket.emit("msg", {type: 'error', msg: 'A team with that name already exists, please choose another!'});
      return;
    }

    socket.set("name", data.name, function(){
      socket.emit("user-new", {users: namedClients()} );

      if( currentQuestion > 0 ){
        var questionToPresent = getQuestion(currentQuestion);
        socket.emit("question-changed", { question: questionToPresent });
      }
    });
  });

  socket.on("disconnect", function(){
    var name = socket.store.data.name;
    socket.set("name", undefined, function(){
      socket.broadcast.emit("otherQuit", {"name": name});
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
