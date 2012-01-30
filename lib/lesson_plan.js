var mongoose = (GLOBAL.app.mongoose || require("mongoose"))
  , Schema = mongoose.Schema
  , Question = require("./question")
;

var LessonPlan = new Schema({
  "title": String,
  "slug" : String,
  "questions": [Question]
});

LessonPlan.methods =  {
  start: function() { this.isStarted = true; },
  end: function() { this.isDone = true; },
  questionCount: function() { return this._questions.length; },
  currentQuestion: function() {
    if (!this.isStarted) return null;
    if (this.isDone) return null;

    return this._questions[this._currentQuestionIndex];
  },
  nextQuestion: function() {
    if (!this.isStarted) return null;
    if (this._currentQuestionIndex + 1 > this.questionCount()){
      this.isDone = true;
      return null;
    }

    this._currentQuestionIndex++;
    return this.currentQuestion();
  },
  prevQuestion: function() {
    if (!this.isStarted) return null;
    if (this.isDone) return null;
    if (this._currentQuestionIndex - 1 < 0) return null;

    this._currentQuestionIndex--;
    return this.currentQuestion();
  },
  addParticipant: function(id, name) {
    this._participants[id] = new Participant(id, name);
  },
  getParticipant: function(id) {
    return this._participants[id];
  }
};

mongoose.model("LessonPlan", LessonPlan);
module.exports = LessonPlan;
