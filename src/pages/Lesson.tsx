import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCourses } from '@/data/courses';
import QuizComponent from '@/components/QuizComponent';
import ProgressService from '@/services/ProgressService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Pause, Volume2, Maximize, CheckCircle, ArrowRight, BookOpen, Trophy, Clock } from 'lucide-react';

const Lesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const course = mockCourses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);

  useEffect(() => {
    if (courseId && lessonId) {
      const progress = ProgressService.getProgress();
      const lessonProgress = progress.find(p => p.courseId === courseId && p.lessonId === lessonId);
      setLessonCompleted(lessonProgress?.completed || false);
    }
  }, [courseId, lessonId]);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lesson not found</h1>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Save progress every 10 seconds
      if (courseId && lessonId && time % 10 < 1) {
        ProgressService.updateVideoProgress(courseId, lessonId, time);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    if (courseId && lessonId && !lessonCompleted) {
      markLessonComplete();
    }
  };

  const markLessonComplete = () => {
    if (courseId && lessonId) {
      ProgressService.markLessonComplete(courseId, lessonId);
      setLessonCompleted(true);
      toast({
        title: "Lesson Completed! 🎉",
        description: "Great job! You've completed this lesson. Keep up the excellent work!",
      });
    }
  };

  const handleQuizComplete = (score: number) => {
    toast({
      title: `Quiz Completed! ${score >= 70 ? '🎉' : '📝'}`,
      description: `You scored ${score}%. ${score >= 70 ? 'Excellent work! You\'ve mastered this lesson.' : 'Good effort! Review the material and try again to improve your score.'}`,
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = course.lessons[currentLessonIndex + 1];
  const prevLesson = course.lessons[currentLessonIndex - 1];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate(`/course/${courseId}`)} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-lg font-bold text-primary">{course.title}</h1>
                <p className="text-sm text-muted-foreground">{lesson.title}</p>
              </div>
            </div>
            
            {lessonCompleted && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`${lesson.videoUrl}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                    className="w-full h-64 md:h-96"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lesson.title}
                  />
                  
                  {/* Video availability notice */}
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      If video doesn't load, try refreshing the page
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Lesson Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {lesson.content.description}
                    </p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Key Learning Points:</h4>
                      <ul className="space-y-1">
                        {lesson.content.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {lesson.duration} minutes</span>
                      </div>
                      {!lessonCompleted && (
                        <Button onClick={markLessonComplete} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Lesson Complete
                        </Button>
                      )}
                      {lessonCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quiz">
                {lesson.quiz ? (
                  <QuizComponent 
                    lesson={lesson} 
                    courseId={courseId!} 
                    onQuizComplete={handleQuizComplete}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Quiz Available</h3>
                      <p className="text-muted-foreground">This lesson doesn't have a quiz.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea 
                      className="w-full h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Take notes about this lesson..."
                    />
                    <Button className="mt-3">Save Notes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Course Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons.map((lessonItem, index) => {
                    const progress = ProgressService.getProgress();
                    const isCompleted = progress.some(p => p.courseId === courseId && p.lessonId === lessonItem.id && p.completed);
                    
                    return (
                      <div
                        key={lessonItem.id}
                        className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${
                          lessonItem.id === lessonId 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => navigate(`/lesson/${courseId}/${lessonItem.id}`)}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-current flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {index + 1}. {lessonItem.title}
                          </p>
                          <p className="text-xs opacity-75">{lessonItem.duration} min</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prevLesson && (
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/lesson/${courseId}/${prevLesson.id}`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous: {prevLesson.title}
                  </Button>
                )}
                
                {nextLesson && (
                  <Button 
                    className="w-full justify-start"
                    onClick={() => navigate(`/lesson/${courseId}/${nextLesson.id}`)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Next: {nextLesson.title}
                  </Button>
                )}

                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/course/${courseId}`)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Course Overview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;