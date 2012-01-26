var Views = (function(ns){

  var UserList = Views.ViewComponent.extend({
    tagName: "ul",
    id: "user_list",

    events: {
      messageBus: {
        "user-welcome"      : "renderUsers",
        "user-new"          : "renderUsers",
        "user-disconnected" : "renderUsers",
        "user-answered"     : "renderUsers",
        "question-changed"  : "resetAnswerStatus"
      }
    },

    renderUsers: function(data){
      var $html = $(Templates.render('user_list', data));
      this.$el.empty().append($html);
      return this;
    },

    resetAnswerStatus: function() {
      this.$el.find('li').removeClass().addClass('unanswered');
    }
  });

  ns.UserList = UserList;
  return ns;

})(Views || {});




