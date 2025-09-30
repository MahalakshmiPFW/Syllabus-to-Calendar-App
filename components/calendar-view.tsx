"use client"

import { useState } from "react"
import type { CalendarEvent } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { formatDate, getEventTypeColor, getEventTypeIcon } from "@/lib/text-processor"

interface CalendarViewProps {
  events: CalendarEvent[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // === Added: allow quick month/year selection ===
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10)
    const newDate = new Date(currentDate)
    newDate.setMonth(newMonth)
    setCurrentDate(newDate)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10)
    const newDate = new Date(currentDate)
    newDate.setFullYear(newYear)
    setCurrentDate(newDate)
  }

  // === Calendar logic ===
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const firstDayOfCalendar = new Date(firstDayOfMonth)
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay())

  const calendarDays = []
  const currentCalendarDate = new Date(firstDayOfCalendar)
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentCalendarDate))
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1)
  }

  const eventsByDate = events.reduce(
    (acc, event) => {
      const dateKey = event.date.toDateString()
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(event)
      return acc
    },
    {} as Record<string, CalendarEvent[]>,
  )

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => setCurrentDate(new Date())

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString()
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth()

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ]
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

  // Generate list of years (±10 years around current)
  const yearOptions = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i)

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {/* === Replaced static title with dropdowns === */}
              <select
                className="bg-transparent font-semibold"
                value={currentDate.getMonth()}
                onChange={handleMonthChange}
              >
                {monthNames.map((month, idx) => (
                  <option key={month} value={idx}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="bg-transparent font-semibold"
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((date, index) => {
              const dateKey = date.toDateString()
              const dayEvents = eventsByDate[dateKey] || []
              const isCurrentMonthDay = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-1 border border-border ${
                    isCurrentMonthDay ? "bg-card" : "bg-muted/30"
                  } ${isTodayDate ? "ring-2 ring-primary" : ""}`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isCurrentMonthDay ? "text-foreground" : "text-muted-foreground"
                    } ${isTodayDate ? "text-primary font-bold" : ""}`}
                  >
                    {date.getDate()}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                        title={`${event.title} - ${formatDate(event.date)}`}
                      >
                        <span className="mr-1">{getEventTypeIcon(event.type)}</span>
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground p-1">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter((event) => event.date >= new Date())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{getEventTypeIcon(event.type)}</div>
                    <div>
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))}

            {events.filter((event) => event.date >= new Date()).length === 0 && (
              <p className="text-muted-foreground text-center py-4">No upcoming events found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
