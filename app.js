
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
app.get('/question/:id', routes.askTheQuestion);
app.post('/question/:id', routes.answerTheQuestion);

io.sockets.on('connection', function (socket) {
  var namedClients = _.map(io.sockets.sockets, function(val, key){
    return val.store.data.name;
  });

  namedClients = _.compact(namedClients);

  socket.emit('welcome', { users: namedClients });
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
    });

  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
