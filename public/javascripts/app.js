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
      <% _.each(possibleAnswers, function(answer, index) {%> \
        <li class='possibleAnswer'> \
          <label> \
            <input type='radio' name='my_answer' value='<%= answer %>'> \
            <%= answer %> \
            <div class='percentOfThisAnswer'>0%</div>\
          </label> \
        </li> \
      <% }) %>"
    ),

    discussionItemTemplate: _.template(" \
      <tr> \
        <td class='user'><a class='reply' href='#' title='Reply to <%= user %>'><%= user %></a></td> \
        <td class='message <%= isForMe ? 'forMe' : '' %>'><%= message %></td> \
      </tr>"
    )
  };

  var myUserName = null;
  var answerPercentages = [0,0,0,0];
  var participantsList = {};
  var readyToParticipate = false;
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
      $(".percentOfThisAnswer:eq("+i+")").text( answerPercentages[i] + " %");
    }
  }

  $('#name').focus();

  $('#textarea_container textarea').focus(function() { $('#textarea_container').addClass('focus'); });
  $('#textarea_container textarea').blur(function() { $('#textarea_container').removeClass('focus'); });

  $('.possibleAnswers').on('click', '.possibleAnswer', function(e) {
    if($(e.target).hasClass('possibleAnswer')) {
      $(this).find('input').click();
    }
  });

  $('.possibleAnswers').on('click', ':radio', function(e) {
    $('.possibleAnswer').removeClass('active');
    $(this).closest('.possibleAnswer').addClass('active');
    finalAnswerButton.enable();
  });

  var finalAnswerButton = new ECButton('#final_answer', function() {
    var self = this;
    self.disable();

    self.$.on('click', function(e){
      e.preventDefault();
      if(self.isDisabled) { return; }

      var myAnswer = $("input[name=my_answer]:checked").index("input[name=my_answer]");
      self.disable();
      socket.emit("provideAnswer", { myAnswer: myAnswer }, function(isCorrect, correctIndex){
        if(isCorrect){
          methods.showMessage({ type: "success", msg: "Correct!" });
        } else {
          methods.showMessage({ type: "error", msg: "Incorrect." });
        }
        $("li.possibleAnswer:eq("+correctIndex+")").addClass("success");
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

      var name = $("#name").val();
      if(/[^\w]/.test(name)){
        methods.showMessage( { type: "error", msg: "Names can only contain alphanumerics and underscores!" } );
        return;
      }
      socket.emit("setName", { name: name });
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

  $("textarea.discussion").tabby();
  $("#submit_discussion").click(function(e){
    var message = $("textarea.discussion").val();
    socket.emit("newDiscussionItem", message);
    $("textarea.discussion").val("");
  });

  socket.on("discussionUpdate", function(discussionItem){
    discussionItem = methods.formatDiscussionItem(discussionItem);
    $("#discussion_items")
      .prepend(templates.discussionItemTemplate(discussionItem));
  });

  socket.on('presentQuestion', function (resp) {
    if(!readyToParticipate) return;
    resetAnswerStats(resp.question.possibleAnswers);
    possibleAnswersEl.html(templates.answerTemplate(resp.question));

    resp.question.code = methods.prettyPrintCode(resp.question.code);
    var markup = templates.questionTemplate(resp.question);
    qEl.html(markup);
    progressBar.update(resp.question.number.toString()+ "/" + resp.question.questionsCount.toString(),
      Math.ceil(((resp.question.number/resp.question.questionsCount) * 100)) + "%");
  });

  socket.on('quizComplete', function(resp) {
    $(".questionContainer").html("<h1> Deliberation Over! </h1><h2>Guilty or Not Guilty - You Decide...</h2>");
  });

  $("#name").keydown(function(e){
    if (e.which === 13) $("#name_button").click();
  });

  $("#discussion_items").on("click", "a.reply", function(e){
    e.preventDefault();
    var textArea = $("textarea.discussion");
    textArea.val(textArea.val() + "@" + $(this).text() + " ");
    textArea.setCursorPosition(textArea.val().length, true);
  });

  var methods = {
    addParticipant: function(name, you){
      if(! (name in participantsList) ){
        participantsList[name] = { domEl: $("<li name='" + name + "' title='" + name + "'>" + name + "</li>") };
        if(you) {
          participantsList[name].domEl.addClass("you").text(name+" (You)")
          myUserName = name;
        };
        $(".participants").append( participantsList[name].domEl );
      }
    },
    removeParticipant: function(name){
      if( name in participantsList ){
        participantsList[name].domEl.remove();
        delete participantsList[name];
      }
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
    formatDiscussionItem: function(discussionItem) {
      discussionItem.message = this.formatDiscussionMessage(discussionItem.message);
      discussionItem.isForMe = this.isDiscussionItemForMe(discussionItem.message);
      return discussionItem;
    },
    isDiscussionItemForMe: function(message){
      var userRegex = new RegExp("(?:^|\\s|\\W)(@" + myUserName + ")(?:$|\\s|\\W)", "gi");
      return userRegex.test(message);
    },
    formatDiscussionMessage: function(message) {
      var self = this,
          codeBlocks = [];
      $(message).find("code").each(function(idx, elem){
        var codeItem = {
          original:  $(elem).text(),
          pretty: self.prettyPrintCode($(elem).text())
        };
        codeBlocks.push(codeItem);
      });

      for(var i=0; i<codeBlocks.length; i++){
        message = message.replace(codeBlocks[i].original, codeBlocks[i].pretty);
      }

      return message;
    },
    prettyPrint: function(text){
      if(text && text.length > 0){
        text = text.
              replace(/\t/g, "&nbsp;&nbsp;").
              replace(/\</g, "&lt;").
              replace(/\>/g, "&gt;").
              replace(/ /g, "&nbsp;").
              replace(/\n/g, "<br/>");

        return text;

      } else {
        return "";
      }
    },
    prettyPrintCode: function(code){
      code = this.prettyPrint(code);
      return prettyPrintOne(code, "js", true);
    }
  };


  $.fn.setCursorPosition = function(pos, focus) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }

    if (focus) $(this).focus();
  }

});
