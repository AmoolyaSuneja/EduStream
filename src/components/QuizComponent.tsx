import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, RotateCcw, Trophy, AlertCircle } from 'lucide-react';
import { Lesson } from '@/data/courses';
import ProgressService, { QuizResult } from '@/services/ProgressService';

interface QuizComponentProps {
  lesson: Lesson;
  courseId: string;
  onQuizComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ lesson, courseId, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety check for quiz data
  if (!lesson.quiz || !lesson.quiz.questions || lesson.quiz.questions.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Quiz Available</h3>
          <p className="text-muted-foreground">This lesson doesn't have a quiz yet.</p>
        </CardContent>
      </Card>
    );
  }

  const questions = lesson.quiz.questions;
  const totalQuestions = questions.length;

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    try {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    } catch (error) {
      console.error('Error selecting answer:', error);
    }
  };

  const calculateResults = () => {
    try {
      let correctAnswers = 0;
      const detailedAnswers = questions.map(question => {
        const selectedAnswer = selectedAnswers[question.id] ?? -1;
        const isCorrect = selectedAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;

        return {
          questionId: question.id,
          selectedAnswer: selectedAnswer >= 0 ? selectedAnswer : 0,
          correct: isCorrect
        };
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);

      const quizResult: QuizResult = {
        lessonId: lesson.id,
        score,
        totalQuestions,
        answers: detailedAnswers,
        completedAt: new Date()
      };

      // Save quiz result
      try {
        ProgressService.saveQuizResult(quizResult);
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }

      return { score, correctAnswers, detailedAnswers };
    } catch (error) {
      console.error('Error calculating results:', error);
      return { score: 0, correctAnswers: 0, detailedAnswers: [] };
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const results = calculateResults();
      setShowResults(true);
      setQuizCompleted(true);
      
      // Call the parent callback with the score
      if (onQuizComplete) {
        onQuizComplete(results.score);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    try {
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      setQuizCompleted(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error resetting quiz:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    try {
      const results = calculateResults();
      const passed = results.score >= 70;

      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className={`h-5 w-5 ${passed ? 'text-yellow-500' : 'text-gray-400'}`} />
              <span>Quiz Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {results.score}%
              </div>
              <p className="text-muted-foreground">
                You got {results.correctAnswers} out of {totalQuestions} questions correct
              </p>
              <Badge className={`mt-2 ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {passed ? 'Passed' : 'Failed'}
              </Badge>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id] ?? -1;
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-2 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <p className="font-medium">{question.question}</p>
                    </div>

                    <div className="space-y-2 ml-7">
                      {question.options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === question.correctAnswer 
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : optionIndex === userAnswer && !isCorrect
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-gray-50'
                          }`}
                        >
                          {option}
                          {optionIndex === question.correctAnswer && (
                            <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <span className="ml-2 text-red-600 font-medium">✗ Your answer</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div className="mt-3 ml-7 p-3 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } catch (error) {
      console.error('Error showing results:', error);
      return (
        <Card className="mt-6">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Results</h3>
            <p className="text-muted-foreground">There was an error loading the quiz results.</p>
            <Button onClick={resetQuiz} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      );
    }
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const canSubmit = answeredQuestions === totalQuestions;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Lesson Quiz</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Answered: {answeredQuestions}/{totalQuestions} questions
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestionData.question}</h3>
          
          <RadioGroup
            value={selectedAnswers[currentQuestionData.id]?.toString() || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestionData.id, parseInt(value))}
          >
            {currentQuestionData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="space-x-2">
            {currentQuestion === totalQuestions - 1 ? (
              <Button 
                onClick={handleSubmitQuiz}
                disabled={!canSubmit || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button 
                onClick={nextQuestion}
                disabled={!selectedAnswers[currentQuestionData.id]}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {!canSubmit && currentQuestion === totalQuestions - 1 && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
            Please answer all questions before submitting the quiz.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizComponent;