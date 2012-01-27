describe("ParticipantList", function(){
  var participantList,
      messageBus,
      $el;

  describe("#renderParticipants", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      participantList = new Views.ParticipantList({messageBus: messageBus});
      $el = participantList.render().$el;
    });

    it("is empty with 0 participants", function(){
      participantList.renderParticipants({participants:[]});
      expect($el.children().length).toBe(0);
    });

    it("displays N participants with N participants", function(){
      participantList.renderParticipants({participants:[{name:'alex'}, {name:'kevin'}, {name:'scott'}]});
      expect($el.children().length).toBe(3);
    });

    it("displays the participant's names", function(){
      participantList.renderParticipants({participants:[{name: 'bob'}, {name: 'felix'}]});
      expect($el).toContainText("bob");
      expect($el).toContainText("felix");
    });

    it("displays the participant's answer status", function() {
      participantList.renderParticipants({participants:[
                      {name: 'bob',   answerStatus: 'correct'},
                      {name: 'felix', answerStatus: 'incorrect'},
                      {name: 'alex',  answerStatus: 'unanswered'}
      ]});

      expect($el).toContain(".correct:contains('bob')");
      expect($el).toContain(".incorrect:contains('felix')");
      expect($el).toContain(".unanswered:contains('alex')");
    });
  });

  describe("messages received", function() {
    beforeEach(function(){
      spyOn(Views.ParticipantList.prototype, 'renderParticipants');
      messageBus = new FakeMessageBus();
      participantList = new Views.ParticipantList({messageBus: messageBus});
    });

    it("renderParticipants on participant-new message", function() {
      messageBus.emit('participant-new', {});
      expect(participantList.renderParticipants).toHaveBeenCalled();
    });

    it("renderParticipants on participant-disconnected message", function() {
      messageBus.emit('participant-disconnected', {participants: []});
      expect(participantList.renderParticipants).toHaveBeenCalled();
    });

    it("renderParticipants on participant-answerstatus message", function() {
      messageBus.emit('participant-answerstatus', {participants: []});
      expect(participantList.renderParticipants).toHaveBeenCalled();
    });

    it("renderParticipants on participant-welcome message", function() {
      messageBus.emit('participant-welcome', {participants: []});
      expect(participantList.renderParticipants).toHaveBeenCalled();
    });

  });

});
