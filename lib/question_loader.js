var fs = require("fs");
var path = require("path");
var questionDir = __dirname + "/../questions/";

var methods = {
  loadAll: function(completeFun){
    var sender = this, question, questions = [];

    fs.readdir(questionDir, function(err, files){
      if(err) throw err;
      for(var i=0; i<files.length; i++){
        question = sender.loadQuestion(questionDir + files[i]);
        questions.push(question);
      }
    });

    questions = _.sortBy(questions, function(q) { return q.number; });

    console.log(questions);

    return questions;
  },

  loadQuestion: function(fileName){
    var data = fs.readFileSync(fileName, "utf8");

    var pattern = /(\*\*(\w+))`(.*?)`\1/gi;
    var results, question = {};
    // replacement of newlines is a dirty hack around shitty multi-line
    // regex handling in javascript. *ugh*
    data = data.replace(/\n/g, '`');
    while(results = pattern.exec(data)){
      question[results[2]] = results[3].replace(/`/g, '\n');
    }

    return this.formatQuestion(question, fileName);
  },

  formatQuestion: function(question, fileName){
    question.possibleAnswers = question.possibleAnswers.split("\n");
    question.correctIndex = parseInt(question.correctIndex, 10);
    question.number = parseInt(path.basename(fileName, ".question"), 10);
    return question;
  }
}

function QuestionLoader(){ }

QuestionLoader.prototype = methods;

exports.QuestionLoader = QuestionLoader;
