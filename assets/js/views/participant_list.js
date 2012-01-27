var Views = (function(ns){

  var ParticipantList = Views.ViewComponent.extend({
    tagName: "ul",
    id: "participant_list",

    events: {
      messageBus: {
        "participant-welcome"      : "renderParticipants",
        "participant-new"          : "renderParticipants",
        "participant-disconnected" : "renderParticipants",
        "participant-answerstatus" : "renderParticipants"
      }
    },

    renderParticipants: function(data){
      var $html = $(Templates.render('participant_list', data));
      this.$el.empty().append($html);
      return this;
    }

  });

  ns.ParticipantList = ParticipantList;
  return ns;

})(Views || {});




