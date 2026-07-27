"use client"

import { useState } from "react"
import type { CalendarEvent } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Filter, Calendar, Clock, Pencil, Trash2 } from "lucide-react"
import { formatDate, getRelativeDate, getEventTypeColor, getEventTypeIcon } from "@/lib/text-processor"

interface ListViewProps {
  events: CalendarEvent[]
  onUpdateEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
  onToggleComplete: (eventId: string) => void
}

export function ListView({ events, onUpdateEvent, onDeleteEvent, onToggleComplete }: ListViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "type" | "title">("date")
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || event.type === filterType
    return matchesSearch && matchesType
  })

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return a.date.getTime() - b.date.getTime()
      case "type":
        return a.type.localeCompare(b.type)
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  // Group by month
  const eventsByMonth = sortedEvents.reduce(
    (acc, event) => {
      const monthKey = event.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
      if (!acc[monthKey]) acc[monthKey] = []
      acc[monthKey].push(event)
      return acc
    },
    {} as Record<string, CalendarEvent[]>
  )

  const getEventStatus = (event: CalendarEvent) => {
    const now = new Date()
    const eventDate = new Date(event.date)

    if (eventDate < now) {
      return { status: "past", label: "Past", color: "bg-gray-100 text-gray-600" }
    } else if (eventDate.toDateString() === now.toDateString()) {
      return { status: "today", label: "Today", color: "bg-blue-100 text-blue-600" }
    } else {
      const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 7) {
        return { status: "upcoming", label: "This Week", color: "bg-orange-100 text-orange-600" }
      } else {
        return { status: "future", label: "Future", color: "bg-green-100 text-green-600" }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="exam">Exams</SelectItem>
                <SelectItem value="reading">Readings</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "date" | "type" | "title")
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="type">Sort by Type</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {sortedEvents.length} of {events.length} events
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {Object.keys(eventsByMonth).length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No events found matching your criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(eventsByMonth).map(([month, monthEvents]) => (
          <Card key={month}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {month}
                <Badge variant="outline" className="ml-2">
                  {monthEvents.length} events
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthEvents.map((event) => {
                  const status = getEventStatus(event)

                  return (
                    <div
                      key={event.id}
                      className={`flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ${
                        event.completed ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Completion Checkbox */}
                        <Checkbox
                          checked={!!event.completed}
                          onCheckedChange={() => onToggleComplete(event.id)}
                          className="mt-1.5"
                          aria-label={`Mark ${event.title} as ${event.completed ? "incomplete" : "complete"}`}
                        />

                        {/* Event Icon */}
                        <div className="text-2xl mt-1">
                          {getEventTypeIcon(event.type)}
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 min-w-0">
                            <h3
                              className={`font-medium text-foreground truncate ${
                                event.completed ? "line-through" : ""
                              }`}
                            >
                              {event.title}
                            </h3>
                            <Badge className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>

                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {getRelativeDate(event.date)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge + Actions */}
                      <div className="ml-4 flex items-start gap-2">
                        <Badge className={status.color}>{status.label}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingEvent(event)}
                          aria-label={`Edit ${event.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              aria-label={`Delete ${event.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove "{event.title}" from your calendar. This
                                can't be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteEvent(event.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Event Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {events.filter((e) => e.type === "assignment").length}
              </div>
              <div className="text-sm text-muted-foreground">Assignments</div>
            </div>
            <div className="text-center p-3 border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {events.filter((e) => e.type === "exam").length}
              </div>
              <div className="text-sm text-muted-foreground">Exams</div>
            </div>
            <div className="text-center p-3 border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {events.filter((e) => e.type === "reading").length}
              </div>
              <div className="text-sm text-muted-foreground">Readings</div>
            </div>
            <div className="text-center p-3 border border-border rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {events.filter((e) => e.date >= new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent>
          {editingEvent && (
            <EditEventForm
              event={editingEvent}
              onSave={(updated) => {
                onUpdateEvent(updated)
                setEditingEvent(null)
              }}
              onCancel={() => setEditingEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface EditEventFormProps {
  event: CalendarEvent
  onSave: (event: CalendarEvent) => void
  onCancel: () => void
}

function EditEventForm({ event, onSave, onCancel }: EditEventFormProps) {
  const [title, setTitle] = useState(event.title)
  const [type, setType] = useState<CalendarEvent["type"]>(event.type)
  const [description, setDescription] = useState(event.description || "")
  // datetime-local expects "YYYY-MM-DDTHH:mm" in local time
  const toLocalInputValue = (date: Date) => {
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - offset * 60 * 1000)
    return local.toISOString().slice(0, 16)
  }
  const [dateValue, setDateValue] = useState(toLocalInputValue(new Date(event.date)))

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      ...event,
      title: title.trim(),
      type,
      description: description.trim() || undefined,
      date: new Date(dateValue),
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogDescription>
          Update the details below. This is handy when the AI extraction gets a date or title slightly wrong.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-date">Date & time</Label>
          <Input
            id="edit-date"
            type="datetime-local"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-type">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as CalendarEvent["type"])}>
            <SelectTrigger id="edit-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Description (optional)</Label>
          <Textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          Save Changes
        </Button>
      </DialogFooter>
    </>
  )
}