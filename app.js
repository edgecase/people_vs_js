
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , _ = require('underscore')

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
app.get('/question/:id', routes.askTheQuestion);
app.post('/question/:id', routes.answerTheQuestion);

var questions = [{ number: 1,
    title: "What does this output?",
    code: "2 + 2",
    correct_index: 3,
    possible_answers: [ 1,2,3,4 ]
  },
  { number: 2,
    title: "What does this output?",
    code: "function add(x, y) {\n\treturn x + y\n}\nadd(3,3);",
    correct_index: 2,
    possible_answers: [ 2,4,6,8 ]
  }];

var getQuestion = function(questionNumber){
  return _(questions).find(function(question){
    return questionNumber === question.number;
  });
};

var currentQuestion = 0;
var currentAnswers = [0,0,0,0];

function resetCurrentAnswers(){
  currentAnswers = [0,0,0,0];
}

function userAnsweredAtIndex(index){
  currentAnswers[index]++;
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
  socket.on("moveTo", function(data){
    resetCurrentAnswers();
    currentQuestion = data.questionNumber;
    var questionToPresent = getQuestion(currentQuestion);
    io.sockets.emit("presentQuestion", { question: questionToPresent });
  });

  socket.on("provideAnswer", function(data, isCorrectCallback){
    var q = getQuestion(currentQuestion);
    var isCorrect = q.correct_index == data.myAnswer;

    userAnsweredAtIndex(data.myAnswer);
    isCorrectCallback( isCorrect );
    socket.get("name", function(err, name){
      io.sockets.emit("remoteAnswer", {
        user: name,
        currentAnswers: currentAnswers,
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
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
