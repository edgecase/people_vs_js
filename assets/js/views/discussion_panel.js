var Views = (function(ns){

  var DiscussionPanel = Views.ViewComponent.extend({
    id: "discussion_panel",

    events: {
      view: {
        "click input#submit_discussion" : "sendMessage"
      },
      messageBus: {
        "message-new" : "renderMessage"
      }
    },

    render: function(){
      var $html = $(Templates.render('discussion_area'));
      this.$el.empty().append($html);

      this.$discussion_box  = this.$('textarea.discussion');
      this.$discussion_submit_button  = this.$('input#submit_discussion');
      this.$discussion_items = this.$('table#discussion_items');

      return this;
    },

    renderMessage: function(messages) {
      var html = $(Templates.render('discussion_list_items', messages));
      this.$discussion_items.prepend(html);
    },

    sendMessage: function(){
      this.messageBus.emit("message-send", {text: this.$discussion_box.val()});
    }
  });


  ns.DiscussionPanel = DiscussionPanel;
  return ns;

})(Views || {});
