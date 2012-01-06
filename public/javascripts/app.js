$(function(){
  var currentAnswers = [0,0,0,0];
  var participantsList = [];
  var readyToParticipate = false;
  var scratchPresenter = true;
  var socket = io.connect('http://localhost');
  var msgEl = $(".msg");
  var incomingAnswersEl = $(".incomingAnswers");
  var answerStatsEl = $(".answerStats");
  var qEl = $(".questionContainer");
  var getCurrentQuestion = function(){ return parseInt($("#currentQuestion").val()); };
  var questionTemplate = _.template("<p><%= title %><br/><%= code %></p><% _.each(possible_answers, function(answer){ %> <input type='radio' name='my_answer' value='<%= answer %>'> <%= answer %> <br> <% }); %> <button id='final_answer'>This is my final answer!</button>");
  var answerStatsTemplate = _.template("<% _.each(currentAnswers, function(stat, index) {%> <li> <%= stat %> People Answered Option <%= index %> </li> <% }) %>");
  var resetAnswerStats = function(){
    currentAnswers = [0,0,0,0];
    renderAnswerStats();
  }
  var renderAnswerStats = function(){
    answerStatsEl.html(answerStatsTemplate({currentAnswers: currentAnswers}));
  }

  $("#presenterNext").click(function(e){
    e.preventDefault();
    socket.emit("moveTo", { questionNumber: getCurrentQuestion()+1 });
  });

  $("#presenterBack").click(function(e){
    e.preventDefault();
    socket.emit("moveTo", { questionNumber: getCurrentQuestion()-1 });
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

  socket.on('msg', function (data) {
    methods.showMessage(data);
  });

  socket.on('remoteAnswer', function (data) {
    incomingAnswersEl.append( $("<li>"+ data.user +"</li>").addClass( ((data.isCorrect) ? "good" : "bad") ) );
    currentAnswers = data.currentAnswers;
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
    resetAnswerStats();
    incomingAnswersEl.html("");
    $("#currentQuestion").val(resp.question.number);

    resp.question.code = methods.prettyPrintCode(resp.question.code);
    var markup = questionTemplate(resp.question);
    qEl.html(markup);
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

  var methods = {
    addParticipant: function(name){
      participantsList.push(name);
      participantsList.sort();
      $(".participants").append("<br>"+name);
    },
    removeParticipant: function(name){
      throw("NOT DONE!");
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