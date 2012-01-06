$(function(){
  var answerPercentages = [0,0,0,0];
  var participantsList = [];
  var readyToParticipate = false;
  var scratchPresenter = true;
  var socket = io.connect(window.location.hostname);
  var msgEl = $(".msg");
  var incomingAnswersEl = $(".incomingAnswers");
  var answerStatsEl = $(".answerStats");
  var qEl = $(".questionContainer");
  var getCurrentQuestion = function(){ return parseInt($("#currentQuestion").val()); };
  var questionTemplate = _.template("<p><%= question %><br/><%= code %></p><% _.each(possible_answers, function(answer){ %> <input type='radio' name='my_answer' value='<%= answer %>'> <%= answer %> <br> <% }); %> <button id='final_answer'>This is my final answer!</button>");
  var answerStatsTemplate = _.template("<% _.each(answerPercentages, function(stat, index) {%> <li> <%= stat %>% answered option <%= index %> </li> <% }) %>");
  var resetAnswerStats = function(possible_answers){
    answerPercentages = [];
    for(var i=0;i<possible_answers.length;i++) answerPercentages.push(0);
    renderAnswerStats();
  }
  var renderAnswerStats = function(){
    answerStatsEl.html(answerStatsTemplate({answerPercentages: answerPercentages}));
  }

  $("#presenterNext").click(function(e){
    e.preventDefault();
    socket.emit("moveTo", { questionNumber: getCurrentQuestion()+1 });
  });

  $("#presenterBack").click(function(e){
    e.preventDefault();
    socket.emit("moveTo", { questionNumber: getCurrentQuestion()-1 });
  });

  $("#presenterResetQuiz").click(function(e){
    e.preventDefault();
    $("#currentQuestion").val(0);
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
    resetAnswerStats(resp.question.possible_answers);
    incomingAnswersEl.html("");
    $("#currentQuestion").val(resp.question.number);

    resp.question.code = methods.prettyPrintCode(resp.question.code);
    var markup = questionTemplate(resp.question);
    qEl.html(markup);
  });

  socket.on('quizComplete', function(resp) {
    $("body").html("<h1> Deliberation Over! </h1><h2>Guilty or Not Guilty - You Decide...</h2>");
  });

  $("#name_button").click(function(e){
    var myName = $("#name").val();
    socket.emit("setName", { name: myName });
  });

  $("#final_answer").live("click", function(e){
    var myAnswer = $("input[name=my_answer]:checked").index("input[name=my_answer]");
    $(this).remove();
    socket.emit("provideAnswer", { myAnswer: myAnswer }, function(isCorrect){
      if(isCorrect){
        methods.showMessage({ type: "correct", msg: "Yeah!" });
      } else {
        methods.showMessage({ type: "wrong", msg: "Wrong!" });
      }
    });
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
