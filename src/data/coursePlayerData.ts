// Static mock data for the course player

export type LessonType = "reading" | "video" | "quiz" | "assignment";
export type LessonStatus = "completed" | "in_progress" | "failed" | "pending" | "locked";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration?: string; // e.g. "15:00 mins"
  status: LessonStatus;
  content?: string; // HTML / markdown content for reading
}

export interface Topic {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: "true_false" | "multiple_choice";
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: number;
  totalMarks: number;
  passingGrade: number; // percentage
  questionList: QuizQuestion[];
}

export interface Assignment {
  id: string;
  title: string;
  totalMarks: number;
  passingMarks: number;
  totalAttempts: number;
  duration: string;
  deadline: string;
  daysRemaining: number;
  description: string;
}

export interface CourseAnnouncement {
  id: string;
  title: string;
  date: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  isPinned?: boolean;
  commentsCount: number;
}

export interface LiveClass {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  instructorName: string;
  instructorAvatar?: string;
  platform: "Zoom" | "Google Meet" | "Teams";
  joinUrl: string;
  status: "upcoming" | "live" | "completed";
  recordingUrl?: string;
  agenda?: string[];
}

export interface GradeItem {
  id: string;
  title: string;
  type: "quiz" | "assignment";
  dueDate?: string;
  maxMarks: number;
  passMarks: number;
  earnedMarks?: number;
  status: "passed" | "failed" | "pending" | "not_attempted";
  submittedDate?: string;
}

export interface CourseInfoData {
  lastUpdated: string;
  author: string;
  authorInitial?: string;
  about: string;
  whatYoullLearn: string[];
  instructors: { name: string; initial: string; role?: string }[];
  categories: string;
  level: string;
  rating: number;
  resourcesCount: string;
  materials: string[];
  requirements: string[];
  audience: string[];
  certificate: string;
  featuredImage?: string;
}

export interface CoursePlayerData {
  slug: string;
  title: string;
  percentCompleted: number;
  totalLessons: number;
  completedLessons: number;
  topics: Topic[];
  quizzes: Record<string, Quiz>;
  assignments: Record<string, Assignment>;
  resources: { name: string; url: string; size?: string; type?: string }[];
  announcements?: CourseAnnouncement[];
  liveClasses?: LiveClass[];
  gradebook?: GradeItem[];
  courseInfo?: CourseInfoData;
}

const nutritionCourse: CoursePlayerData = {
  slug: "nutrition-fundamentals",
  title: "Secret Tips Behind Perfect Diet & Meal Plan",
  percentCompleted: 0,
  totalLessons: 8,
  completedLessons: 0,
  topics: [
    {
      id: "topic-1",
      title: "Nutrition Fundamentals",
      completed: false,
      lessons: [
        {
          id: "lesson-1-1",
          title: "The Building Blocks of a Healthy Diet",
          type: "reading",
          status: "in_progress",
          content: `
<p class="leading-relaxed text-gray-700">Many people believe healthy eating is about eliminating certain foods, but effective nutrition starts with understanding the fundamentals.</p>

<p class="leading-relaxed text-gray-700 mt-3">The body requires energy, measured in calories, to perform daily activities and maintain essential functions.</p>

<p class="leading-relaxed mt-3">Calories come from <span class="text-orange-500">three primary macronutrients:</span></p>

<h2 class="text-xl font-bold mt-6 mb-2">Protein</h2>
<p class="leading-relaxed">Protein helps build and repair tissues, supports muscle growth, and contributes to satiety.</p>
<ul class="list-disc ml-5 mt-2 space-y-1 text-sm">
  <li>Chicken</li>
  <li>Fish</li>
  <li>Eggs</li>
  <li>Dairy products</li>
  <li>Beans and legumes</li>
</ul>

<h2 class="text-xl font-bold mt-6 mb-2">Carbohydrates</h2>
<p class="leading-relaxed">Carbohydrates provide the body's preferred source of energy.</p>
<ul class="list-disc ml-5 mt-2 space-y-1 text-sm">
  <li>Rice</li>
  <li>Potatoes</li>
  <li>Oats</li>
  <li>Fruits</li>
  <li>Vegetables</li>
</ul>

<h2 class="text-xl font-bold mt-6 mb-2">Fats</h2>
<p class="leading-relaxed">Healthy fats support hormone production, brain function, and nutrient absorption.</p>
<ul class="list-disc ml-5 mt-2 space-y-1 text-sm">
  <li>Nuts</li>
  <li>Seeds</li>
  <li>Olive oil</li>
  <li>Avocados</li>
  <li>Fatty fish</li>
</ul>
          `,
        },
      ],
    },
    {
      id: "topic-2",
      title: "Building the Perfect Meal Plan",
      completed: false,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Meal Planning Strategies That Actually Work",
          type: "reading",
          status: "locked",
          content: `<p>Effective meal planning starts with understanding your calorie needs and macronutrient targets.</p>`,
        },
        {
          id: "lesson-2-2",
          title: "Meal Planning & Nutrition Assessment",
          type: "quiz",
          status: "locked",
        },
      ],
    },
    {
      id: "topic-3",
      title: "Long-Term Success & Common Di...",
      completed: false,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Sustainable Eating Habits for Life",
          type: "reading",
          status: "locked",
          content: `<p>Sustainable eating is about finding balance that works long-term.</p>`,
        },
        {
          id: "lesson-3-2",
          title: "Create Your Personal 7-Day Meal Plan",
          type: "assignment",
          status: "failed",
        },
      ],
    },
  ],
  quizzes: {
    "lesson-2-2": {
      id: "lesson-2-2",
      title: "Meal Planning & Nutrition Assessment",
      questions: 3,
      totalMarks: 3,
      passingGrade: 80,
      questionList: [
        {
          id: "q1",
          text: "Protein helps build and repair body tissues.",
          type: "true_false",
          options: ["True", "False"],
          correctIndex: 0,
        },
        {
          id: "q2",
          text: "Carbohydrates are the body's preferred source of energy.",
          type: "true_false",
          options: ["True", "False"],
          correctIndex: 0,
        },
        {
          id: "q3",
          text: "Which of the following is a healthy fat source?",
          type: "multiple_choice",
          options: ["White sugar", "Avocado", "Refined flour", "Soda"],
          correctIndex: 1,
        },
      ],
    },
  },
  assignments: {
    "lesson-3-2": {
      id: "lesson-3-2",
      title: "Create Your Personal 7-Day Meal Plan",
      totalMarks: 15,
      passingMarks: 8,
      totalAttempts: 6,
      duration: "7 day",
      deadline: "Expired",
      daysRemaining: 0,
      description:
        "Using the principles learned throughout this course, create a practical 7-day meal plan tailored to your goals.",
    },
  },
  resources: [
    { name: "Meal Planning Template.pdf", url: "#", size: "1.2 MB", type: "PDF" },
    { name: "Macronutrient Calculator Cheat Sheet.xlsx", url: "#", size: "840 KB", type: "XLSX" },
    { name: "Healthy Grocery Shopping List.pdf", url: "#", size: "650 KB", type: "PDF" },
  ],
  announcements: [
    {
      id: "ann-1",
      title: "Welcome to Secret Tips Behind Perfect Diet & Meal Plan!",
      date: "September 10, 2026",
      authorName: "Sarah Jenkins, RD",
      authorRole: "Lead Nutritionist",
      content: "Hello everyone and welcome! In this course, we'll strip away the fad diet myths and build sustainable, science-backed nutritional routines. Please explore Module 1 and introduce yourself in the discussion tab!",
      isPinned: true,
      commentsCount: 4,
    },
    {
      id: "ann-2",
      title: "Live Q&A Session Scheduled for Friday",
      date: "September 12, 2026",
      authorName: "Sarah Jenkins, RD",
      authorRole: "Lead Nutritionist",
      content: "Join us this Friday at 4:00 PM EST for our live macro-counting workshop and interactive Q&A. Bring your questions about portion sizing and meal prep hacks!",
      commentsCount: 9,
    },
  ],
  liveClasses: [
    {
      id: "live-1",
      title: "Macro-Counting & Meal Prep Hands-on Workshop",
      date: "Friday, Sep 18, 2026",
      time: "4:00 PM - 5:00 PM EST",
      duration: "60 mins",
      instructorName: "Sarah Jenkins, RD",
      platform: "Zoom",
      joinUrl: "https://zoom.us/j/demo-nutrition",
      status: "upcoming",
      agenda: [
        "How to accurately estimate portions without a scale",
        "Prep once, eat for 4 days strategy",
        "Q&A and real-time meal plan reviews",
      ],
    },
    {
      id: "live-2",
      title: "Dietary Myths Debunked: Keto vs Intermittent Fasting",
      date: "Monday, Sep 8, 2026",
      time: "3:00 PM - 4:15 PM EST",
      duration: "75 mins",
      instructorName: "Sarah Jenkins, RD",
      platform: "Zoom",
      joinUrl: "#",
      status: "completed",
      recordingUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      agenda: [
        "Analyzing insulin response and fat oxidation",
        "Who benefits from caloric restriction windows",
        "Audience Q&A highlights",
      ],
    },
  ],
  gradebook: [
    {
      id: "grade-1",
      title: "Meal Planning & Nutrition Assessment",
      type: "quiz",
      maxMarks: 3,
      passMarks: 2,
      earnedMarks: 3,
      status: "passed",
      submittedDate: "Sep 11, 2026",
    },
    {
      id: "grade-2",
      title: "Create Your Personal 7-Day Meal Plan",
      type: "assignment",
      maxMarks: 10,
      passMarks: 6,
      earnedMarks: undefined,
      status: "pending",
      dueDate: "Sep 19, 2026",
    },
  ],
};

