var _ = require("underscore");
var createSlug = function createSlug(stringForSlug){
  return stringForSlug.toLowerCase().replace(/\s/gi, "-");
};

var users = function(){
  return GLOBAL.db.collection("users");
}

var lessonPlan = function(user, slug){
  return _.find(user.lessonPlans, function(o){ return o.slug === slug });
};

var routes = {
  introduction: function(req, res){
    res.render('index', { isPresenter: false });
  },

  dashboard: function(req, res){
    res.render("dashboard",  {} );
  },

  presentPlan: function(req, res){
    users().findOne({"lessonPlans.slug": req.params.slug }, function(err, user){
      if(err || user === null) res.send(404);
      else {
        var plan = lessonPlan(req.user, req.params.slug);
        if(plan){
          res.render("index", {
            plan: plan,
            isPresenter: (req.url.match(/presenter/gi) !== null)
          });
        } else res.send(404);
      }
    });
  },

  createQuestion: function(req, res){
    var plan = lessonPlan(req.user, req.params.slug)
      , question = req.body;

    question._id = db.ObjectID.createPk();

    plan.questions.push( question );

    users().save(req.user, function(err, doc){
      if(err) return res.send(err, 500);
      res.send({ question: question }, 201);
    });
  },

  updateQuestion: function(req, res){
    var plan = lessonPlan(req.user, req.params.slug)
      , question = _.find(plan.questions, function(q) { return q._id == req.body.question_id });

    _.extend(question, req.body);

    users().save(req.user, function(err, doc){
      if(err) return res.send(err, 500);
      res.send(200);
    });
  },

  deleteQuestion: function(req, res){
    var plan = lessonPlan(req.user, req.params.slug);

    plan.questions = _.reject(plan.questions, function(q) { return q._id == req.body.question_id });

    users().save(req.user, function(err, doc){
      if(err) return res.send(err, 500);
      res.send(200);
    });
  },

  showPlan: function(req, res){
    var plan = lessonPlan(req.user, req.params.slug);
    if(plan) res.render("plan", { plan: plan });
    else res.send(404);
  },

  createPlan: function(req, res){
    var plan = req.body;

    plan.slug = createSlug( plan.title );
    plan.questions = [];
    plan._id = db.ObjectID.createPk();

    req.user.lessonPlans.push(plan);

    users().save(req.user, function(err, doc){
      if(err) res.redirect("back");
      else res.redirect("/users/"+req.user.screen_name+"/plans/"+plan.slug);
    });
  },

  updatePlan: function(req, res){
    var plan = req.body
      , plan_id = plan.id;

    req.user.lessonPlans = _.reject(req.user.lessonPlans, function(lp){ return lp._id == plan_id })
                            .push(plan);

    users().save(req.user, function(err, doc){
      if(err) res.redirect("back");
      else res.redirect("/users/"+req.user.screen_name);
    });
  },

  deletePlan: function(req, res){
    var plan_id = req.body.plan_id;

    req.user.lessonPlans = _.reject(req.user.lessonPlans, function(lp){ return lp._id == plan_id });

    users().save(req.user, function(err, doc){
      if(err) res.redirect("back");
      else res.redirect("/users/"+req.user.screen_name);
    });
  }

};

module.exports = routes;
