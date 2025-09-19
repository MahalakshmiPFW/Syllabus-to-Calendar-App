"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Loader2, AlertCircle, Type } from "lucide-react"
import type { CalendarEvent } from "@/app/page"

interface FileUploadProps {
  onFileProcessed: (events: CalendarEvent[]) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export function FileUpload({ onFileProcessed, isProcessing, setIsProcessing }: FileUploadProps) {
  const [inputType, setInputType] = useState<"pdf" | "text">("pdf")
  const [textInput, setTextInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const generateMockData = (): CalendarEvent[] => {
    return [
      {
        id: "1",
        title: "Assignment 1: Research Paper",
        date: new Date(new Date("2025-02-15").getTime() + 24 * 60 * 60 * 1000),
        type: "assignment",
        description: "Submit 5-page research paper on contract law",
      },
      {
        id: "2",
        title: "Midterm Exam",
        date: new Date(new Date("2025-03-10").getTime() + 24 * 60 * 60 * 1000),
        type: "exam",
        description: "Covers chapters 1-5",
      },
      {
        id: "3",
        title: "Reading: Chapter 6-8",
        date: new Date(new Date("2025-02-20").getTime() + 24 * 60 * 60 * 1000),
        type: "reading",
        description: "Read assigned chapters before class",
      },
      {
        id: "4",
        title: "Final Project Due",
        date: new Date(new Date("2025-04-25").getTime() + 24 * 60 * 60 * 1000),
        type: "assignment",
        description: "Complete final project presentation",
      },
      {
        id: "5",
        title: "Final Exam",
        date: new Date(new Date("2025-05-05").getTime() + 24 * 60 * 60 * 1000),
        type: "exam",
        description: "Comprehensive final examination",
      },
    ]
  }

  const handlePdfFile = async (file: File) => {
    if (!file.type.includes("pdf")) {
      setError("Please upload a PDF file")
      return
    }

    setError(null)
    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      const mockEvents = generateMockData()
      onFileProcessed(mockEvents)
      setIsProcessing(false)
    }, 2000)
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setError("Please enter some syllabus text")
      return
    }

    setError(null)
    setIsProcessing(true)
    console.log("[v0] Starting text processing...")

    try {
      const response = await fetch("/api/extract-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput }),
      })

      const data = await response.json()
      console.log("[v0] API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to process text")
      }

      const events = data.events || []
      console.log("[v0] Extracted events:", events)

      if (events.length === 0) {
        setError("No calendar events found in the text. Please include dates and assignments.")
        setIsProcessing(false)
        return
      }

      const processedEvents = events.map((event: any) => ({
        ...event,
        date: new Date(new Date(event.date).getTime() + 24 * 60 * 60 * 1000),
      }))
      console.log("[v0] Processed events with dates:", processedEvents)

      onFileProcessed(processedEvents)
      console.log("[v0] Called onFileProcessed callback")
    } catch (error) {
      console.error("Error processing text:", error)
      setError(error instanceof Error ? error.message : "Error processing text. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePdfFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 justify-center">
        <Button
          variant={inputType === "pdf" ? "default" : "outline"}
          onClick={() => setInputType("pdf")}
          disabled={isProcessing}
        >
          <FileText className="h-4 w-4 mr-2" />
          PDF Upload
        </Button>
        <Button
          variant={inputType === "text" ? "default" : "outline"}
          onClick={() => setInputType("text")}
          disabled={isProcessing}
        >
          <Type className="h-4 w-4 mr-2" />
          Text Input
        </Button>
      </div>

      {inputType === "pdf" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload PDF Syllabus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Processing PDF and generating calendar events...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Upload your syllabus PDF</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We'll generate sample calendar events for demo purposes
                    </p>
                  </div>
                  <Button asChild>
                    <label className="cursor-pointer">
                      Choose PDF File
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={isProcessing}
                      />
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {inputType === "text" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Paste Syllabus Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your syllabus text here... Include dates, assignments, exams, and readings."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[200px]"
              disabled={isProcessing}
            />
            <Button onClick={handleTextSubmit} disabled={isProcessing || !textInput.trim()} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                "Extract Calendar Events"
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              🤖 Uses AI to intelligently extract dates and assignments from your text
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