const freelanceCourse: CoursePlayerData = {
  slug: "freelance-business-launchpad",
  title: "Freelance Business Launchpad",
  percentCompleted: 17,
  totalLessons: 6,
  completedLessons: 1,
  topics: [
    {
      id: "topic-1",
      title: "Topic 1: Getting Started as a Freelancer",
      completed: false,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Lesson 1: Choosing Your Niche & Positioning Yourself",
          type: "reading",
          status: "completed",
          content: `<p>Choosing a niche is the first and most important step to a successful freelance career.</p>`,
        },
        {
          id: "lesson-1-2",
          title: "Lesson 2: Building a Portfolio with No Experience",
          type: "reading",
          status: "completed",
          content: `<p>You can build a strong portfolio even without paid clients by doing spec work and personal projects.</p>`,
        },
        {
          id: "lesson-1-3",
          title: "Freelance Fundamentals",
          type: "quiz",
          status: "failed",
        },
        {
          id: "lesson-1-4",
          title: "Build Your Freelance Foundation",
          type: "assignment",
          status: "pending",
        },
      ],
    },
    {
      id: "topic-2",
      title: "Topic 2: Finding & Closing Clients",
      completed: false,
      lessons: [
        {
          id: "lesson-2-1",
          title: "How to Find Your First Client",
          type: "reading",
          status: "locked",
          content: `<p>Finding clients requires a systematic outreach strategy combined with a strong portfolio.</p>`,
        },
        {
          id: "lesson-2-2",
          title: "Closing the Deal: Proposals & Contracts",
          type: "reading",
          status: "locked",
          content: `<p>A professional proposal increases your chances of winning projects significantly.</p>`,
        },
      ],
    },
  ],
  quizzes: {
    "lesson-1-3": {
      id: "lesson-1-3",
      title: "Freelance Fundamentals",
      questions: 3,
      totalMarks: 3,
      passingGrade: 80,
      questionList: [
        {
          id: "q1",
          text: "Freelancers should define clear deliverables before starting a project.",
          type: "true_false",
          options: ["True", "False"],
          correctIndex: 0,
        },
        {
          id: "q2",
          text: "It is acceptable to miss client deadlines without prior communication.",
          type: "true_false",
          options: ["True", "False"],
          correctIndex: 1,
        },
        {
          id: "q3",
          text: "Which platform is commonly used by freelancers to find clients?",
          type: "multiple_choice",
          options: ["Netflix", "Upwork", "Spotify", "Discord"],
          correctIndex: 1,
        },
      ],
    },
  },
  assignments: {
    "lesson-1-4": {
      id: "lesson-1-4",
      title: "Build Your Freelance Foundation",
      totalMarks: 10,
      passingMarks: 6,
      totalAttempts: 6,
      duration: "7 Days",
      deadline: "September 19, 2026 11:03 am",
      daysRemaining: 7,
      description:
        'Complete three tasks: (1) Write a 100-word freelancer bio targeting a specific niche. (2) Draft a short proposal (max 300 words) for a fictional client brief: "We\'re a small bakery looking for someone to manage our Instagram account and create 12 posts per month." (3) Set a pricing structure for one service — list your hourly rate, project rate, and what\'s included. Submit as a single document.',
    },
  },
  resources: [],
  announcements: [
    {
      id: "ann-fl-1",
      title: "Contract Templates Available for Download",
      date: "September 7, 2026",
      authorName: "Marcus Vance",
      authorRole: "Freelance Consultant",
      content: "Make sure you check out the contract clauses discussion in Topic 2 before signing your first client agreement.",
      isPinned: false,
      commentsCount: 3,
    },
  ],
  liveClasses: [
    {
      id: "live-fl-1",
      title: "Client Cold Pitching & Negotiation Live Clinic",
      date: "Monday, Sep 21, 2026",
      time: "2:00 PM - 3:30 PM EST",
      duration: "90 mins",
      instructorName: "Marcus Vance",
      platform: "Zoom",
      joinUrl: "https://zoom.us/j/demo-freelance",
      status: "upcoming",
      agenda: [
        "Reviewing student cold pitch emails live on screen",
        "How to handle price objections smoothly",
        "Contracts: payment terms, retainers, and scope creep",
      ],
    },
  ],
  gradebook: [
    {
      id: "grade-fl-1",
      title: "Freelance Fundamentals Quiz",
      type: "quiz",
      maxMarks: 3,
      passMarks: 2,
      earnedMarks: 1,
      status: "failed",
      submittedDate: "Sep 11, 2026",
    },
    {
      id: "grade-fl-2",
      title: "Build Your Freelance Foundation",
      type: "assignment",
      maxMarks: 10,
      passMarks: 6,
      earnedMarks: undefined,
      status: "pending",
      dueDate: "Sep 19, 2026",
    },
  ],
  courseInfo: {
    lastUpdated: "June 16, 2026 5:44 pm",
    author: "hesbonombati",
    authorInitial: "H",
    about:
      "Going freelance is more than just having a skill — it's knowing how to sell it, price it, and sustain it. This course walks you through finding your niche, landing your first clients, writing winning proposals, and running your business like a pro. Practical, no-fluff, and built for people who want to start earning on their own terms.",
    whatYoullLearn: [
      "Identify and validate a profitable freelance niche",
      "Build a portfolio even without prior client work",
      "Find and approach potential clients with confidence",
      "Write proposals that focus on client outcomes",
      "Set rates, write contracts, and manage payments professionally",
    ],
    instructors: [
      {
        name: "hesbonombati",
        initial: "H",
        role: "Instructor",
      },
    ],
    categories: "Business",
    level: "Beginner",
    rating: 0.0,
    resourcesCount: "0 Files",
    materials: [
      "Proposal template (Word doc)",
      "Freelance rate calculator (Google Sheets)",
      "Client onboarding checklist",
    ],
    requirements: [
      "No prior freelance experience needed",
      "Have a specific skill in mind before starting (writing, design, development, etc.)",
      "A LinkedIn profile is recommended but not required",
    ],
    audience: [
      "People looking to start freelancing from scratch",
      "Employed professionals wanting to build a side income",
      "Recent graduates exploring non-traditional career paths",
    ],
    certificate: "You will receive certificate on completion",
  },
};

