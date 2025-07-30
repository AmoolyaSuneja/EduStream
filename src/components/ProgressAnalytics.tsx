import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { mockCourses } from '@/data/courses';
import ProgressService from '@/services/ProgressService';
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  Trophy, 
  Clock, 
  BookOpen, 
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

const ProgressAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');

  const progress = ProgressService.getProgress();
  const quizResults = ProgressService.getQuizResults();
  const overallStats = ProgressService.getOverallStats();

  const courseAnalytics = mockCourses.map(course => {
    const courseProgress = ProgressService.getCourseProgress(course.id);
    const courseLessons = course.lessons.length;
    const completedLessons = progress.filter(p => 
      p.courseId === course.id && p.completed
    ).length;
    
    const courseQuizzes = quizResults.filter(q => 
      course.lessons.some(lesson => lesson.id === q.lessonId)
    );
    const avgQuizScore = courseQuizzes.length > 0 
      ? Math.round(courseQuizzes.reduce((sum, q) => sum + q.score, 0) / courseQuizzes.length)
      : 0;

    return {
      id: course.id,
      title: course.title,
      progress: courseProgress,
      completedLessons,
      totalLessons: courseLessons,
      avgQuizScore,
      quizCount: courseQuizzes.length
    };
  });

  const generateTimeData = () => {
    const days = 7;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayProgress = Math.floor(Math.random() * 20) + 10;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        progress: dayProgress,
        lessons: Math.floor(Math.random() * 3) + 1,
        quizzes: Math.floor(Math.random() * 2)
      });
    }
    
    return data;
  };

  const timeData = generateTimeData();

  const quizPerformanceData = [
    { name: 'React Fundamentals', score: 85, attempts: 3 },
    { name: 'JavaScript ES6+', score: 92, attempts: 2 },
    { name: 'Web Development', score: 78, attempts: 4 }
  ];

  const learningPaceData = [
    { name: 'Fast', value: 30, color: '#10b981' },
    { name: 'Moderate', value: 45, color: '#f59e0b' },
    { name: 'Slow', value: 25, color: '#ef4444' }
  ];

  const handleDownloadReport = () => {
    const reportData = {
      overallStats,
      courseAnalytics,
      quizResults,
      generatedAt: new Date().toISOString()
    };
    
    // Create downloadable report
    const reportContent = generateReportContent(reportData);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edustream-progress-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = (data: any) => {
    let content = 'EDUSTREAM LEARNING PROGRESS REPORT\n';
    content += '=====================================\n\n';
    content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    content += 'OVERALL STATISTICS\n';
    content += '------------------\n';
    content += `Total Lessons: ${data.overallStats.totalLessons}\n`;
    content += `Completed Lessons: ${data.overallStats.completedLessons}\n`;
    content += `Completion Rate: ${data.overallStats.completionRate}%\n`;
    content += `Total Quizzes: ${data.overallStats.totalQuizzes}\n`;
    content += `Average Quiz Score: ${data.overallStats.avgQuizScore}%\n\n`;
    
    content += 'COURSE PROGRESS\n';
    content += '---------------\n';
    data.courseAnalytics.forEach((course: any) => {
      content += `${course.title}\n`;
      content += `  Progress: ${course.progress}%\n`;
      content += `  Completed Lessons: ${course.completedLessons}/${course.totalLessons}\n`;
      content += `  Average Quiz Score: ${course.avgQuizScore}%\n\n`;
    });
    
    content += 'QUIZ PERFORMANCE\n';
    content += '----------------\n';
    data.quizResults.forEach((quiz: any) => {
      content += `Lesson Quiz: ${quiz.score}% (${quiz.totalQuestions} questions)\n`;
      content += `Completed: ${new Date(quiz.completedAt).toLocaleDateString()}\n\n`;
    });
    
    return content;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Progress Analytics</h2>
          <p className="text-muted-foreground">Track your learning journey with detailed insights</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TOTAL PROGRESS</p>
                <p className="text-3xl font-bold text-primary">{overallStats.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <Progress value={overallStats.completionRate} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">LESSONS COMPLETED</p>
                <p className="text-3xl font-bold text-primary">{overallStats.completedLessons}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Out of {overallStats.totalLessons} total lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AVG QUIZ SCORE</p>
                <p className="text-3xl font-bold text-primary">{overallStats.avgQuizScore}%</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {overallStats.totalQuizzes} quizzes taken
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">STREAK</p>
                <p className="text-3xl font-bold text-primary">7 days</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progress Trends</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Quiz Performance</span>
          </TabsTrigger>
          <TabsTrigger value="pace" className="flex items-center space-x-2">
            <PieChartIcon className="h-4 w-4" />
            <span>Learning Pace</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseAnalytics.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{course.title}</span>
                        <Badge variant="secondary">{course.progress}%</Badge>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>Quiz avg: {course.avgQuizScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={2} name="Daily Progress" />
                  <Line type="monotone" dataKey="lessons" stroke="#82ca9d" strokeWidth={2} name="Lessons Completed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance by Course</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={quizPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" name="Quiz Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Pace Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={learningPaceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {learningPaceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressAnalytics; 