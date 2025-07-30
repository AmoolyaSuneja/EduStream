import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { mockCourses } from '@/data/courses';
import ProgressService from '@/services/ProgressService';
import NotificationBell from '@/components/NotificationBell';
import { BookOpen, Clock, Trophy, TrendingUp, LogOut, Play, BarChart3, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalQuizzes: 0,
    avgQuizScore: 0,
    completionRate: 0
  });

  useEffect(() => {
    const overallStats = ProgressService.getOverallStats();
    setStats(overallStats);
  }, []);

  const enrolledCourses = mockCourses.filter(course => course.enrolled);
  const totalCourses = enrolledCourses.length;
  
  const coursesWithProgress = enrolledCourses.map(course => ({
    ...course,
    realProgress: ProgressService.getCourseProgress(course.id)
  }));
  
  const completedCourses = coursesWithProgress.filter(course => course.realProgress === 100).length;
  const inProgressCourses = coursesWithProgress.filter(course => course.realProgress > 0 && course.realProgress < 100).length;
  const totalHours = Math.round(stats.completedLessons * 0.5);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const progressData = coursesWithProgress.slice(0, 3).map(course => ({
    id: course.id,
    name: course.title,
    progress: course.realProgress
  }));

  const getNextLesson = () => {
    for (const course of coursesWithProgress) {
      const progress = ProgressService.getProgress();
      const nextLesson = course.lessons.find(lesson => 
        !progress.some(p => p.courseId === course.id && p.lessonId === lesson.id && p.completed)
      );
      if (nextLesson) {
        return { course, lesson: nextLesson };
      }
    }
    return null;
  };

  const nextLessonInfo = getNextLesson();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary">EduStream</h1>
              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button variant="ghost" onClick={() => navigate('/courses')}>Courses</Button>
                <Button variant="ghost" onClick={() => navigate('/progress')}>Progress</Button>
                <Button variant="ghost" onClick={() => navigate('/profile')}>Profile</Button>
                <Button variant="ghost" onClick={() => navigate('/feedback')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <Avatar>
                <AvatarImage src={user?.avatar} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block font-medium">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-hero text-white border-0 shadow-elegant">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-white/90">Continue your learning journey with our latest courses</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">TOTAL COURSES</p>
                  <p className="text-3xl font-bold text-primary">{totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">COMPLETED</p>
                  <p className="text-3xl font-bold text-primary">{completedCourses}</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IN PROGRESS</p>
                  <p className="text-3xl font-bold text-primary">{inProgressCourses}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">HOURS LEARNED</p>
                  <p className="text-3xl font-bold text-primary">{totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {nextLessonInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{nextLessonInfo.lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">{nextLessonInfo.course.title}</p>
                  </div>
                  <Button onClick={() => navigate(`/lesson/${nextLessonInfo.course.id}/${nextLessonInfo.lesson.id}`)}>
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>View Detailed Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Analytics & Insights</h3>
                  <p className="text-sm text-muted-foreground">Track your learning journey with detailed analytics</p>
                </div>
                <Button onClick={() => navigate('/progress')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {progressData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-primary"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={`${item.progress}, 100`}
                        strokeLinecap="round"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{item.progress}%</span>
                    </div>
                  </div>
                  <p className="font-medium">{item.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;