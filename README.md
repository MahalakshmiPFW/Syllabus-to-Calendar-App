# SyllabusSync - A Syllabus to Calendar App

**[Live Demo](https://syllabus-to-calendar-app.vercel.app/)** · **[Source](https://github.com/MahalakshmiPFW/Syllabus-to-Calendar-App)**

A web app that automatically converts course syllabi into organized calendar tasks using AI-powered parsing. Upload a syllabus (PDF or text) and instantly get assignments, readings, and exams organized in both calendar and list views, editable, and exportable to any calendar app.

## 🎯 Product Thinking

**The problem:** Every semester, students get syllabi listing assignments, readings, and exam dates buried inside dense PDFs — then manually retype each date into whatever calendar they actually use. It's tedious and error-prone, and the cost of a missed date (a forgotten paper, an unstudied exam) is high.

**Who it's for:** Students who already live in a calendar app (Google Calendar, Outlook, Apple Calendar) and just want their syllabus dates to show up there without re-typing them.

**Key product decisions and why:**
- **Calendar + list view, not just one** — a calendar is better for "what's happening this week," a list is better for scanning and searching everything at once (e.g. "show me every exam"). Different tasks call for different views, so I built both instead of picking one.
- **Export via `.ics` + Google Calendar links instead of full OAuth sync** — this covers the three major calendar providers (Google, Outlook, Apple) with a fraction of the integration complexity of a full write-access OAuth flow. Given the audience is students who each use different calendar apps, breadth of compatibility mattered more than a deeper integration with only one provider.
- **Editable AI output, not a black box** — AI date extraction is good but not perfect, especially on inconsistently formatted syllabi. Rather than assume the AI gets it right, the app lets you correct, complete, or remove any extracted event before it goes anywhere.

**What I'd prioritize next, in order:**
1. Direct Google Calendar OAuth write access (true one-click bulk sync, no manual per-event confirmation)
2. Batch upload for students with multiple courses per semester
3. Reminder notifications ahead of deadlines

I'd sequence it this way because OAuth sync removes the last manual step in the core flow, batch upload matches how students actually use the tool (one syllabus per class, several classes per semester), and reminders are a nice-to-have layered on top of a working core.

## 🚀 Features

- **AI-Powered Extraction**: Uses **Google Gemini 2.0 Flash** to intelligently extract tasks from both text and PDF files
- **Multi-Format Support**: Full AI integration for both text (.txt) and PDF (.pdf) files
- **Smart Date Detection**: Automatically identifies semester/term (Fall, Spring, Summer) and assigns correct years and months
- **Intelligent Classification**: Automatically categorizes assignments, readings, exams, and other tasks
- **Dual Views**: Switch between calendar and list views
- **Task Management**: Edit any AI-extracted event, mark it complete, or delete it — useful since AI extraction isn't always perfect
- **Calendar Export**: Export events to Google Calendar (one click per event, via quick-add links) or download a standard `.ics` file that imports into Google Calendar, Outlook, or Apple Calendar
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, educational-focused design with accessibility features

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript  
- **Backend**: Node.js runtime with Next.js API routes  
- **AI Integration**: Google Gemini 2.0 Flash API for syllabus parsing  
- **Styling**: Tailwind CSS v4, shadcn/ui components  
- **Calendar Export**: iCalendar (`.ics`) file generation + Google Calendar quick-add links  

## 📋 Prerequisites

- Node.js 18+  
- npm or yarn package manager  
- **Google Gemini API key** (free from [Google AI Studio](https://aistudio.google.com/))

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Syllabus-to-Calendar-App
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

### 5. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📁 File Support

### Text Files (.txt)
- ✅ **Full AI Integration**: Uses Google Gemini for intelligent parsing and task extraction
- ✅ **Real Data**: Actual syllabus content is processed and converted to calendar tasks
- ✅ **Smart Classification**: AI categorizes and extracts meaningful information

### PDF Files (.pdf)
- ✅ **Full AI Integration**: Direct PDF-to-AI processing using Gemini's native PDF support
- ✅ **Real Data**: Extracts actual text and dates from PDF syllabi
- ✅ **Semester-Aware**: Automatically detects academic term (Fall/Spring/Summer) and assigns correct dates

## 🚧 Future Enhancements

- [ ] **PDF Text Extraction**: Add fallback PDF parsing for scanned documents
- [ ] **Multiple AI Models**: Support for different LLMs (Claude, OpenAI, etc.)
- [ ] **Batch Processing**: Handle multiple syllabi simultaneously
- [ ] **Custom Prompts**: Allow users to customize AI parsing instructions
- [ ] **Collaboration Features**: Share schedules with classmates
- [ ] **Mobile App**: React Native version for mobile devices
- [ ] **Notification System**: Reminders for upcoming deadlines
- [ ] **Google Calendar OAuth**: Direct write access instead of quick-add links, for true one-click bulk sync

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for students everywhere