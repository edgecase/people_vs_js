var fs = require("fs");
var path = require("path");
var questionDir = __dirname + "/../questions/";

var methods = {
  loadAll: function(completeFun){
    var sender = this;
    fs.readdir(questionDir, function(err, files){
      if(err) throw err;
      for(var i=0; i<files.length; i++){
        sender.loadQuestion(questionDir + files[i], completeFun);
      }
    });
  },

  loadQuestion: function(fileName, completeFun){
    var sender = this;
    fs.readFile(fileName, "utf8", function(err, data){
      if(err) throw err;
      var pattern = /\*\*(\w+)?\n([^\*\*]+)\n\*\*\1\n/gmi;
      var results, question = {};
      while(results = pattern.exec(data)){
        question[results[1]] = results[2];
      }

      completeFun(sender.formatQuestion(question, fileName));
    });
  },

  formatQuestion: function(question, fileName){
    question.possible_answers = question.possible_answers.split("\n");
    question.correct_index = parseInt(question.correct_index, 10);
    question.number = path.basename(fileName, ".question");
    return question;
  }
}

function QuestionLoader(){ }

QuestionLoader.prototype = methods;

exports.QuestionLoader = QuestionLoader;
