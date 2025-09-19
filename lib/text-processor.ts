import type { CalendarEvent } from "@/app/page"

// Keep only utility functions for formatting and display

// Helper function to format dates for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Helper function to get relative date string
export function getRelativeDate(date: Date): string {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  if (diffDays > 7) return `In ${Math.ceil(diffDays / 7)} weeks`
  if (diffDays < -7) return `${Math.ceil(Math.abs(diffDays) / 7)} weeks ago`

  return formatDate(date)
}

// Helper function to get event type color
export function getEventTypeColor(type: CalendarEvent["type"]): string {
  switch (type) {
    case "assignment":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "exam":
      return "bg-red-100 text-red-800 border-red-200"
    case "reading":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// Helper function to get event type icon
export function getEventTypeIcon(type: CalendarEvent["type"]): string {
  switch (type) {
    case "assignment":
      return "📝"
    case "exam":
      return "📊"
    case "reading":
      return "📚"
    default:
      return "📅"
  }
}

export function processAIEvents(aiEvents: any[]): CalendarEvent[] {
  return aiEvents
    .map((event, index) => ({
      id: `ai-event-${index}-${Date.now()}`,
      title: event.title || "Untitled Event",
      date: new Date(event.date),
      type: event.type || "other",
      description: event.description || event.title || "",
    }))
    .filter((event) => !isNaN(event.date.getTime())) // Filter out invalid dates
}
