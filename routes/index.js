/*
 * GET home page.
 */

var routes = {
  introduction: function(req, res){
    res.render('index', { isPresenter: false });
  },
  presenter: function(req, res){
    res.render('index', { isPresenter: true });
  }
};

module.exports = routes;
