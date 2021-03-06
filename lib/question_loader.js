var fs = require("fs");
var path = require("path");
var questionDir = __dirname + "/../questions/";

var methods = {
  loadAll: function(completeFun){
    var files, question, questions = [];

    files = fs.readdirSync(questionDir);

    for(var i=0; i<files.length; i++){
      question = this.loadQuestion(questionDir + files[i]);
      questions.push(question);
    }

    questions = _.sortBy(questions, function(q) { return q.number; });

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
    question.possibleAnswers = _.map(question.possibleAnswers.split("\n"), function(answer, idx) {
      return {value: answer, timesChosen: 0, percentageChosen: 0};
    });
    question.timesAnswered = 0;
    question.correctIndex = parseInt(question.correctIndex, 10);
    question.number = parseInt(path.basename(fileName, ".question"), 10);
    return question;
  }
}

function QuestionLoader(){ }

QuestionLoader.prototype = methods;

exports.QuestionLoader = QuestionLoader;
