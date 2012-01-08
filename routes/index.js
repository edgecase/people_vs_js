/*
 * GET home page.
 */

var routes = {
  introduction: function(req, res){
    res.render('index', { question: undefined });
  },
  presenter: function(req, res){
    res.render('presenter', { question: undefined });
  }
};

module.exports = routes;
