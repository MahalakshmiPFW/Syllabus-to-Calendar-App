import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    let extractedText = ""

    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const textDecoder = new TextDecoder("utf-8", { ignoreBOM: true })

      // Convert to string and extract readable text
      const rawContent = textDecoder.decode(uint8Array)
      extractedText = extractReadableText(rawContent)
    } else if (file.type === "text/plain") {
      extractedText = await file.text()
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload a PDF or text file." }, { status: 400 })
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract sufficient text from the file. Please ensure the file contains readable text or try a different PDF.",
        },
        { status: 400 },
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that extracts calendar events from syllabus text. 
          Extract assignments, exams, readings, and due dates. 
          Return ONLY a JSON array of events in this exact format:
          [{"title": "Assignment 1 Due", "date": "2025-01-24", "type": "assignment", "description": "Brief description"}]
          
          Types should be: "assignment", "exam", "reading", or "other"
          Dates must be in YYYY-MM-DD format. If year is missing, assume 2025.
          If you cannot extract any events, return an empty array: []`,
        },
        {
          role: "user",
          content: `Extract calendar events from this syllabus:\n\n${extractedText.substring(0, 4000)}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim()

    if (!aiResponse) {
      return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
    }

    let events = []
    try {
      // Clean the response to ensure it's valid JSON
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, "").trim()
      events = JSON.parse(cleanResponse)

      if (!Array.isArray(events)) {
        console.log("AI response was not an array:", cleanResponse)
        events = []
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      console.log("AI response was:", aiResponse)
      events = []
    }

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process file",
      },
      { status: 500 },
    )
  }
}

function extractReadableText(content: string): string {
  // Remove binary data and keep only printable ASCII characters
  let text = content.replace(/[^\x20-\x7E\n\r\t]/g, " ")

  // Clean up multiple spaces and newlines
  text = text.replace(/\s+/g, " ")

  // Split into lines and filter for meaningful content
  const lines = text.split(/[\n\r]+/)
  const meaningfulLines = lines.filter((line) => {
    const trimmed = line.trim()
    return trimmed.length > 5 && /[a-zA-Z]/.test(trimmed)
  })

  return meaningfulLines.join("\n").trim()
}