const landscapeCourse: CoursePlayerData = {
  slug: "landscape-oil-painting",
  title: "Landscape Oil Painting Fundamentals",
  percentCompleted: 15,
  totalLessons: 10,
  completedLessons: 2,
  topics: [
    {
      id: "topic-1",
      title: "Course Intro",
      completed: true,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Welcome to the Course",
          type: "reading",
          status: "completed",
          content: `<p>Welcome to Landscape Oil Painting Fundamentals! In this course, you'll learn everything from basic brush techniques to creating breathtaking landscape compositions.</p>`,
        },
      ],
    },
    {
      id: "topic-2",
      title: "Color Theory Basics",
      completed: false,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Welcome to Interior Design F...",
          type: "reading",
          status: "completed",
          content: `<p>Color theory is the foundation of all visual art.</p>`,
        },
        {
          id: "lesson-2-2",
          title: "Explore the basic principles...",
          type: "reading",
          status: "in_progress",
          content: `<p>The color wheel helps artists understand relationships between colors.</p>`,
        },
        {
          id: "lesson-2-3",
          title: "Working with Color Palettes",
          type: "video",
          duration: "15:00 mins",
          status: "in_progress",
          content: `<p>In this video lesson, we explore creating harmonious color palettes for landscape paintings.</p>`,
        },
        {
          id: "lesson-2-4",
          title: "Understanding Texture and...",
          type: "video",
          duration: "01:09 mins",
          status: "completed",
          content: `<p>Texture adds depth and realism to paintings.</p>`,
        },
        {
          id: "lesson-2-5",
          title: "Applying Texture to Different...",
          type: "reading",
          status: "failed",
          content: `<p>Different surfaces require different texture techniques.</p>`,
        },
        {
          id: "lesson-2-6",
          title: "Learn how to apply textures t...",
          type: "video",
          duration: "05:02 mins",
          status: "locked",
          content: `<p>Advanced texture application techniques.</p>`,
        },
      ],
    },
  ],
  quizzes: {},
  assignments: {},
  resources: [],
};

