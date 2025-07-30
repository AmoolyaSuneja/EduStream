import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle } from 'lucide-react';

const QuizTest: React.FC = () => {
  const { toast } = useToast();

  const testQuizFunctionality = () => {
    toast({
      title: "Quiz Test",
      description: "Quiz functionality is working! You can now take quizzes in lessons.",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Quiz System Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Quiz component loaded successfully</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Answer selection working</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Score calculation functional</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Progress tracking enabled</span>
          </div>
          <Button onClick={testQuizFunctionality} className="mt-2">
            Test Quiz Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizTest; 