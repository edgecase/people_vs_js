$(function(){
  var templates = {
    questionTemplate: _.template(" \
      <p> \
        <%= question %> \
        <br/> \
        <%= code %> \
      </p>"
    ),

    answerTemplate: _.template(" \
      <ul> \
        <% _.each(possibleAnswers, function(answer, index) {%> \
          <li class='possibleAnswer'> \
            <label> \
              <input type='radio' name='my_answer' value='<%= answer %>'> \
              <%= answer %> \
              <div class='percentOfThisAnswer'>0%</div>\
            </label> \
          </li> \
        <% }) %> \
      </ul>")
  };

  var answerPercentages = [0,0,0,0];
  var participantsList = {};
  var readyToParticipate = false;
  var scratchPresenter = true;
  var socket = io.connect(window.location.hostname);
  var msgEl = $(".msg");
  var incomingAnswersEl = $(".incomingAnswers");
  var possibleAnswersEl = $("ul.possibleAnswers");
  var qEl = $(".questionContainer");
  var resetAnswerStats = function(possibleAnswers){
    answerPercentages = [];
    for(var i=0;i<possibleAnswers.length;i++) answerPercentages.push(0);
    for( var user in participantsList ){
      participantsList[user].domEl.removeClass("incorrect").removeClass("correct");
    }
  }

  var renderAnswerStats = function(){
    for(var i=0; i<answerPercentages.length; i++ ){
      $(".percentOfThisAnswer:eq("+i+")").text( answerPercentages[i].toString() + " %");
    }
  }

  $('#name').focus();

  $('#textarea_container textarea').focus(function() { $('#textarea_container').addClass('focus'); });
  $('#textarea_container textarea').blur(function() { $('#textarea_container').removeClass('focus'); });

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
          methods.showMessage({ type: "success", msg: "Correct!" });
        } else {
          methods.showMessage({ type: "error", msg: "Incorrect." });
        }
      });
    });
  });

  var progressBar = new ECProgressBar('#question_progress');
  progressBar.update('0/0', '0%');

  var tabBar = new ECTabBar({
    buttons  : '#header_right .switch',
    sections : '#right_panel .section',
    init     : function() { this.$buttons.first().click(); }
  });

  var selectNameButton = new ECButton('#name_button', function() {
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
    methods.showMessage( { "msg": data.name + " has joined the quiz!", "type": "success" } );
    methods.addParticipant(data.name);
  });

  socket.on('selfJoined', function (data) {
    readyToParticipate = true;
    methods.addParticipant(data.name, true);
    qEl.html('<div id="please_wait">Please wait for the quiz to begin</div>');
  });

  socket.on('otherQuit', function(data) {
    methods.removeParticipant(data.name);
  });

  socket.on('msg', function (data) {
    methods.showMessage(data);
  });

  socket.on('remoteAnswer', function (data) {
    participantsList[data.user].domEl.addClass( (data.isCorrect) ? "correct" : 'incorrect' );
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
    possibleAnswersEl.html(templates.answerTemplate(resp.question));

    resp.question.code = methods.prettyPrintCode(resp.question.code);
    var markup = templates.questionTemplate(resp.question);
    qEl.html(markup);
    finalAnswerButton.enable();
    console.log(  resp.question.number.toString()+ "/" + resp.question.questionsCount.toString() );
    console.log( Math.ceil(((resp.question.number/resp.question.questionsCount) * 100)) );
    progressBar.update(resp.question.number.toString()+ "/" + resp.question.questionsCount.toString(), 
      Math.ceil(((resp.question.number/resp.question.questionsCount) * 100)) + "%");
  });

  socket.on('quizComplete', function(resp) {
    $("body").html("<h1> Deliberation Over! </h1><h2>Guilty or Not Guilty - You Decide...</h2>");
  });

  $("#name").keydown(function(e){
    if (e.which === 13) $("#name_button").click();
  });

  var methods = {
    addParticipant: function(name, you){
      if(! (name in participantsList) ){
        participantsList[name] = { domEl: $("<li name='" + name + "'>" + name + "</li>") };
        if(you) participantsList[name].domEl.addClass("you").text(name+" (You)");
        $(".participants").append( participantsList[name].domEl );
      }
    },
    removeParticipant: function(name){
      if( name in participantsList ) $(".participants").remove( participantsList[name].domEl );
    },
    showMessage: function(data){
      msgEl.
        removeClass().addClass("msg").
        text(data.msg).
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