export const coursePlayerData: Record<string, CoursePlayerData> = {
  "nutrition-fundamentals": nutritionCourse,
  "freelance-business-launchpad": freelanceCourse,
  "landscape-oil-painting": landscapeCourse,
  "data-science-foundations": {
    slug: "data-science-foundations",
    title: "Data Science Foundations",
    percentCompleted: 0,
    totalLessons: 48,
    completedLessons: 0,
    topics: [
      {
        id: "ds-topic-1",
        title: "Module 1: Python & Environment Setup",
        completed: false,
        lessons: [
          { id: "ds-1-1", title: "Installing Python, Anaconda & Jupyter Notebook", type: "reading", status: "in_progress", content: "<p>In this lesson, you'll set up your professional Python data science environment step by step.</p><h2 class='text-xl font-bold mt-6 mb-2'>What You'll Install</h2><ul class='list-disc ml-5 space-y-1 text-sm'><li>Python 3.11+</li><li>Anaconda Distribution</li><li>Jupyter Notebook / JupyterLab</li><li>VS Code with Python extension</li></ul>" },
          { id: "ds-1-2", title: "Python Refresher — Data Types, Loops, Functions", type: "reading", status: "locked", content: "<p>A fast-paced review of Python fundamentals with a data science focus.</p>" },
          { id: "ds-1-3", title: "Working with Files and Directories", type: "reading", status: "locked", content: "<p>Learn how to navigate the filesystem, read files, and write output using Python's built-in libraries.</p>" },
          { id: "ds-1-4", title: "Introduction to NumPy Arrays", type: "reading", status: "locked", content: "<p>NumPy is the foundation of scientific computing in Python. This lesson introduces arrays, indexing, and basic operations.</p>" },
          { id: "ds-1-5", title: "Python Fundamentals Check", type: "quiz", status: "locked" },
        ],
      },
      {
        id: "ds-topic-2",
        title: "Module 2: Data Wrangling with Pandas",
        completed: false,
        lessons: [
          { id: "ds-2-1", title: "Loading CSV, Excel, and JSON Files", type: "reading", status: "locked", content: "<p>Learn to import data from the most common file formats into Pandas DataFrames.</p>" },
          { id: "ds-2-2", title: "Filtering, Sorting, and Grouping Data", type: "reading", status: "locked", content: "<p>Master the core data manipulation operations you'll use in every analysis.</p>" },
          { id: "ds-2-3", title: "Handling Missing Values and Duplicates", type: "reading", status: "locked", content: "<p>Real-world data is messy. Learn how to detect and handle null values, NaN entries, and duplicate rows.</p>" },
          { id: "ds-2-4", title: "Merging and Reshaping DataFrames", type: "reading", status: "locked", content: "<p>Combine multiple datasets and pivot/melt DataFrames for analysis.</p>" },
          { id: "ds-2-5", title: "Clean a Messy Real-World Dataset", type: "assignment", status: "locked" },
        ],
      },
      {
        id: "ds-topic-3",
        title: "Module 3: Exploratory Data Analysis (EDA)",
        completed: false,
        lessons: [
          { id: "ds-3-1", title: "Descriptive Statistics Deep Dive", type: "reading", status: "locked", content: "<p>Mean, median, mode, variance, standard deviation — understand what they actually tell you.</p>" },
          { id: "ds-3-2", title: "Correlation and Covariance", type: "reading", status: "locked", content: "<p>Measure the relationships between variables using correlation matrices and scatter plots.</p>" },
          { id: "ds-3-3", title: "Outlier Detection Techniques", type: "reading", status: "locked", content: "<p>Identify and handle outliers using IQR, Z-scores, and visualization methods.</p>" },
          { id: "ds-3-4", title: "EDA Concepts Quiz", type: "quiz", status: "locked" },
        ],
      },
    ],
    quizzes: {
      "ds-1-5": {
        id: "ds-1-5",
        title: "Python Fundamentals Check",
        questions: 4,
        totalMarks: 4,
        passingGrade: 75,
        questionList: [
          { id: "q1", text: "Python lists are mutable (can be changed after creation).", type: "true_false", options: ["True", "False"], correctIndex: 0 },
          { id: "q2", text: "Which keyword is used to define a function in Python?", type: "multiple_choice", options: ["func", "def", "function", "define"], correctIndex: 1 },
          { id: "q3", text: "A Python dictionary stores data as key-value pairs.", type: "true_false", options: ["True", "False"], correctIndex: 0 },
          { id: "q4", text: "Which of the following is NOT a valid Python data type?", type: "multiple_choice", options: ["int", "str", "decimal", "float"], correctIndex: 2 },
        ],
      },
    },
    assignments: {
      "ds-2-5": {
        id: "ds-2-5",
        title: "Clean a Messy Real-World Dataset",
        totalMarks: 15,
        passingMarks: 10,
        totalAttempts: 3,
        duration: "5 Days",
        deadline: "September 24, 2026 11:59 pm",
        daysRemaining: 12,
        description: "You will be given a raw CSV dataset with missing values, duplicates, incorrect data types, and inconsistent formatting. Your task: (1) Load the dataset into Pandas. (2) Identify and document all data quality issues. (3) Clean the dataset using appropriate techniques. (4) Export the cleaned dataset as a new CSV. Submit your Jupyter Notebook (.ipynb) file.",
      },
    },
    resources: [
      { name: "NumPy Quick Reference Cheat Sheet.pdf", url: "#" },
      { name: "Pandas DataFrame Operations Guide.pdf", url: "#" },
      { name: "EDA Checklist.pdf", url: "#" },
    ],
  },
  "python-for-data-science": {
    slug: "python-for-data-science",
    title: "Python for Data Science",
    percentCompleted: 0,
    totalLessons: 36,
    completedLessons: 0,
    topics: [
      {
        id: "py-topic-1",
        title: "Module 1: Python Essentials",
        completed: false,
        lessons: [
          { id: "py-1-1", title: "Variables, Data Types & Operators", type: "reading", status: "in_progress", content: "<p>Every Python program starts with understanding how data is stored and manipulated.</p><h2 class='text-xl font-bold mt-6 mb-2'>Core Data Types</h2><ul class='list-disc ml-5 space-y-1 text-sm'><li><strong>int</strong> — whole numbers: 1, 42, -7</li><li><strong>float</strong> — decimals: 3.14, -0.5</li><li><strong>str</strong> — text: \"hello\", 'world'</li><li><strong>bool</strong> — True or False</li><li><strong>list</strong> — ordered collection: [1, 2, 3]</li><li><strong>dict</strong> — key-value pairs: {'name': 'Alice'}</li></ul>" },
          { id: "py-1-2", title: "Lists, Tuples, Dictionaries & Sets", type: "reading", status: "locked", content: "<p>Python's built-in data structures are the backbone of data manipulation. Learn when to use each one.</p>" },
          { id: "py-1-3", title: "Control Flow — if/else, for loops, while loops", type: "reading", status: "locked", content: "<p>Control the execution path of your programs using conditional logic and loops.</p>" },
          { id: "py-1-4", title: "Functions, *args & **kwargs", type: "reading", status: "locked", content: "<p>Functions let you write reusable, modular code. Learn to define, call, and pass arguments effectively.</p>" },
          { id: "py-1-5", title: "Error Handling with try/except", type: "reading", status: "locked", content: "<p>Write robust code that handles unexpected errors gracefully using Python's exception system.</p>" },
          { id: "py-1-6", title: "Python Fundamentals Assessment", type: "quiz", status: "locked" },
        ],
      },
      {
        id: "py-topic-2",
        title: "Module 2: NumPy for Numerical Computing",
        completed: false,
        lessons: [
          { id: "py-2-1", title: "Creating and Indexing NumPy Arrays", type: "reading", status: "locked", content: "<p>NumPy arrays are up to 50x faster than Python lists for numerical operations. Learn why and how to use them.</p>" },
          { id: "py-2-2", title: "Array Operations & Broadcasting", type: "reading", status: "locked", content: "<p>Perform element-wise operations across arrays of different shapes using NumPy's broadcasting rules.</p>" },
          { id: "py-2-3", title: "Statistical Functions (mean, std, percentile)", type: "reading", status: "locked", content: "<p>Use NumPy's built-in statistical functions to summarize and describe your data quickly.</p>" },
          { id: "py-2-4", title: "NumPy Skills Check", type: "quiz", status: "locked" },
        ],
      },
      {
        id: "py-topic-3",
        title: "Module 3: Data Analysis with Pandas",
        completed: false,
        lessons: [
          { id: "py-3-1", title: "Series and DataFrames — The Core Objects", type: "reading", status: "locked", content: "<p>Everything in Pandas revolves around two objects: Series (1D) and DataFrame (2D). Master them both.</p>" },
          { id: "py-3-2", title: "Importing Data from CSV, Excel & APIs", type: "reading", status: "locked", content: "<p>Load data from files and web APIs into Pandas DataFrames with just a few lines of code.</p>" },
          { id: "py-3-3", title: "Filtering & Conditional Selection", type: "reading", status: "locked", content: "<p>Select rows and columns based on conditions using boolean indexing and query methods.</p>" },
          { id: "py-3-4", title: "Analyze a Sales Dataset from Scratch", type: "assignment", status: "locked" },
        ],
      },
    ],
    quizzes: {
      "py-1-6": {
        id: "py-1-6",
        title: "Python Fundamentals Assessment",
        questions: 3,
        totalMarks: 3,
        passingGrade: 70,
        questionList: [
          { id: "q1", text: "Python is case-sensitive (age and Age are different variables).", type: "true_false", options: ["True", "False"], correctIndex: 0 },
          { id: "q2", text: "Which method adds an item to the end of a Python list?", type: "multiple_choice", options: ["list.add()", "list.insert()", "list.append()", "list.push()"], correctIndex: 2 },
          { id: "q3", text: "A for loop in Python can iterate over a list.", type: "true_false", options: ["True", "False"], correctIndex: 0 },
        ],
      },
    },
    assignments: {
      "py-3-4": {
        id: "py-3-4",
        title: "Analyze a Sales Dataset from Scratch",
        totalMarks: 10,
        passingMarks: 7,
        totalAttempts: 3,
        duration: "4 Days",
        deadline: "September 22, 2026 11:59 pm",
        daysRemaining: 10,
        description: "Using the provided sales CSV dataset: (1) Load it into a Pandas DataFrame and print summary statistics. (2) Find the top 5 best-selling products by total revenue. (3) Calculate monthly sales totals and identify the best month. (4) Visualize the results with at least 2 charts (bar chart + line chart). Submit your Jupyter Notebook with all code and markdown explanations.",
      },
    },
    resources: [
      { name: "Python Cheat Sheet — Core Syntax.pdf", url: "#" },
      { name: "Pandas DataFrame Quick Reference.pdf", url: "#" },
    ],
  },
  "web-development-bootcamp": {
    slug: "web-development-bootcamp",
    title: "The Complete Web Development Bootcamp",
    percentCompleted: 0,
    totalLessons: 65,
    completedLessons: 0,
    topics: [
      {
        id: "web-topic-1",
        title: "Module 1: Web Fundamentals (HTML & CSS)",
        completed: false,
        lessons: [
          { id: "web-1-1", title: "How the Internet Works — DNS, HTTP, Browsers", type: "reading", status: "in_progress", content: "<p>Before writing a single line of code, it's crucial to understand what actually happens when you type a URL into your browser.</p><h2 class='text-xl font-bold mt-6 mb-2'>The Request-Response Cycle</h2><p class='leading-relaxed'>When you visit a website, your browser sends an <strong>HTTP request</strong> to a server. The server processes it and sends back an <strong>HTTP response</strong> — usually an HTML file, which your browser then renders into a visual page.</p><h2 class='text-xl font-bold mt-6 mb-2'>Key Concepts</h2><ul class='list-disc ml-5 space-y-1 text-sm'><li><strong>DNS</strong> — translates domain names (google.com) into IP addresses</li><li><strong>HTTP/HTTPS</strong> — the protocol for transferring data between client and server</li><li><strong>Browser</strong> — parses HTML, CSS, and JavaScript to render pages</li><li><strong>Server</strong> — stores and serves files and data</li></ul>" },
          { id: "web-1-2", title: "HTML5 Document Structure & Semantic Elements", type: "reading", status: "locked", content: "<p>HTML is the skeleton of every web page. Semantic HTML makes your code readable, accessible, and SEO-friendly.</p>" },
          { id: "web-1-3", title: "CSS Selectors, Specificity & the Box Model", type: "reading", status: "locked", content: "<p>CSS controls how elements look. Understanding specificity and the box model is essential for precise layouts.</p>" },
          { id: "web-1-4", title: "Flexbox Layout — The Complete Guide", type: "video", duration: "42:00 mins", status: "locked", content: "<p>Flexbox is the most powerful tool for building responsive, flexible layouts in CSS.</p>" },
          { id: "web-1-5", title: "CSS Grid Layout", type: "video", duration: "38:00 mins", status: "locked", content: "<p>CSS Grid gives you two-dimensional control over page layout — rows AND columns simultaneously.</p>" },
          { id: "web-1-6", title: "Responsive Design & Media Queries", type: "reading", status: "locked", content: "<p>Make your websites look great on every screen size using media queries and flexible units.</p>" },
          { id: "web-1-7", title: "Build a Responsive Landing Page", type: "assignment", status: "locked" },
        ],
      },
      {
        id: "web-topic-2",
        title: "Module 2: JavaScript Foundations",
        completed: false,
        lessons: [
          { id: "web-2-1", title: "Variables, Data Types & Operators", type: "reading", status: "locked", content: "<p>JavaScript is the language of the web. This lesson covers the fundamentals every JS developer must know.</p>" },
          { id: "web-2-2", title: "Arrays & Array Methods (map, filter, reduce)", type: "reading", status: "locked", content: "<p>Arrays are one of the most-used data structures in JavaScript. Master the modern array methods.</p>" },
          { id: "web-2-3", title: "The DOM — Selecting & Manipulating Elements", type: "reading", status: "locked", content: "<p>The Document Object Model (DOM) is JavaScript's interface for reading and changing HTML on the fly.</p>" },
          { id: "web-2-4", title: "Asynchronous JS — Callbacks, Promises, async/await", type: "video", duration: "55:00 mins", status: "locked", content: "<p>Async programming is one of the most important (and tricky) concepts in JavaScript. This lesson demystifies it.</p>" },
          { id: "web-2-5", title: "JavaScript Core Concepts Quiz", type: "quiz", status: "locked" },
          { id: "web-2-6", title: "Build an Interactive Weather App", type: "assignment", status: "locked" },
        ],
      },
      {
        id: "web-topic-3",
        title: "Module 4: React — Modern Frontend",
        completed: false,
        lessons: [
          { id: "web-3-1", title: "What is React? Virtual DOM & Component Model", type: "reading", status: "locked", content: "<p>React is a JavaScript library for building user interfaces. Learn how the Virtual DOM makes React fast.</p>" },
          { id: "web-3-2", title: "JSX, Props & Component Composition", type: "reading", status: "locked", content: "<p>JSX lets you write HTML-like syntax inside JavaScript. Props allow components to communicate with each other.</p>" },
          { id: "web-3-3", title: "State with useState — Forms & Interactivity", type: "video", duration: "28:00 mins", status: "locked", content: "<p>State is how React components remember information. The useState hook is the most fundamental tool in React.</p>" },
          { id: "web-3-4", title: "React Router — Client-Side Navigation", type: "reading", status: "locked", content: "<p>React Router enables navigation between pages without full page reloads — the foundation of Single Page Apps.</p>" },
          { id: "web-3-5", title: "Build a Full React Task Manager App", type: "assignment", status: "locked" },
        ],
      },
    ],
    quizzes: {
      "web-2-5": {
        id: "web-2-5",
        title: "JavaScript Core Concepts Quiz",
        questions: 4,
        totalMarks: 4,
        passingGrade: 75,
        questionList: [
          { id: "q1", text: "JavaScript is a statically-typed language.", type: "true_false", options: ["True", "False"], correctIndex: 1 },
          { id: "q2", text: "Which method is used to add an event listener to a DOM element?", type: "multiple_choice", options: ["element.on()", "element.listen()", "element.addEventListener()", "element.bind()"], correctIndex: 2 },
          { id: "q3", text: "Promises help manage asynchronous operations in JavaScript.", type: "true_false", options: ["True", "False"], correctIndex: 0 },
          { id: "q4", text: "Which of the following array methods returns a new array?", type: "multiple_choice", options: ["push()", "pop()", "map()", "splice()"], correctIndex: 2 },
        ],
      },
    },
    assignments: {
      "web-1-7": {
        id: "web-1-7",
        title: "Build a Responsive Landing Page",
        totalMarks: 20,
        passingMarks: 14,
        totalAttempts: 3,
        duration: "7 Days",
        deadline: "September 26, 2026 11:59 pm",
        daysRemaining: 14,
        description: "Build a fully responsive landing page for a fictional product of your choice. Requirements: (1) Use semantic HTML5 elements (header, nav, main, section, footer). (2) Implement a responsive navigation bar that works on mobile and desktop. (3) Create a hero section with a headline, subtitle, and call-to-action button. (4) Add a features/benefits section with a grid layout. (5) Include a footer with links. The page must look correct on mobile (375px), tablet (768px), and desktop (1280px). Submit a GitHub repository link.",
      },
      "web-2-6": {
        id: "web-2-6",
        title: "Build an Interactive Weather App",
        totalMarks: 15,
        passingMarks: 10,
        totalAttempts: 3,
        duration: "5 Days",
        deadline: "September 28, 2026 11:59 pm",
        daysRemaining: 16,
        description: "Build a weather app that fetches live data from the OpenWeatherMap API. Requirements: (1) Accept a city name as input. (2) Display current temperature, weather condition, humidity, and wind speed. (3) Show an appropriate weather icon. (4) Handle errors gracefully (city not found, API failure). (5) Make the UI responsive and visually appealing. Submit a GitHub repository link with a live demo URL.",
      },
    },
    resources: [
      { name: "HTML5 Semantic Elements Reference.pdf", url: "#" },
      { name: "CSS Flexbox Visual Guide.pdf", url: "#" },
      { name: "JavaScript Array Methods Cheat Sheet.pdf", url: "#" },
      { name: "React Hooks Quick Reference.pdf", url: "#" },
    ],
  },
};


