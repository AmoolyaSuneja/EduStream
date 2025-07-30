import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressAnalytics from '@/components/ProgressAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Trophy, Calendar, Target, TrendingUp } from 'lucide-react';

const Progress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.avatar} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Learning Progress</h1>
              <p className="text-muted-foreground">Track your achievements and stay motivated on your learning journey</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate('/courses')}>
                Browse Courses
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Continue Learning
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Achievement Streak</p>
                  <p className="text-2xl font-bold">7 Days</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">This Week</p>
                  <p className="text-2xl font-bold">12 Hours</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Goals Met</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Overall Progress</p>
                  <p className="text-2xl font-bold">72%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Component */}
        <ProgressAnalytics />
      </div>
    </div>
  );
};

export default Progress; 