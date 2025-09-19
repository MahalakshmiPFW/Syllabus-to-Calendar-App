# Syllabus Calendar

A modern web application that automatically converts course syllabi into organized calendar tasks using AI-powered parsing. Upload your syllabus and instantly get assignments, readings, and exams organized in both calendar and list views, with optional Google Calendar synchronization.

## Features

- **AI-Powered Text Parsing**: Uses OpenAI GPT-4 to intelligently extract tasks from text files
- **File Upload**: Support for text files (AI-powered) and PDF files (mock data)
- **Smart Classification**: Automatically categorizes assignments, readings, exams, and other tasks
- **Dual Views**: Switch between calendar and list views
- **Task Management**: Edit, delete, and mark tasks as complete
- **Google Calendar Sync**: Optional integration with Google Calendar
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, educational-focused design with accessibility features

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Node.js runtime with Next.js API routes
- **AI Integration**: OpenAI GPT-4 for syllabus parsing
- **File Processing**: pdf-parse for PDF text extraction
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **File Handling**: react-dropzone for drag-and-drop uploads
- **Calendar Integration**: Google Calendar API (simulated)

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd syllabus-calendar
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Current File Support

### Text Files (.txt)
- **Full AI Integration**: Uses OpenAI GPT-4 for intelligent parsing and task extraction
- **Real Data**: Actual syllabus content is processed and converted to calendar tasks
- **Smart Classification**: AI categorizes and extracts meaningful information

### PDF Files (.pdf)
- **Mock Data**: Currently displays sample tasks for demonstration purposes
- **Future Enhancement**: PDF parsing with AI extraction planned for future releases

## Usage

1. **Upload Syllabus**: 
   - **Text files**: Drag and drop or click to upload for full AI processing
   - **PDF files**: Upload to see mock data demonstration
2. **AI Processing**: Click "Parse Syllabus with AI" to extract tasks and dates using OpenAI (text files only)
3. **View Tasks**: Switch between calendar and list views to see your schedule
4. **Manage Tasks**: Edit, delete, or mark tasks as complete
5. **Sync Calendar**: Optionally connect to Google Calendar for cross-device synchronization

## Approach

### AI-Powered Processing (Text Files)
The application uses OpenAI's GPT-4 model for intelligent syllabus parsing:
- **Direct Text Processing**: Reads text files directly for AI analysis
- **AI Analysis**: GPT-4 understands context and extracts meaningful task information
- **Smart Classification**: AI categorizes tasks as assignments, readings, exams, or other
- **Date Normalization**: Converts various date formats to consistent MM/DD/YYYY format

### File Processing Pipeline
1. **File Upload**: Multi-format support with drag-and-drop interface
2. **Processing Branch**:
   - **Text Files**: Direct AI processing with OpenAI API
   - **PDF Files**: Mock data generation for demonstration
3. **Data Transformation**: Convert AI response to application task format
4. **Error Handling**: Graceful fallbacks and user-friendly error messages

### Task Classification
AI-powered categorization identifies:
- **Assignments**: homework, projects, papers, essays, reports
- **Readings**: textbook chapters, articles, research papers
- **Exams**: tests, quizzes, midterms, finals, assessments
- **Other**: miscellaneous course activities and deadlines

### User Experience
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Real-time Feedback**: Progress indicators during AI processing

## Architecture

\`\`\`
src/
├── app/
│   ├── api/
│   │   └── parse-syllabus/
│   │       └── route.ts      # OpenAI API integration
│   ├── page.tsx              # Main application component
│   ├── layout.tsx            # Root layout with fonts and metadata
│   └── globals.css           # Global styles and design tokens
├── components/
│   ├── file-upload.tsx       # Drag-and-drop file upload
│   ├── syllabus-parser.tsx   # AI-powered parsing interface
│   ├── calendar-view.tsx     # Monthly calendar display
│   ├── task-list.tsx         # List view with filtering and sorting
│   ├── google-calendar-sync.tsx # Google Calendar integration
│   └── ui/                   # Reusable UI components
└── lib/
    └── utils.ts              # Utility functions
\`\`\`

## Environment Variables

The application requires the following environment variable:

- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4 access

Add this to your `.env.local` file or configure it in your deployment platform (Vercel, etc.).

## Future Enhancements

- **Multiple AI Models**: Support for different LLMs (Claude, Gemini)
- **Batch Processing**: Handle multiple syllabi simultaneously
- **Custom Prompts**: Allow users to customize AI parsing instructions
- **Multiple Calendar Support**: Add support for Outlook, Apple Calendar
- **Collaboration Features**: Share schedules with classmates
- **Mobile App**: React Native version for mobile devices
- **Notification System**: Reminders for upcoming deadlines

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Submission Information

This project was created for evaluation based on the following criteria:

### Judging Criteria
- **Creativity**: AI-powered syllabus parsing with intelligent task categorization
- **Code Quality**: Clean TypeScript implementation with proper error handling and documentation
- **Usability and Design**: Responsive, accessible interface with dual calendar/list views
- **Impact on Lawbandit**: Streamlines academic workflow by automating syllabus organization

### Key Innovations
- **AI Integration**: Uses OpenAI GPT-4 for context-aware syllabus parsing instead of basic regex
- **Smart Classification**: Automatically categorizes assignments, readings, and exams
- **Dual Interface**: Provides both visual calendar and filterable list views
- **Progressive Enhancement**: Graceful fallbacks and comprehensive error handling
