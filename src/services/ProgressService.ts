import { mockCourses, Course } from '@/data/courses';

export interface ProgressData {
  courseId: string;
  lessonId: string;
  completed: boolean;
  lastWatched: number;
  quizScore?: number;
  quizCompleted?: boolean;
}

export interface QuizResult {
  lessonId: string;
  score: number;
  totalQuestions: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    correct: boolean;
  }>;
  completedAt: Date;
}

class ProgressService {
  private static STORAGE_KEY = 'edustream_progress';
  private static QUIZ_RESULTS_KEY = 'edustream_quiz_results';
  
  private static getUserId(): string {
    const user = JSON.parse(localStorage.getItem('edustream_user') || 'null');
    return user?.id || 'anonymous';
  }
  
  private static getStorageKey(key: string): string {
    const userId = this.getUserId();
    return `${key}_${userId}`;
  }

  static getProgress(): ProgressData[] {
    const storageKey = this.getStorageKey(this.STORAGE_KEY);
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  }

  static saveProgress(progress: ProgressData): void {
    const storageKey = this.getStorageKey(this.STORAGE_KEY);
    const allProgress = this.getProgress();
    const existingIndex = allProgress.findIndex(
      p => p.courseId === progress.courseId && p.lessonId === progress.lessonId
    );

    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }

    localStorage.setItem(storageKey, JSON.stringify(allProgress));
  }

  static markLessonComplete(courseId: string, lessonId: string): void {
    this.saveProgress({
      courseId,
      lessonId,
      completed: true,
      lastWatched: Date.now()
    });
  }

  static updateVideoProgress(courseId: string, lessonId: string, lastWatched: number): void {
    const progress = this.getProgress().find(
      p => p.courseId === courseId && p.lessonId === lessonId
    );

    this.saveProgress({
      courseId,
      lessonId,
      completed: progress?.completed || false,
      lastWatched,
      quizScore: progress?.quizScore,
      quizCompleted: progress?.quizCompleted
    });
  }

  static getQuizResults(): QuizResult[] {
    const storageKey = this.getStorageKey(this.QUIZ_RESULTS_KEY);
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  }

  static saveQuizResult(result: QuizResult): void {
    const storageKey = this.getStorageKey(this.QUIZ_RESULTS_KEY);
    const results = this.getQuizResults();
    const existingIndex = results.findIndex(r => r.lessonId === result.lessonId);

    if (existingIndex >= 0) {
      results[existingIndex] = result;
    } else {
      results.push(result);
    }

    localStorage.setItem(storageKey, JSON.stringify(results));

    const progress = this.getProgress().find(
      p => p.lessonId === result.lessonId
    );

    if (progress) {
      this.saveProgress({
        ...progress,
        quizScore: result.score,
        quizCompleted: true
      });
    }
  }

  static getCourseProgress(courseId: string): number {
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return 0;

    const progress = this.getProgress();
    const completedLessons = course.lessons.filter(lesson => 
      progress.some(p => p.courseId === courseId && p.lessonId === lesson.id && p.completed)
    );

    return Math.round((completedLessons.length / course.lessons.length) * 100);
  }

  static getOverallStats() {
    const progress = this.getProgress();
    const quizResults = this.getQuizResults();
    
    const totalLessons = mockCourses.reduce((sum, course) => sum + course.lessons.length, 0);
    const completedLessons = progress.filter(p => p.completed).length;
    const totalQuizzes = quizResults.length;
    const avgQuizScore = quizResults.length > 0 
      ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
      : 0;

    return {
      totalLessons,
      completedLessons,
      totalQuizzes,
      avgQuizScore,
      completionRate: Math.round((completedLessons / totalLessons) * 100)
    };
  }
}

export default ProgressService;