import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FeedbackForm from '@/components/FeedbackForm';
import { ArrowLeft } from 'lucide-react';

const Feedback = () => {
  const navigate = useNavigate();

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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Send Feedback</h1>
          <p className="text-muted-foreground">
            Help us improve EduStream by sharing your thoughts, suggestions, or reporting issues
          </p>
        </div>

        {/* Feedback Form */}
        <FeedbackForm onClose={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default Feedback; 