// Mock quiz attempt history for the dashboard
export interface QuizAttempt {
  id: string;
  quizTitle: string;
  courseTitle: string;
  student: string;
  date: string;
  score: number;
  correct: number;
  incorrect: number;
  timeTaken: string;
  result: "passed" | "failed" | "pending";
}

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: "qa-1",
    quizTitle: "Freelance Fundamentals",
    courseTitle: "Freelance Business Launchpad",
    student: "hesbonombati",
    date: "September 12, 2026, 11:03 am",
    score: 0,
    correct: 0,
    incorrect: 3,
    timeTaken: "0:26",
    result: "failed",
  },
  {
    id: "qa-2",
    quizTitle: "Procreate Basics Assessment",
    courseTitle: "Digital Illustration with Procreate",
    student: "hesbonombati",
    date: "September 12, 2026, 10:45 am",
    score: 0,
    correct: 0,
    incorrect: 5,
    timeTaken: "0:40",
    result: "pending",
  },
];

// Mock assignment history for the dashboard
export interface AssignmentAttempt {
  id: string;
  assignmentTitle: string;
  courseTitle: string;
  student: string;
  totalMarks: number;
  passMarks: number;
  earnedMarks: number | null;
  duration: string;
  submittedDate: string;
  deadline: string;
  status: "pending" | "graded" | "failed";
}

