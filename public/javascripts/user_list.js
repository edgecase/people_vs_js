var Views = (function(ns){

  var UserList = function(container, messageBus){
    this.$container = container;
    this.messageBus = messageBus;

    this.bindEvents();
  }
  UserList.prototype = {
    bindEvents: function() {
      if (!this.messageBus) return;

      this.messageBus.on("user-new", _.bind(this.render, this));
      this.messageBus.on("user-disconnected", _.bind(this.render, this));
      this.messageBus.on("user-answered", _.bind(this.render, this));
      this.messageBus.on("question-changed", _.bind(this.render, this));
    },
    render: function(data){
      this.$el = $(Templates.render('user_list', data));
      this.$container.empty().append(this.$el);
    }
  }


  ns.UserList = UserList;
  return ns;

})(Views || {});




