
/*
 * GET home page.
 */

var routes = {
  introduction: function(req, res){
    res.render('index', { question: undefined });
  },
  askTheQuestion: function(req, res){
    var q = parseInt(req.params.id);
    res.render('question', { question: getQuestion(q) });
  },
  answerTheQuestion: function(req, res){
    var q = parseInt(req.params.id);
    var currentQuestion = getQuestion(q);
    var userAnswer = req.body.my_answer;
    if(currentQuestion.correct_answer == userAnswer){
      res.redirect("/question/"+ (q+1));
    } else {
      res.send(418);
    }
  }
};

var questions = [{ number: 1,
    title: "What's 2 + 2?",
    correct_answer: 4,
    possible_answers: [ 1,2,3,4 ]
  },
  { number: 2,
    title: "What's 3 + 3?",
    correct_answer: 6,
    possible_answers: [ 2,4,6,8 ]
  }];

var getQuestion = function(questionNumber){
  return _(questions).find(function(question){
    return questionNumber === question.number;
  });
};

module.exports = routes;
