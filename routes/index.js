/*
 * GET home page.
 */

var routes = {
  introduction: function(req, res){
    res.render('index', { question: undefined });
  },
  presenter: function(req, res){
    res.render('presenter', { question: undefined });
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

module.exports = routes;
