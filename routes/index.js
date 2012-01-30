/*
 * GET home page.
 */

// app.get('/:name/dashboard', authorizeUser , routes.dashboard);
// app.get('/:name/plans/:slug', authorizeUser , routes.presentPlan);
// app.post('/:name/plans/:slug', authorizeUser , routes.savePlan);
// app.get('/:name/plans', authorizeUser , routes.plans);
// 
// app.get('/:slug', routes.showPlan);
// 
// app.get('/', routes.introduction);

var routes = {
  introduction: function(req, res){
    res.render('index', { isPresenter: false });
  },

  presentPlan: function(req, res){
    res.render('index', { isPresenter: true });
  },

  dashboard: function(req, res){
    res.render("dashboard", {
      plans: [ ]
    }
    );
  },

  showPlan: function(req, res){
  },

  savePlan: function(req, res){
    res.render('index', { isPresenter: false });
  },
  plans: function(req, res){
  
  }
};

module.exports = routes;
