$(function(){
  var templates = {
    questionTemplate: _.template(" \
      <p> \
        <%= question %> \
        <br/> \
        <%= code %> \
      </p> \
      <% _.each(possibleAnswers, function(answer){ %> \
        <label> \
          <input type='radio' name='my_answer' value='<%= answer %>'> \
          <%= answer %> \
        </label> \
        <br> \
      <% }); %> \
      <button id='final_answer'>This is my final answer!</button>"),

    answerTemplate: _.template(" \
      <ul> \
        <% _.each(answers, function(answer, index) {%> \
          <li> \
            <label> \
              <input type='radio' name='my_answer' value='<%= answer %>'> \
              <%= answer %> \
            </label> \
            <span> \
              <%= stat %>% answered option <%= index %> \
            </span> \
          </li> \
        <% }) %> \
      </ul>")
  };

  var answerPercentages = [0,0,0,0];
  var participantsList = [];
  var readyToParticipate = false;
  var scratchPresenter = true;
  var socket = io.connect(window.location.hostname);
  var msgEl = $(".msg");
  var incomingAnswersEl = $(".incomingAnswers");
  var answerStatsEl = $(".answerStats");
  var qEl = $(".questionContainer");
  var answerStatsTemplate = _.template("<% _.each(answerPercentages, function(stat, index) {%> <li> <%= stat %>% answered option <%= index %> </li> <% }) %>");
  var resetAnswerStats = function(possibleAnswers){
    answerPercentages = [];
    for(var i=0;i<possibleAnswers.length;i++) answerPercentages.push(0);
    renderAnswerStats();
  }
  var renderAnswerStats = function(){
    answerStatsEl.html(answerStatsTemplate({answerPercentages: answerPercentages}));
  }

  window.finalAnswer = new function() {
    var self = this;
    self.$   = $('#final_answer');
    self.isDisabled = false;

    self.$.click(function(e){
      e.preventDefault();
      if(self.isDisabled) { return; }

      var myAnswer = $("input[name=my_answer]:checked").index("input[name=my_answer]");
      self.disable();
      socket.emit("provideAnswer", { myAnswer: myAnswer }, function(isCorrect){
        if(isCorrect){
          methods.showMessage({ type: "correct", msg: "Yeah!" });
        } else {
          methods.showMessage({ type: "wrong", msg: "Wrong!" });
        }
      });
    });

    self.disable = function() {
      self.isDisabled = true;
      self.$.addClass('disabled')
            .removeClass('enabled');
    };

    self.enable = function() {
      self.isDisabled = false;
      self.$.removeClass('disabled')
            .addClass('enabled');
    };
  };

  $('.switch').click(function() {
    $('.switch').removeClass('active');
    $(this).toggleClass('active');
  });

  $("#presenterNext").click(function(e){
    e.preventDefault();
    socket.emit("nextQuestion");
  });

  $("#presenterBack").click(function(e){
    e.preventDefault();
    socket.emit("prevQuestion");
  });

  $("#presenterResetQuiz").click(function(e){
    e.preventDefault();
    readyToParticipate = true;
    socket.emit("resetQuiz");
  });

  socket.on("welcome", function(data){
    $.each(data.users, function(index, value){
      methods.addParticipant(value);
    });
  });

  socket.on('otherJoined', function (data) {
    msgEl.text( data.name + " has joined the quiz!" );
    methods.addParticipant(data.name);
  });

  socket.on('selfJoined', function (data) {
    readyToParticipate = true;
    methods.addParticipant(data.name + " (you!) ");
    qEl.html("Please wait for the quiz to begin");
  });

  socket.on('otherQuit', function(data) {
    methods.removeParticipant(data.name);
  });

  socket.on('msg', function (data) {
    methods.showMessage(data);
  });

  socket.on('remoteAnswer', function (data) {
    incomingAnswersEl.append( $("<li>"+ data.user +"</li>").addClass( ((data.isCorrect) ? "good" : "bad") ) );
    answerPercentages = data.answerPercentages;
    renderAnswerStats();
  });

  $("textarea.scratch").tabby().keydown(function(e){
    if(scratchPresenter) socket.emit("scratchStream", $(this).val());
  });

  socket.on("scratchUpdate", function(text){
    var payload = methods.prettyPrintCode(text);
    $("div.scratch").html(payload);
  });

  socket.on('presentQuestion', function (resp) {
    if(!readyToParticipate) return;
    resetAnswerStats(resp.question.possibleAnswers);
    incomingAnswersEl.html("");

    resp.question.code = methods.prettyPrintCode(resp.question.code);
    var markup = templates.questionTemplate(resp.question);
    qEl.html(markup);
    finalAnswer.enable();
  });

  socket.on('quizComplete', function(resp) {
    $("body").html("<h1> Deliberation Over! </h1><h2>Guilty or Not Guilty - You Decide...</h2>");
  });

  $("#name_button").click(function(e){
    var myName = $("#name").val();
    socket.emit("setName", { name: myName });
  });

  $("#name").keydown(function(e){
    if (e.which === 13)
      $("#name_button").click();
  });

  var methods = {
    addParticipant: function(name){
      participantsList.push(name);
      participantsList.sort();
      $(".participants").append("<li name='" + name + "'>" + name + "</li>");
    },
    removeParticipant: function(name){
      participantsList = _.without(participantsList, name);
      $(".participants").find("[name=" + name + "]").remove();
    },
    showMessage: function(data){
      msgEl.
        text(data.msg).
        removeClass().
        addClass(data.type).
        show().
        delay(3000).
        fadeOut(1000);
    },
    prettyPrintCode: function(code){
      code = code.
              replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").
              replace(/ /g, "&nbsp;").
              replace(/\n/g, "<br/>");

      return prettyPrintOne(code, "js", true);
    }
  };

});
