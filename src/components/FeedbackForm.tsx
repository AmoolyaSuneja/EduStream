import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { Send, MessageSquare, Bug, Lightbulb, Star } from 'lucide-react';

interface FeedbackFormProps {
  onClose?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    type: 'suggestion',
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    contactEmail: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Star },
    { value: 'general', label: 'General Feedback', icon: MessageSquare }
  ];

  const categories = [
    'User Interface',
    'Course Content',
    'Video Player',
    'Quiz System',
    'Progress Tracking',
    'Performance',
    'Mobile Experience',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      addNotification({
        type: 'success',
        title: 'Feedback Submitted',
        message: 'Thank you for your feedback! We\'ll review it and get back to you soon.'
      });

      setFormData({
        type: 'suggestion',
        category: '',
        subject: '',
        description: '',
        priority: 'medium',
        contactEmail: ''
      });

      toast({
        title: 'Feedback submitted successfully',
        description: 'We appreciate your input and will review it shortly.',
      });

      onClose?.();
    } catch (error) {
      toast({
        title: 'Error submitting feedback',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Send Feedback</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Feedback Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              className="grid grid-cols-2 gap-4"
            >
              {feedbackTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value} className="flex items-center space-x-2 cursor-pointer">
                      <IconComponent className="h-4 w-4" />
                      <span>{type.label}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of your feedback"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Please provide detailed information about your feedback..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Priority</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => handleInputChange('priority', value)}
              className="grid grid-cols-4 gap-4"
            >
              {priorities.map((priority) => (
                <div key={priority.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={priority.value} id={priority.value} />
                  <Label htmlFor={priority.value} className={`cursor-pointer ${priority.color}`}>
                    {priority.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="your.email@example.com"
            />
            <p className="text-sm text-muted-foreground">
              We'll use this to follow up on your feedback if needed.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm; 