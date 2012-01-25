var Views = (function(ns){

  var PresenterLayout = Views.ViewComponent.extend({
    id: "presenter_layout",

    render: function(){
      var $html = $(Templates.render('presenter_layout'));
      this.$el.empty().append($html);

      this.$("#participant_container").append(new Views.UserList({messageBus: this.messageBus}).render().el);
      this.$("#question_container").append(new Views.QuestionPanel({messageBus: this.messageBus}).render().el);
      this.$("#discussion_container").append(new Views.DiscussionPanel({messageBus: this.messageBus}).render().el);
      this.$("#right_panel").append(new Views.QuestionNav({messageBus: this.messageBus}).render().el);

      return this;
    }

  });


  ns.PresenterLayout = PresenterLayout;
  return ns;

})(Views || {});



