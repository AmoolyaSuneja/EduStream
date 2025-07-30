import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { mockCourses } from '@/data/courses';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, Play, BookOpen, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState(mockCourses);
  const [enrollmentDialog, setEnrollmentDialog] = useState<{ course: any; action: 'enroll' | 'withdraw' } | null>(null);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleEnrollmentAction = (course: any, action: 'enroll' | 'withdraw') => {
    setEnrollmentDialog({ course, action });
  };

  const confirmEnrollmentAction = () => {
    if (!enrollmentDialog) return;

    const { course, action } = enrollmentDialog;
    const updatedCourses = courses.map(c => {
      if (c.id === course.id) {
        const updatedCourse = { ...c, enrolled: action === 'enroll' };
        
        if (action === 'enroll') {
          addNotification({
            type: 'success',
            title: 'Successfully Enrolled',
            message: `You are now enrolled in "${course.title}". Start your learning journey!`,
            action: {
              label: 'Start Learning',
              onClick: () => navigate(`/course/${course.id}`)
            }
          });
        } else {
          addNotification({
            type: 'info',
            title: 'Course Withdrawn',
            message: `You have withdrawn from "${course.title}". You can re-enroll anytime.`
          });
        }

        return updatedCourse;
      }
      return c;
    });

    setCourses(updatedCourses);
    setEnrollmentDialog(null);

    toast({
      title: action === 'enroll' ? 'Enrolled successfully!' : 'Withdrawn successfully!',
      description: action === 'enroll' 
        ? `You can now access all content in ${course.title}`
        : `You can re-enroll in ${course.title} anytime`,
    });
  };

  const getEnrollmentButton = (course: any) => {
    if (course.enrolled) {
      return (
        <div className="flex space-x-2">
          <Button 
            className="flex-1"
            variant="default"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <Play className="h-4 w-4 mr-2" />
            Continue
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleEnrollmentAction(course, 'withdraw')}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      return (
        <Button 
          className="w-full"
          onClick={() => handleEnrollmentAction(course, 'enroll')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Enroll Now
        </Button>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
                EduStream
              </h1>
              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button variant="default">Courses</Button>
                <Button variant="ghost">Progress</Button>
                <Button variant="ghost" onClick={() => navigate('/profile')}>Profile</Button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">All Courses</h2>
          <p className="text-muted-foreground">Explore our comprehensive course catalog</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-elegant transition-all duration-300 cursor-pointer group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                </div>
                {course.enrolled && (
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-primary text-primary-foreground flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Enrolled</span>
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {course.enrolled && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                {getEnrollmentButton(course)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enrollment Confirmation Dialog */}
        <Dialog open={!!enrollmentDialog} onOpenChange={() => setEnrollmentDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {enrollmentDialog?.action === 'enroll' ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Confirm Enrollment</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span>Confirm Withdrawal</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {enrollmentDialog?.action === 'enroll' 
                  ? `Are you sure you want to enroll in "${enrollmentDialog?.course.title}"? You'll have access to all lessons and quizzes.`
                  : `Are you sure you want to withdraw from "${enrollmentDialog?.course.title}"? Your progress will be saved but you won't have access to new content.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEnrollmentDialog(null)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmEnrollmentAction}
                variant={enrollmentDialog?.action === 'enroll' ? 'default' : 'destructive'}
              >
                {enrollmentDialog?.action === 'enroll' ? 'Enroll' : 'Withdraw'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Courses;