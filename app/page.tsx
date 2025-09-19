// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { FileText, Calendar, List, Download } from "lucide-react"
// import { FileUpload } from "@/components/file-upload"
// import { CalendarView } from "@/components/calendar-view"
// import { ListView } from "@/components/list-view"
// import { GoogleCalendarSync } from "@/components/google-calendar-sync"

// export interface CalendarEvent {
//   id: string
//   title: string
//   date: Date
//   type: "assignment" | "exam" | "reading" | "other"
//   description?: string
// }

// export default function Home() {
//   const [events, setEvents] = useState<CalendarEvent[]>([])
//   const [view, setView] = useState<"upload" | "calendar" | "list" | "export">("upload")
//   const [isProcessing, setIsProcessing] = useState(false)

//   const handleFileProcessed = (extractedEvents: CalendarEvent[]) => {
//     console.log("[v0] handleFileProcessed called with events:", extractedEvents)
//     setEvents(extractedEvents)
//     setView("calendar")
//     console.log("[v0] Updated events state and switched to calendar view")
//   }

//   const resetApp = () => {
//     setEvents([])
//     setView("upload")
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b border-border">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Calendar className="h-8 w-8 text-primary" />
//               <div className="flex items-center gap-3">
//                 <Calendar className="h-8 w-8 text-primary" />
//                 <div className="text-center">
//                   <h1 className="text-2xl font-bold text-foreground">Syllabus Calendar</h1>
//                   <p className="text-sm text-muted-foreground">Convert your syllabus to calendar events</p>
//                 </div>
//               </div>
//             </div>
//             {events.length > 0 && (
//               <Button variant="outline" onClick={resetApp}>
//                 Upload New Syllabus
//               </Button>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {view === "upload" && (
//           <div className="max-w-2xl mx-auto">
//             <Card>
//               <CardHeader className="text-center">
//                 <CardTitle className="flex items-center justify-center gap-2">
//                   <FileText className="h-6 w-6" />
//                   Upload Your Syllabus
//                 </CardTitle>
//                 <CardDescription>
//                   Upload a PDF or text file of your syllabus and we'll automatically extract assignments, exams, and
//                   important dates to create calendar events.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <FileUpload
//                   onFileProcessed={handleFileProcessed}
//                   isProcessing={isProcessing}
//                   setIsProcessing={setIsProcessing}
//                 />
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {(view === "calendar" || view === "list" || view === "export") && events.length > 0 && (
//           <div>
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-semibold text-foreground">Your Calendar Events ({events.length})</h2>
//                 <p className="text-sm text-muted-foreground">Extracted from your syllabus</p>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant={view === "calendar" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setView("calendar")}
//                 >
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Calendar
//                 </Button>
//                 <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
//                   <List className="h-4 w-4 mr-2" />
//                   List
//                 </Button>
//                 <Button variant={view === "export" ? "default" : "outline"} size="sm" onClick={() => setView("export")}>
//                   <Download className="h-4 w-4 mr-2" />
//                   Export
//                 </Button>
//               </div>
//             </div>

//             {view === "calendar" && <CalendarView events={events} />}
//             {view === "list" && <ListView events={events} />}
//             {view === "export" && <GoogleCalendarSync events={events} />}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, List, Download } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { CalendarView } from "@/components/calendar-view"
import { ListView } from "@/components/list-view"
import { GoogleCalendarSync } from "@/components/google-calendar-sync"

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "assignment" | "exam" | "reading" | "other"
  description?: string
}

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<"upload" | "calendar" | "list" | "export">("upload")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileProcessed = (extractedEvents: CalendarEvent[]) => {
    console.log("[v0] handleFileProcessed called with events:", extractedEvents)
    setEvents(extractedEvents)
    setView("calendar")
    console.log("[v0] Updated events state and switched to calendar view")
  }

  const resetApp = () => {
    setEvents([])
    setView("upload")
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          
          {/* Left: Empty space to balance right button */}
          <div className="w-1/3"></div>
          
          {/* Center: Icon + Title + Subtitle */}
          <div className="w-1/3 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-foreground">Syllabus Calendar</h1>
            <p className="text-sm text-muted-foreground">Convert your syllabus to calendar events</p>
          </div>
          
          {/* Right: Button */}
          <div className="w-1/3 flex justify-end">
            {events.length > 0 && (
              <Button variant="outline" onClick={resetApp}>
                Upload New Syllabus
              </Button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === "upload" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileText className="h-6 w-6" />
                  Upload Your Syllabus
                </CardTitle>
                <CardDescription>
                  Upload a PDF or text file of your syllabus and we'll automatically extract assignments, exams, and
                  important dates to create calendar events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileProcessed={handleFileProcessed}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {(view === "calendar" || view === "list" || view === "export") && events.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Your Calendar Events ({events.length})</h2>
                <p className="text-sm text-muted-foreground">Extracted from your syllabus</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={view === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("calendar")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
                <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button variant={view === "export" ? "default" : "outline"} size="sm" onClick={() => setView("export")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {view === "calendar" && <CalendarView events={events} />}
            {view === "list" && <ListView events={events} />}
            {view === "export" && <GoogleCalendarSync events={events} />}
          </div>
        )}
      </main>
    </div>
  )
}
