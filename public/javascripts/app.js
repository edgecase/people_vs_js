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

  var finalAnswerButton = new ECButton('#final_answer', function() {
    var self = this;
    self.disable();

    self.$.on('click', function(e){
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
  });

  selectNameButton = new ECButton('#name_button', function() {
    var self = this;
    if(self.$.hasClass('student')) { self.disable(); }

    self.$.on('click', function(e){
      e.preventDefault();
      if(self.isDisabled) { return; }
      socket.emit("setName", { name: $("#name").val() });
    });

    $('#name').on('keyup', function(e) {
      if($(this).val() == '') { self.disable(); }
      else { self.enable(); }
    });
  });

  $('#name').focus();

  var progressBar = new ECProgressBar('#question_progress');
  progressBar.update('20/40', '50%');

  $('.switch').click(function() {
    var targetID = '#' + $(this).attr('id').replace('_button','');
    $('.switch').removeClass('active');
    $(this).toggleClass('active');

    $('#right_panel .section:not(' + targetID + ')').fadeOut(150)
    $(targetID).fadeIn(150);
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
    if(confirm('Are you sure you want to reset?')){
      $("#currentQuestion").val(0);
      readyToParticipate = true;
      socket.emit("resetQuiz");
    }
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
    methods.addParticipant(data.name + " <span>(you!)</span> ", true);
    qEl.html('<div id="please_wait">Please wait for the quiz to begin</div>');
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
    $("#scratch_results").html(payload);
  });

  socket.on('presentQuestion', function (resp) {
    if(!readyToParticipate) return;
    resetAnswerStats(resp.question.possibleAnswers);
    incomingAnswersEl.html("");

    resp.question.code = methods.prettyPrintCode(resp.question.code);
    var markup = templates.questionTemplate(resp.question);
    qEl.html(markup);
    finalAnswerButton.enable();
  });

  socket.on('quizComplete', function(resp) {
    $("body").html("<h1> Deliberation Over! </h1><h2>Guilty or Not Guilty - You Decide...</h2>");
  });

  $("#name").keydown(function(e){
    if (e.which === 13)
      $("#name_button").click();
  });

  var methods = {
    addParticipant: function(name, you){
      participantsList.push(name);
      participantsList.sort();
      $(".participants").append("<li class='" + (you ? 'you' : '') + "' name='" + name + "'>" + name + "</li>");
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
