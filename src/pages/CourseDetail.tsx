import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { mockCourses } from '@/data/courses';
import { Clock, User, Play, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Course not found</h1>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const totalLessons = course.lessons.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/courses')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
              EduStream
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-muted-foreground text-lg">{course.description}</p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              {/* Course Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.lessons.map((lesson, index) => (
                      <AccordionItem key={lesson.id} value={lesson.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-3 text-left">
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0" />
                            )}
                            <div>
                              <p className="font-medium">Lesson {index + 1}: {lesson.title}</p>
                              <p className="text-sm text-muted-foreground">{lesson.duration} minutes</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-8 space-y-3">
                            <p className="text-muted-foreground">
                              Watch this lesson to learn about {lesson.title.toLowerCase()}.
                            </p>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/lesson/${courseId}/${lesson.id}`)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                {lesson.completed ? 'Review' : 'Start'} Lesson
                              </Button>
                              {lesson.quiz && (
                                <Button variant="outline" size="sm">
                                  Take Quiz
                                </Button>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{completedLessons}/{totalLessons} lessons</span>
                </div>
                <Progress value={(completedLessons / totalLessons) * 100} className="h-3" />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round((completedLessons / totalLessons) * 100)}% Complete
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => {
                  const nextLesson = course.lessons.find(lesson => !lesson.completed);
                  if (nextLesson) {
                    navigate(`/lesson/${courseId}/${nextLesson.id}`);
                  }
                }}>
                  <Play className="h-4 w-4 mr-2" />
                  {course.progress === 0 ? 'Start Course' : 'Continue Learning'}
                </Button>
                <Button variant="outline" className="w-full">
                  Download Materials
                </Button>
                <Button variant="outline" className="w-full">
                  Course Discussion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;