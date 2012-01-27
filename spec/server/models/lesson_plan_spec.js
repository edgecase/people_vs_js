var LessonPlan = require('../../../lib/lesson_plan').LessonPlan

describe("LessonPlan", function(){
  var lessonPlan,
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
    lessonPlan = new LessonPlan(questionLoader);
  });

  describe("#new", function(){
    it("should not be started initially", function(){
      expect(lessonPlan.isStarted).toEqual(false);
    });

    it("should load the questions", function(){
      expect(lessonPlan.questionCount()).toEqual(3);
    });

  });

  describe("#start", function(){
    it("should start the lessonPlan", function(){
      lessonPlan.start();
      expect(lessonPlan.isStarted).toEqual(true);
    });
  });

  describe("#end", function(){
    it("should end the lessonPlan", function(){
      lessonPlan.end();
      expect(lessonPlan.isDone).toEqual(true);
    });
  });

  describe("#currentQuestion", function(){
    it("returns null if the lessonPlan has not been started", function(){
      expect(lessonPlan.currentQuestion()).toEqual(null);
    });

    it("returns the first question if the lessonPlan has been started", function(){
      lessonPlan.start();
      expect(lessonPlan.currentQuestion()).toEqual(questions[0]);
    });

    it("returns the Nth question", function(){
      lessonPlan.start();
      lessonPlan.nextQuestion();
      expect(lessonPlan.currentQuestion()).toEqual(questions[1]);
    });

    it("returns null if the lessonPlan has ended", function(){
      lessonPlan.start();
      lessonPlan.end();
      expect(lessonPlan.currentQuestion()).toEqual(null);
    });
  });

  describe("#nextQuestion", function(){
    it("returns null if the lessonPlan has not started", function(){
      expect(lessonPlan.nextQuestion()).toEqual(null);
    });

    it("returns the next question if available", function(){
      lessonPlan.start();
      expect(lessonPlan.nextQuestion()).toEqual(questions[1]);
    })

    it("returns null if there are no more questions", function(){
      lessonPlan.start();
      for(var i=0;i<=lessonPlan.questionCount();i++) { lessonPlan.nextQuestion(); };
      expect(lessonPlan.nextQuestion()).toEqual(null);
    });

    it("ends the lessonPlan if there are no more questions", function(){
      lessonPlan.start();
      for(var i=0;i<lessonPlan.questionCount();i++) { lessonPlan.nextQuestion(); };
      expect(lessonPlan.isStarted).toEqual(true);
      lessonPlan.nextQuestion();
      expect(lessonPlan.isDone).toEqual(true);
    });
  });

  describe("#prevQuestion", function(){
    it("returns null if the lessonPlan has not started", function(){
      expect(lessonPlan.prevQuestion()).toEqual(null);
    });

    it("returns the previous question if available", function(){
      lessonPlan.start();
      lessonPlan.nextQuestion();
      expect(lessonPlan.prevQuestion()).toEqual(questions[0]);
    })

    it("returns null if there are no more questions", function(){
      lessonPlan.start();
      expect(lessonPlan.prevQuestion()).toEqual(null);
    });

    it("returns null if the lessonPlan has ended", function(){
      lessonPlan.start();
      lessonPlan.end();
      expect(lessonPlan.prevQuestion()).toEqual(null);
    });
  });

  describe("#addParticipant", function(){
    var newId = '1234', newName = 'bob';

    it("adds a participant", function(){
      lessonPlan.addParticipant(newId, newName);

      expect(lessonPlan.getParticipant(newId).id).toEqual(newId);
      expect(lessonPlan.getParticipant(newId).name).toEqual(newName);
    });

    it("throws an error if the participant with the given name already exists")
  });


});
