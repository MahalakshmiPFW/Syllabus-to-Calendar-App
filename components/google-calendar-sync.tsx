"use client"

import { useState } from "react"
import type { CalendarEvent } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Download, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"

interface GoogleCalendarSyncProps {
  events: CalendarEvent[]
}

export function GoogleCalendarSync({ events }: GoogleCalendarSyncProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle")

  // Generate ICS file content
  const generateICSContent = (events: CalendarEvent[]): string => {
    const icsEvents = events
      .map((event) => {
        const startDate = new Date(event.date)
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour duration

        const formatDate = (date: Date) => {
          return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
        }

        const escapeText = (text: string) => {
          return text.replace(/[,;\\]/g, "\\$&").replace(/\n/g, "\\n")
        }

        return [
          "BEGIN:VEVENT",
          `UID:${event.id}@syllabus-calendar.app`,
          `DTSTART:${formatDate(startDate)}`,
          `DTEND:${formatDate(endDate)}`,
          `SUMMARY:${escapeText(event.title)}`,
          `DESCRIPTION:${escapeText(event.description || "")}`,
          `CATEGORIES:${event.type.toUpperCase()}`,
          "STATUS:CONFIRMED",
          "TRANSP:OPAQUE",
          "END:VEVENT",
        ].join("\r\n")
      })
      .join("\r\n")

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Syllabus Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      icsEvents,
      "END:VCALENDAR",
    ].join("\r\n")
  }

  // Download ICS file
  const downloadICSFile = () => {
    const icsContent = generateICSContent(events)
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "syllabus-calendar.ics"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setExportStatus("success")
    setTimeout(() => setExportStatus("idle"), 3000)
  }

  // Generate Google Calendar URL
  const generateGoogleCalendarURL = (event: CalendarEvent): string => {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour duration

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: event.description || "",
      location: "",
      trp: "false",
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // Export all events to Google Calendar (opens multiple tabs)
  const exportAllToGoogleCalendar = async () => {
    setIsExporting(true)

    try {
      // Open Google Calendar for each event with a small delay
      for (let i = 0; i < events.length; i++) {
        const event = events[i]
        const url = generateGoogleCalendarURL(event)

        // Small delay to prevent browser from blocking popups
        setTimeout(() => {
          window.open(url, "_blank")
        }, i * 500)
      }

      setExportStatus("success")
    } catch (error) {
      console.error("Error exporting to Google Calendar:", error)
      setExportStatus("error")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportStatus("idle"), 5000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Export to Calendar
          </CardTitle>
          <CardDescription>Export your syllabus events to Google Calendar or download as an ICS file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Alert */}
          {exportStatus === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Events exported successfully! Check your calendar app.</AlertDescription>
            </Alert>
          )}

          {exportStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>There was an error exporting your events. Please try again.</AlertDescription>
            </Alert>
          )}

          {/* Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={exportAllToGoogleCalendar}
              disabled={isExporting || events.length === 0}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export to Google Calendar"}
            </Button>

            <Button
              variant="outline"
              onClick={downloadICSFile}
              disabled={events.length === 0}
              className="flex-1 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Download ICS File
            </Button>
          </div>

          {events.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">No events to export. Upload a syllabus first.</p>
          )}
        </CardContent>
      </Card>

      {/* Individual Event Export */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Individual Events</CardTitle>
            <CardDescription>Click on any event to add it individually to Google Calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-lg">
                      {event.type === "assignment" && "📝"}
                      {event.type === "exam" && "📊"}
                      {event.type === "reading" && "📚"}
                      {event.type === "other" && "📅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {event.type}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(generateGoogleCalendarURL(event), "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
              1
            </div>
            <div>
              <strong>Google Calendar:</strong> Click "Export to Google Calendar" to open each event in a new tab.
              You'll need to save each event manually in Google Calendar.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
              2
            </div>
            <div>
              <strong>ICS File:</strong> Download the ICS file and import it into any calendar app (Google Calendar,
              Outlook, Apple Calendar, etc.).
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
              3
            </div>
            <div>
              <strong>Individual Events:</strong> Use the individual export buttons to add specific events one at a
              time.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
