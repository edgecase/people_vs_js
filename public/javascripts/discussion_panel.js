var views = (function(ns){

  var discussionTemplate = _.template(" \
    <table id='discussionPanel'> \
      <% _.each(messages, function(user, text) { %> \
      <tr> \
        <td class='user'> \
          <a class='reply' href='#' title='Reply to <%= user %>'><%= user %></a> \
        </td> \
        <td class='message <%= isForMe ? 'forMe' : '' %>'><%= message %></td> \
      </tr> \
      <% }); %> \
    </table>");

  var DiscussionPanel = function(containerEl){
    this.$container = containerEl;
  }
  DiscussionPanel.prototype = {
    render: function(data){
      var html = discussionTemplate(data);
      this.$container.empty().append(html);
      this.$el = this.$container.find('table#discussionPanel').eq(0);
    }
  };


  ns.DiscussionPanel = DiscussionPanel;
  return ns;

})(views || {});
