describe("Quiz", function(){
  var quiz,
      questionLoader,
      questions;

  beforeEach(function(){
    questions = [
                  { prompt: "Result of expression?",
                    code: "2+2",
                    possibleAnswers: ["2", "5"],
                    correctIndex: 0},
                  { prompt: "Try this:",
                    code: "console.log('foo')",
                    possibleAnswers: ["bar", "foobar"],
                    correctIndex: 1},
                  { prompt: "What does this do?",
                    code: "var x = y;",
                    possibleAnswers: ["RuntimeError", "null", "undefined"],
                    correctIndex: 2}
                ];
    questionLoader = {loadAll: function(){return questions;}};
    quiz = new Quiz(questionLoader);
  });

  describe("#new", function(){
    it("should not be started initially", function(){
      expect(quiz.isStarted).toEqual(false);
    });

    it("should load the questions", function(){
      expect(quiz.questionCount()).toEqual(3);
    });

  });

  describe("#start", function(){
    it("should start the quiz", function(){
      quiz.start();
      expect(quiz.isStarted).toEqual(true);
    });
  });

  describe("#end", function(){
    it("should end the quiz", function(){
      quiz.end();
      expect(quiz.isDone).toEqual(true);
    });
  });

  describe("#currentQuestion", function(){
    it("returns null if the quiz has not been started", function(){
      expect(quiz.currentQuestion()).toEqual(null);
    });

    it("returns the first question if the quiz has been started", function(){
      quiz.start();
      expect(quiz.currentQuestion()).toEqual(questions[0]);
    });

    it("returns the Nth question", function(){
      quiz.start();
      quiz.nextQuestion();
      expect(quiz.currentQuestion()).toEqual(questions[1]);
    });

    it("returns null if the quiz has ended", function(){
      quiz.start();
      quiz.end();
      expect(quiz.currentQuestion()).toEqual(null);
    });
  });

  describe("#nextQuestion", function(){
    it("returns null if the quiz has not started", function(){
      expect(quiz.nextQuestion()).toEqual(null);
    });

    it("returns the next question if available", function(){
      quiz.start();
      expect(quiz.nextQuestion()).toEqual(questions[1]);
    })

    it("returns null if there are no more questions", function(){
      quiz.start();
      for(var i=0;i<=quiz.questionCount();i++) { quiz.nextQuestion(); };
      expect(quiz.nextQuestion()).toEqual(null);
    });

    it("ends the quiz if there are no more questions", function(){
      quiz.start();
      for(var i=0;i<quiz.questionCount();i++) { quiz.nextQuestion(); };
      expect(quiz.isStarted).toEqual(true);
      quiz.nextQuestion();
      expect(quiz.isDone).toEqual(true);
    });
  });

  describe("#prevQuestion", function(){
    it("returns null if the quiz has not started", function(){
      expect(quiz.prevQuestion()).toEqual(null);
    });

    it("returns the previous question if available", function(){
      quiz.start();
      quiz.nextQuestion();
      expect(quiz.prevQuestion()).toEqual(questions[0]);
    })

    it("returns null if there are no more questions", function(){
      quiz.start();
      expect(quiz.prevQuestion()).toEqual(null);
    });

    it("returns null if the quiz has ended", function(){
      quiz.start();
      quiz.end();
      expect(quiz.prevQuestion()).toEqual(null);
    });
  });

  describe("#addParticipant", function(){
    var newId = '1234', newName = 'bob';

    it("adds a participant", function(){
      quiz.addParticipant(newId, newName);

      expect(quiz.getParticipant(newId).id).toEqual(newId);
      expect(quiz.getParticipant(newId).name).toEqual(newName);
    });

    it("throws an error if the participant with the given name already exists")
  });


});