export const mockAssignments: AssignmentAttempt[] = [
  {
    id: "aa-1",
    assignmentTitle: "Build Your Freelance Foundation",
    courseTitle: "Freelance Business Launchpad",
    student: "hesbonombati",
    totalMarks: 10,
    passMarks: 6,
    earnedMarks: null,
    duration: "7 Days",
    submittedDate: "September 12, 2026, 11:05 am",
    deadline: "September 19, 2026, 11:03 am",
    status: "pending",
  },
];

// Add JavaScript Mastery explicit curriculum
coursePlayerData["javascript-mastery"] = {
  slug: "javascript-mastery",
  title: "JavaScript Mastery",
  percentCompleted: 14,
  totalLessons: 28,
  completedLessons: 4,
  topics: [
    {
      id: "js-topic-1",
      title: "Module 1: JavaScript Fundamentals",
      completed: true,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Variables, Scopes & Data Types",
          type: "reading",
          status: "completed",
          content: `<div class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900">Variables, Scopes & Data Types in Modern JavaScript</h2>
            <p class="leading-relaxed text-gray-700">JavaScript is a dynamic, weakly typed programming language with first-class functions. In modern JavaScript (ES6+), variable declarations are handled using <code class="rounded bg-purple-50 px-1.5 py-0.5 text-purple-700 font-mono text-sm">let</code> and <code class="rounded bg-purple-50 px-1.5 py-0.5 text-purple-700 font-mono text-sm">const</code>, replacing legacy <code class="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">var</code>.</p>
            
            <h3 class="text-xl font-bold text-gray-900 mt-6">Primitive Types vs Reference Types</h3>
            <ul class="list-disc ml-6 space-y-2 text-gray-700">
              <li><strong>Primitive Types:</strong> <code class="text-sm font-mono">string</code>, <code class="text-sm font-mono">number</code>, <code class="text-sm font-mono">boolean</code>, <code class="text-sm font-mono">null</code>, <code class="text-sm font-mono">undefined</code>, <code class="text-sm font-mono">symbol</code>, <code class="text-sm font-mono">bigint</code>. Passed by value.</li>
              <li><strong>Reference Types:</strong> <code class="text-sm font-mono">Object</code>, <code class="text-sm font-mono">Array</code>, <code class="text-sm font-mono">Function</code>. Stored in heap memory and passed by reference.</li>
            </ul>

            <h3 class="text-xl font-bold text-gray-900 mt-6">Block Scope vs Function Scope</h3>
            <p class="leading-relaxed text-gray-700"><code class="text-sm font-mono">let</code> and <code class="text-sm font-mono">const</code> are block-scoped, meaning they only exist within the curly braces <code class="text-sm font-mono">{}</code> where they are declared. This prevents common scope leakage and bugs.</p>
          </div>`,
        },
        {
          id: "lesson-1-2",
          title: "Functions, Closures & Execution Context",
          type: "video",
          duration: "18:20 mins",
          status: "in_progress",
          content: `<p>In this video lesson, we explore JavaScript's call stack, execution contexts, and how closures preserve access to outer variables even after parent functions have finished executing.</p>`,
        },
        {
          id: "lesson-1-3",
          title: "JavaScript Fundamentals Check",
          type: "quiz",
          status: "completed",
        },
      ],
    },
    {
      id: "js-topic-2",
      title: "Module 2: Asynchronous JavaScript & APIs",
      completed: false,
      lessons: [
        {
          id: "lesson-2-1",
          title: "The Event Loop, Microtasks & Macrotasks",
          type: "video",
          duration: "22:45 mins",
          status: "in_progress",
          content: `<p>Learn how JavaScript manages concurrency on a single thread using the Event Loop, Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout).</p>`,
        },
        {
          id: "lesson-2-2",
          title: "Promises and Async/Await Patterns",
          type: "reading",
          status: "in_progress",
          content: `<div class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900">Modern Asynchronous Programming</h2>
            <p class="leading-relaxed text-gray-700">Promises provide a clean, composable way to handle asynchronous computations without callback hell. With <code class="rounded bg-purple-50 px-1.5 py-0.5 text-purple-700 font-mono text-sm">async/await</code>, asynchronous code reads just like synchronous code while maintaining non-blocking performance.</p>
          </div>`,
        },
        {
          id: "lesson-2-3",
          title: "Build an Asynchronous Data Fetcher App",
          type: "assignment",
          status: "in_progress",
        },
      ],
    },
    {
      id: "js-topic-3",
      title: "Module 3: Advanced Patterns & Optimization",
      completed: false,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Prototypes, Inheritance & ES6 Classes",
          type: "reading",
          status: "locked",
          content: `<p>Understand JavaScript's prototypal inheritance model and how ES6 class syntax maps onto prototypes.</p>`,
        },
        {
          id: "lesson-3-2",
          title: "Memory Leaks & Performance Profiling",
          type: "video",
          duration: "15:30 mins",
          status: "locked",
          content: `<p>Use Chrome DevTools to take heap snapshots, find memory leaks, and optimize rendering loops.</p>`,
        },
      ],
    },
  ],
  quizzes: {
    "lesson-1-3": {
      id: "lesson-1-3",
      title: "JavaScript Fundamentals Check",
      questions: 3,
      totalMarks: 3,
      passingGrade: 70,
      questionList: [
        {
          id: "q1",
          text: "Variables declared with 'const' can be reassigned.",
          type: "true_false",
          options: ["True", "False"],
          correctIndex: 1,
        },
        {
          id: "q2",
          text: "Which keyword declares a block-scoped variable in modern JavaScript?",
          type: "multiple_choice",
          options: ["var", "let", "global", "static"],
          correctIndex: 1,
        },
        {
          id: "q3",
          text: "JavaScript is single-threaded.",
          type: "true_false",
          options: ["True", "False"],
          correctIndex: 0,
        },
      ],
    },
  },
  assignments: {
    "lesson-2-3": {
      id: "lesson-2-3",
      title: "Build an Asynchronous Data Fetcher App",
      totalMarks: 20,
      passingMarks: 14,
      totalAttempts: 3,
      duration: "5 Days",
      deadline: "September 25, 2026 11:59 pm",
      daysRemaining: 13,
      description: "Build a JavaScript module that fetches paginated data from a REST API with debounce, retry logic, and error handling. Requirements: (1) Implement async/await with try/catch. (2) Add exponential backoff retry on 5xx status codes. (3) Cache responses in memory. Submit your code via GitHub repository link.",
    },
  },
  resources: [
    { name: "JavaScript ES6+ Cheatsheet.pdf", url: "#", size: "1.5 MB", type: "PDF" },
    { name: "Event Loop Visual Guide.pdf", url: "#", size: "2.1 MB", type: "PDF" },
    { name: "Async Await Design Patterns.pdf", url: "#", size: "980 KB", type: "PDF" },
  ],
  announcements: [
    {
      id: "ann-js-1",
      title: "Welcome to JavaScript Mastery!",
      date: "September 8, 2026",
      authorName: "Michael Lee",
      authorRole: "Senior Frontend Engineer",
      content: "Welcome to the cohort! We are going to go from foundational closures and prototypes all the way to high-performance async workflows and modern Node.js backend integration.",
      isPinned: true,
      commentsCount: 12,
    },
    {
      id: "ann-js-2",
      title: "Node.js 22 LTS Updates and TypeScript 5.6 compatibility",
      date: "September 11, 2026",
      authorName: "Michael Lee",
      authorRole: "Senior Frontend Engineer",
      content: "All code snippets and starter repositories in Module 2 have been updated to support Node 22 LTS. Check the resources tab for the updated cheatsheet!",
      commentsCount: 6,
    },
  ],
  liveClasses: [
    {
      id: "live-js-1",
      title: "Deep Dive into V8 Engine & Garbage Collection",
      date: "Thursday, Sep 17, 2026",
      time: "6:00 PM - 7:30 PM EST",
      duration: "90 mins",
      instructorName: "Michael Lee",
      platform: "Zoom",
      joinUrl: "https://zoom.us/j/demo-javascript",
      status: "upcoming",
      agenda: [
        "How V8 compiles JS with Ignition & TurboFan",
        "Memory leaks: WeakMap, WeakSet, and detached DOM nodes",
        "Live code profiling in Chrome DevTools",
      ],
    },
    {
      id: "live-js-2",
      title: "Mastering TypeScript Generics & Type Gymnastics",
      date: "Tuesday, Sep 1, 2026",
      time: "5:00 PM - 6:30 PM EST",
      duration: "90 mins",
      instructorName: "Michael Lee",
      platform: "Zoom",
      joinUrl: "#",
      status: "completed",
      recordingUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      agenda: [
        "Conditional types and infer keyword",
        "Template literal types in action",
        "Refactoring messy types from open source repos",
      ],
    },
  ],
  gradebook: [
    {
      id: "grade-js-1",
      title: "JavaScript Foundations & Closures Quiz",
      type: "quiz",
      maxMarks: 10,
      passMarks: 7,
      earnedMarks: 9,
      status: "passed",
      submittedDate: "Sep 9, 2026",
    },
    {
      id: "grade-js-2",
      title: "Build an Asynchronous Data Fetcher App",
      type: "assignment",
      maxMarks: 20,
      passMarks: 14,
      earnedMarks: undefined,
      status: "pending",
      dueDate: "Sep 25, 2026",
    },
  ],
};

