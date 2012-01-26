var Views = (function(ns){

  var ParticipantLayout = Views.ViewComponent.extend({
    id: "participant_layout",

    render: function(){
      var $html = $(Templates.render('participant_layout'));
      this.$el.empty().append($html);

      this.$("#participant_container").append(new Views.UserList({messageBus: this.messageBus}).render().el);
      this.$("#question_container").append(new Views.QuestionPanel({messageBus: this.messageBus}).render().el);
      this.$("#question_container").append(new Views.AnswerPanel({messageBus: this.messageBus}).render().el);
      this.$("#question_container").append(new Views.WelcomePanel({messageBus: this.messageBus}).render().el);
      this.$("#discussion_container").append(new Views.DiscussionPanel({messageBus: this.messageBus}).render().el);

      return this;
    }

  });


  ns.ParticipantLayout = ParticipantLayout;
  return ns;

})(Views || {});



