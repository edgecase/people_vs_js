var Views = (function(ns){

  var UserList = Views.ViewComponent.extend({
    tagName: "ul",
    id: "user_list",

    events: {
      messageBus: {
        "user-new"          : "render",
        "user-disconnected" : "render",
        "user-answered"     : "render",
        "question-changed"  : "render"
      }
    },

    render: function(data){
      var $html = $(Templates.render('user_list', data));
      this.$el.empty().append($html);
      return this;
    }
  });

  ns.UserList = UserList;
  return ns;

})(Views || {});




