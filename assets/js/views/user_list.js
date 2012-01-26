var Views = (function(ns){

  var UserList = Views.ViewComponent.extend({
    tagName: "ul",
    id: "user_list",

    events: {
      messageBus: {
        "user-welcome"      : "renderUsers",
        "user-new"          : "renderUsers",
        "user-disconnected" : "renderUsers",
        "user-answerstatus" : "renderUsers"
      }
    },

    renderUsers: function(data){
      var $html = $(Templates.render('user_list', data));
      this.$el.empty().append($html);
      return this;
    }

  });

  ns.UserList = UserList;
  return ns;

})(Views || {});




