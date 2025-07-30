export interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  completed: boolean;
  content: {
    description: string;
    keyPoints: string[];
    transcript?: string;
  };
  quiz?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  progress: number;
  lessons: Lesson[];
  enrolled: boolean;
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Master the fundamentals of React including components, props, state, and modern hooks. Build real-world applications with confidence.',
    instructor: 'Sarah Johnson',
    duration: '8 hours',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    progress: 75,
    enrolled: true,
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to React',
        duration: 15,
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8', // React Crash Course 2021 by Traversy Media
        completed: true,
        content: {
          description: 'Welcome to React! In this lesson, we\'ll explore what React is, why it\'s popular, and how it revolutionizes web development.',
          keyPoints: [
            'React is a JavaScript library for building user interfaces',
            'Virtual DOM makes React applications fast and efficient',
            'Component-based architecture promotes reusability',
            'React is maintained by Facebook and has huge community support'
          ],
          transcript: 'React is a powerful JavaScript library that has transformed how we build user interfaces...'
        },
        quiz: {
          questions: [
            {
              id: 'q1-1',
              question: 'What is React primarily used for?',
              options: ['Building user interfaces', 'Server-side programming', 'Database management', 'Mobile app testing'],
              correctAnswer: 0,
              explanation: 'React is a JavaScript library specifically designed for building user interfaces for web applications.'
            },
            {
              id: 'q1-2',
              question: 'What makes React applications fast?',
              options: ['TypeScript', 'Virtual DOM', 'CSS-in-JS', 'Redux'],
              correctAnswer: 1,
              explanation: 'The Virtual DOM allows React to efficiently update the actual DOM by calculating the minimum changes needed.'
            }
          ]
        }
      },
      {
        id: '1-2',
        title: 'Components and JSX',
        duration: 20,
        videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', // React Components & JSX - freeCodeCamp
        completed: true,
        content: {
          description: 'Learn about React components and JSX syntax. Understand how to create reusable UI elements and write JSX effectively.',
          keyPoints: [
            'Components are the building blocks of React applications',
            'JSX allows you to write HTML-like syntax in JavaScript',
            'Functional components are the modern way to write components',
            'Props allow data to flow between components'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q2-1',
              question: 'What does JSX stand for?',
              options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
              correctAnswer: 0,
              explanation: 'JSX stands for JavaScript XML, allowing you to write HTML-like syntax in JavaScript.'
            },
            {
              id: 'q2-2',
              question: 'How do you pass data to a component?',
              options: ['State', 'Props', 'Context', 'Refs'],
              correctAnswer: 1,
              explanation: 'Props (properties) are used to pass data from parent components to child components.'
            }
          ]
        }
      },
      {
        id: '1-3',
        title: 'Props and State',
        duration: 25,
        videoUrl: 'https://www.youtube.com/embed/35lXWvCuM8o', // React Props & State - Academind
        completed: false,
        content: {
          description: 'Dive deep into props and state - the core concepts for data management in React components.',
          keyPoints: [
            'Props are read-only data passed from parent to child',
            'State is mutable data managed within a component',
            'useState hook manages state in functional components',
            'State updates trigger component re-renders'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q3-1',
              question: 'Can you modify props inside a component?',
              options: ['Yes, always', 'No, props are read-only', 'Only with special methods', 'Only in class components'],
              correctAnswer: 1,
              explanation: 'Props are read-only and should never be modified within the component that receives them.'
            },
            {
              id: 'q3-2',
              question: 'What is the main difference between props and state?',
              options: ['Props are mutable, state is immutable', 'Props are read-only, state is mutable', 'Props are for styling, state is for data', 'There is no difference'],
              correctAnswer: 1,
              explanation: 'Props are read-only data passed from parent to child, while state is mutable data managed within a component.'
            }
          ]
        }
      },
      {
        id: '1-4',
        title: 'React useEffect Hook',
        duration: 18,
        videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U', // React useEffect Hook - Dave Gray
        completed: false,
        content: {
          description: 'Understand the useEffect hook for side effects in React components.',
          keyPoints: [
            'useEffect runs after render',
            'Can be used for data fetching, subscriptions, or manually changing the DOM',
            'Cleanup functions prevent memory leaks',
            'Dependency array controls when effect runs'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q4-1',
              question: 'What does useEffect do?',
              options: ['Manages state', 'Handles side effects', 'Renders JSX', 'Handles events'],
              correctAnswer: 1,
              explanation: 'useEffect is used to handle side effects in React components.'
            },
            {
              id: 'q4-2',
              question: 'When does useEffect run?',
              options: ['Before render', 'After render', 'During render', 'Never'],
              correctAnswer: 1,
              explanation: 'useEffect runs after the component has been rendered to the DOM.'
            }
          ]
        }
      }
    ]
  },
  {
    id: '2',
    title: 'JavaScript ES6+',
    description: 'Master modern JavaScript features including arrow functions, destructuring, promises, and async/await.',
    instructor: 'Mike Chen',
    duration: '6 hours',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    progress: 60,
    enrolled: true,
    lessons: [
      {
        id: '2-1',
        title: 'Arrow Functions',
        duration: 12,
        videoUrl: 'https://www.youtube.com/embed/h33Srr5J9nY', // JavaScript Arrow Functions - Web Dev Simplified
        completed: true,
        content: {
          description: 'Learn about arrow functions - a concise way to write functions in modern JavaScript.',
          keyPoints: [
            'Arrow functions provide shorter syntax for writing functions',
            'They have lexical this binding',
            'Cannot be used as constructors',
            'Ideal for callbacks and array methods'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q4-1',
              question: 'Which syntax represents an arrow function?',
              options: ['function() {}', '() => {}', 'function => {}', '=> function {}'],
              correctAnswer: 1,
              explanation: 'Arrow functions use the => syntax, like () => {} for a function with no parameters.'
            },
            {
              id: 'q4-2',
              question: 'What is the main advantage of arrow functions?',
              options: ['Shorter syntax', 'Better performance', 'More features', 'Different syntax'],
              correctAnswer: 0,
              explanation: 'Arrow functions provide a more concise syntax for writing functions.'
            }
          ]
        }
      },
      {
        id: '2-2',
        title: 'Destructuring Assignment',
        duration: 18,
        videoUrl: 'https://www.youtube.com/embed/NIq3qLaHCIs', // JavaScript Destructuring - Academind
        completed: false,
        content: {
          description: 'Master destructuring assignment to extract values from arrays and objects in an elegant way.',
          keyPoints: [
            'Destructuring extracts values from arrays and objects',
            'Can provide default values for missing properties',
            'Works with nested objects and arrays',
            'Commonly used in function parameters'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q5-1',
              question: 'What does const {name, age} = person; do?',
              options: [
                'Creates a new object', 
                'Extracts name and age properties from person', 
                'Assigns person to name and age', 
                'Creates an array'
              ],
              correctAnswer: 1,
              explanation: 'This destructuring syntax extracts the name and age properties from the person object into separate variables.'
            },
            {
              id: 'q5-2',
              question: 'How do you provide a default value in destructuring?',
              options: [
                'const {name || "default"} = obj',
                'const {name = "default"} = obj',
                'const {name: "default"} = obj',
                'const {name ?? "default"} = obj'
              ],
              correctAnswer: 1,
              explanation: 'Use the = operator to provide default values in destructuring: {name = "default"}'
            }
          ]
        }
      },
      {
        id: '2-3',
        title: 'Promises and Async/Await',
        duration: 22,
        videoUrl: 'https://www.youtube.com/embed/DHvZLI7Db8E', // JavaScript Promises & Async/Await - Fireship
        completed: false,
        content: {
          description: 'Learn how to handle asynchronous operations in JavaScript using Promises and async/await.',
          keyPoints: [
            'Promises represent eventual completion or failure of async operations',
            'async/await simplifies working with Promises',
            'Error handling with try/catch',
            'Chaining Promises for sequential async tasks'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q6-1',
              question: 'What does async/await help with?',
              options: ['Synchronous code', 'Asynchronous code', 'Styling', 'DOM manipulation'],
              correctAnswer: 1,
              explanation: 'async/await is used to write cleaner asynchronous code in JavaScript.'
            },
            {
              id: 'q6-2',
              question: 'What does the async keyword do?',
              options: ['Makes a function synchronous', 'Makes a function return a Promise', 'Makes a function faster', 'Makes a function smaller'],
              correctAnswer: 1,
              explanation: 'The async keyword makes a function return a Promise automatically.'
            },
            {
              id: 'q6-2',
              question: 'What is the main benefit of using async/await?',
              options: ['Better performance', 'Cleaner code syntax', 'More features', 'Different syntax'],
              correctAnswer: 1,
              explanation: 'async/await provides cleaner, more readable syntax for handling asynchronous operations.'
            }
          ]
        }
      }
    ]
  },
  {
    id: '3',
    title: 'Web Development Bootcamp',
    description: 'Complete web development course covering HTML5, CSS3, and modern JavaScript with real projects.',
    instructor: 'Emma Davis',
    duration: '12 hours',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    progress: 85,
    enrolled: true,
    lessons: [
      {
        id: '3-1',
        title: 'HTML5 Semantic Elements',
        duration: 30,
        videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', // HTML5 Semantic Elements - Traversy Media
        completed: true,
        content: {
          description: 'Learn about HTML5 semantic elements and how they improve accessibility and SEO.',
          keyPoints: [
            'Semantic elements provide meaning to content',
            'Improves accessibility for screen readers',
            'Better SEO optimization',
            'Cleaner, more maintainable code structure'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q6-1',
              question: 'Which is a semantic HTML5 element?',
              options: ['<div>', '<span>', '<article>', '<b>'],
              correctAnswer: 2,
              explanation: '<article> is a semantic element that represents a standalone piece of content.'
            }
          ]
        }
      },
      {
        id: '3-2',
        title: 'CSS3 Flexbox & Grid',
        duration: 35,
        videoUrl: 'https://www.youtube.com/embed/JJSoEo8JSnc', // CSS Flexbox & Grid - freeCodeCamp
        completed: false,
        content: {
          description: 'Master modern CSS layout techniques with Flexbox and Grid.',
          keyPoints: [
            'Flexbox is for one-dimensional layouts',
            'Grid is for two-dimensional layouts',
            'Responsive design with media queries',
            'Practical layout examples'
          ]
        },
        quiz: {
          questions: [
            {
              id: 'q7-1',
              question: 'Which CSS module is best for two-dimensional layouts?',
              options: ['Flexbox', 'Grid', 'Float', 'Inline-block'],
              correctAnswer: 1,
              explanation: 'CSS Grid is designed for two-dimensional layouts.'
            },
            {
              id: 'q7-2',
              question: 'What is the main difference between Flexbox and Grid?',
              options: ['Grid is newer', 'Flexbox is one-dimensional, Grid is two-dimensional', 'Grid is faster', 'Flexbox is more flexible'],
              correctAnswer: 1,
              explanation: 'Flexbox is designed for one-dimensional layouts (row or column), while Grid is designed for two-dimensional layouts (rows and columns).'
            }
          ]
        }
      }
    ]
  }
];