// Universal helper that guarantees ANY valid course slug returns a rich CoursePlayerData
export function getCoursePlayerData(slug: string): CoursePlayerData {
  if (coursePlayerData[slug]) {
    return coursePlayerData[slug];
  }

  // Common aliases
  if (slug === "secret-tips-behind-perfect-diet-meal-plan" || slug === "secret-tips-behind-perfect-diet-and-meal-plan") {
    return coursePlayerData["nutrition-fundamentals"];
  }
  if (slug === "landscape-oil-painting-fundamentals") {
    return coursePlayerData["landscape-oil-painting"];
  }

  // Generate a clean title from slug
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Dynamically constructed curriculum
  const generated: CoursePlayerData = {
    slug,
    title,
    percentCompleted: 0,
    totalLessons: 18,
    completedLessons: 0,
    topics: [
      {
        id: `${slug}-t1`,
        title: "Module 1: Foundations & Architecture",
        completed: false,
        lessons: [
          {
            id: `${slug}-1-1`,
            title: "Course Introduction & Setup",
            type: "reading",
            status: "in_progress",
            content: `<div class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900">Welcome to ${title}</h2>
              <p class="leading-relaxed text-gray-700">Welcome to this comprehensive, hands-on learning experience. In this course, you will acquire practical industry-standard skills through structured lessons, interactive assessments, and real-world projects.</p>
              <h3 class="text-xl font-bold text-gray-900 mt-4">What You Will Achieve</h3>
              <ul class="list-disc ml-6 space-y-2 text-gray-700">
                <li>Master the core concepts and theoretical foundations</li>
                <li>Work with professional workflows, tools, and best practices</li>
                <li>Complete assignments and build portfolio-ready deliverables</li>
                <li>Earn a verified Certificate of Completion upon finishing 100% of the lessons</li>
              </ul>
            </div>`,
          },
          {
            id: `${slug}-1-2`,
            title: "Core Principles & Workflow Overview",
            type: "video",
            duration: "14:30 mins",
            status: "locked",
            content: `<p>In this video lesson, we examine the essential principles and workflows you will use throughout the course.</p>`,
          },
          {
            id: `${slug}-1-3`,
            title: "Foundations Assessment",
            type: "quiz",
            status: "locked",
          },
        ],
      },
      {
        id: `${slug}-t2`,
        title: "Module 2: Practical Implementation & Techniques",
        completed: false,
        lessons: [
          {
            id: `${slug}-2-1`,
            title: "Hands-on Workshop: Step-by-Step Guide",
            type: "reading",
            status: "locked",
            content: `<p>Follow along with this detailed walkthrough to build your first practical project.</p>`,
          },
          {
            id: `${slug}-2-2`,
            title: "Deep Dive: Advanced Tools & Patterns",
            type: "video",
            duration: "25:10 mins",
            status: "locked",
            content: `<p>Learn industry-level optimization techniques and advanced implementation strategies.</p>`,
          },
          {
            id: `${slug}-2-3`,
            title: "Practical Capstone Assignment",
            type: "assignment",
            status: "locked",
          },
        ],
      },
    ],
    quizzes: {
      [`${slug}-1-3`]: {
        id: `${slug}-1-3`,
        title: `${title} Foundations Assessment`,
        questions: 3,
        totalMarks: 3,
        passingGrade: 70,
        questionList: [
          {
            id: "q1",
            text: "All core concepts in this module apply to real-world production environments.",
            type: "true_false",
            options: ["True", "False"],
            correctIndex: 0,
          },
          {
            id: "q2",
            text: "Which of the following is considered a best practice in this discipline?",
            type: "multiple_choice",
            options: [
              "Following consistent style guidelines",
              "Skipping error handling",
              "Ignoring performance bottlenecks",
              "Hardcoding environment secrets",
            ],
            correctIndex: 0,
          },
          {
            id: "q3",
            text: "Completing all lessons unlocks the official certificate of completion.",
            type: "true_false",
            options: ["True", "False"],
            correctIndex: 0,
          },
        ],
      },
    },
    assignments: {
      [`${slug}-2-3`]: {
        id: `${slug}-2-3`,
        title: `${title} Practical Capstone Assignment`,
        totalMarks: 20,
        passingMarks: 14,
        totalAttempts: 3,
        duration: "7 Days",
        deadline: "September 30, 2026 11:59 pm",
        daysRemaining: 18,
        description: `Complete the hands-on project for ${title}. Submit your project source files, screenshots, and documentation adhering to the rubric provided in the lesson notes.`,
      },
    },
    resources: [
      { name: `${title} Starter Guide.pdf`, url: "#", size: "1.4 MB", type: "PDF" },
      { name: "Project Template Files.zip", url: "#", size: "4.8 MB", type: "ZIP" },
      { name: "Quick Reference Cheat Sheet.pdf", url: "#", size: "820 KB", type: "PDF" },
    ],
    announcements: [
      {
        id: `ann-${slug}-1`,
        title: `Welcome to ${title}!`,
        date: "September 10, 2026",
        authorName: "Course Instructor",
        authorRole: "Senior Instructor",
        content: `Welcome to ${title}! Be sure to review the syllabus, participate in module quizzes, and join our weekly live workshop.`,
        isPinned: true,
        commentsCount: 5,
      },
    ],
    liveClasses: [
      {
        id: `live-${slug}-1`,
        title: `${title}: Live Implementation Q&A`,
        date: "Next Wednesday",
        time: "5:00 PM - 6:00 PM EST",
        duration: "60 mins",
        instructorName: "Course Instructor",
        platform: "Zoom",
        joinUrl: "https://zoom.us/j/demo-course",
        status: "upcoming",
        agenda: [
          "Curriculum walkthrough and key takeaways",
          "Live code & project problem solving",
          "Open Q&A for all students",
        ],
      },
    ],
    gradebook: [
      {
        id: `grade-${slug}-1`,
        title: `${title} Foundations Assessment`,
        type: "quiz",
        maxMarks: 3,
        passMarks: 2,
        earnedMarks: 3,
        status: "passed",
        submittedDate: "Sep 10, 2026",
      },
      {
        id: `grade-${slug}-2`,
        title: `${title} Practical Capstone Assignment`,
        type: "assignment",
        maxMarks: 20,
        passMarks: 14,
        earnedMarks: undefined,
        status: "not_attempted",
        dueDate: "Sep 30, 2026",
      },
    ],
  };

  // Cache generated course in memory
  coursePlayerData[slug] = generated;
  return generated;
}
